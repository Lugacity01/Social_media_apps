// const HttpError = require("../middleware/errorMiddleware");
const HttpError = require("../models/errorModel");
const PostModel = require("../models/postModels");
const UserModel = require("../models/userModel");

const { v4: uuid } = require("uuid");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");

// ==================== CREATE POST
// POST : api/posts and is a PROTECTED ROUTE

const createPost = async (req, res, next) => {
  try {
    const { body } = req.body;

    if (!body) {
      return next(new HttpError("Fill in text field and choose image", 422));
    }

    const image = req.files?.image;
    if (!image) {
      return next(new HttpError("Please choose an image", 422));
    }

    if (image.size > 1000000) {
      return next(
        new HttpError("Image too big, should be less than 1MB", 422)
      );
    }

    // Upload directly from buffer to Cloudinary (no local disk write)
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error || !result.secure_url) {
          return next(
            new HttpError("Couldn't upload image to Cloudinary", 400)
          );
        }

        // Save post to database
        const newPost = await PostModel.create({
          creator: req.user.id,
          body,
          image: result.secure_url,
        });

        await UserModel.findByIdAndUpdate(newPost?.creator, {
          $push: { posts: newPost?._id },
        });

        res.json({ newPost, message: "Post created successfully" });
      }
    );

    // Pipe image data to Cloudinary upload stream
    const streamifier = require("streamifier");
    streamifier.createReadStream(image.data).pipe(result);

  } catch (error) {
    return next(new HttpError(error));
  }
};


// ==================== GET POST
// GET : api/posts/:id and is a PROTECTED ROUTE

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const post = await PostModel.findById(id);
    const post = await PostModel.findById(id)
      .populate("creator")
      .populate({ path: "comments", options: { sort: { createdAt: -1 } } });
    res.json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ==================== GET ALL POSTS
// GET : api/posts and is a PROTECTED ROUTE

const getPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ==================== UPDATE POST
// PATCH : api/posts/:id and is a PROTECTED ROUTE

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { body } = req.body;
    // GET POST FROM DB
    const post = await PostModel.findById(postId);
    // CHECK IF CREATOR OF THE POST IS THE LOGGED IN USER
    if (post?.creator != req.user.id) {
      return next(
        new HttpError(
          "You can't update this post since you are not the creator",
          403
        )
      );
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { body },
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ==================== DELETE POSTS
// DELETE : api/posts/:id and is a PROTECTED ROUTE

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    // GET POST FROM DB
    const post = await PostModel.findById(postId);
    // CHECK IF CREATOR OF THE POST IS THE LOGGED IN USER
    if (post?.creator != req.user.id) {
      return next(
        new HttpError(
          "You can't update this post since you are not the creator",
          403
        )
      );
    }

    const deletedPost = await PostModel.findByIdAndDelete(postId);
    await UserModel.findByIdAndUpdate(post?.creator, {
      $pull: { posts: post?._id },
    });
    res.json({
      deletedPost,
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ==================== GET FOLLOWING POSTS
// GET : api/posts/following and is a PROTECTED ROUTE

const getFollowingPosts = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    const posts = await PostModel.find({ creator: { $in: user?.following } });
    res.json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ==================== LIKE OR DISLIKE POSTS
// GET : api/posts/:id/like and is a PROTECTED ROUTE

const likeDislikePosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id);
    // Check if the logged in user has already liked post

    let updatedPost;
    if (post?.likes.includes(req.user.id)) {
      updatedPost = await PostModel.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user.id } },
        { new: true }
      );
    } else {
      updatedPost = await PostModel.findByIdAndUpdate(
        id,
        { $push: { likes: req.user.id } },
        { new: true }
      );
    }
    res.json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ==================== GET USER POSTS
// GET : api/users/:id/posts and is a PROTECTED ROUTE

const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // console.log("Fetching posts for user:", userId);

    const posts = await UserModel.findById(userId).populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
    });

    res.json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ==================== CREATE BOOKMARK
// POST : api/post/:id/bookmark and is a PROTECTED ROUTE

const createBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    // get user and check if post is already in his bookmarks, if so then remove post, otherwise add post
    const user = await UserModel.findById(req.user.id);
    const postIsBookmarked = user?.bookmarks?.includes(id);
    if (postIsBookmarked) {
      const userBookmarks = await UserModel.findByIdAndUpdate(
        req.user.id,
        { $pull: { bookmarks: id } },
        { new: true }
      );
      res.json({
        userBookmarks,
        success: true,
        message: "Bookmark Removed Successfully",
      });
    } else {
      const userBookmarks = await UserModel.findByIdAndUpdate(
        req.user.id,
        { $push: { bookmarks: id } },
        { new: true }
      );
      res.json({
        userBookmarks,
        success: true,
        message: "Bookmark Added Successfully",
      });
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

// ==================== GET BOOKMARK
// POST : api/bookmark and is a PROTECTED ROUTE

const getUserBookmarks = async (req, res, next) => {
  try {
    const userBookmarks = await UserModel.findById(req.user.id).populate({
      path: "bookmarks",
      options: { sort: { createdAt: -1 } },
    });
    res.json(userBookmarks);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  getUserBookmarks,
  createBookmark,
  likeDislikePosts,
  getFollowingPosts,
};
