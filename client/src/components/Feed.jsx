import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import TimeAgo from "react-timeago";
import { HiDotsHorizontal } from "react-icons/hi";
import ProfileImage from "./ProfileImage";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import LikeDislikePost from "./LikeDislikePost";
import Trimtext from "../helpers/Trimtext";
import BookmarksPost from "./BookmarksPost";
import { uiSliceActions } from "../store/ui-slice";

const Feed = ({ post, onDeletePost }) => {
  const [creator, setCreator] = useState({});
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const dispatch = useDispatch();
  const location = useLocation();

  const getPostCreator = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${post?.creator}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setCreator(response?.data);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getPostCreator();
  }, []);

  const closeFeedHeaderMenu = () => {
    setShowFeedHeaderMenu(false);
  };

  const showEditPostModal = () => {
    dispatch(uiSliceActions?.openEditPostModal(post?._id));
    closeFeedHeaderMenu();
  };

  const deletePost = () => {
    onDeletePost(post?._id);
    closeFeedHeaderMenu();
  };

  return (
    <article className="feed">
      <header className="feed__header">
        <Link to={`/app/users/${post?.creator}`} className="feed__header-profile">
          <ProfileImage image={creator?.profilePhoto} />
          <div className="feed__header-details">
            <h4>{creator?.fullName}</h4>
            <small>
              <TimeAgo date={post?.createdAt} />
            </small>
          </div>
        </Link>

        {/* IF I AM THE ONE THAT CREATED THE POST */}
        {showFeedHeaderMenu &&
          userId == post?.creator &&
          location.pathname.includes("users") && (
            <menu className="feed__header-menu">
              <button onClick={showEditPostModal}>Edit</button>
              <button onClick={deletePost}>Delete</button>
            </menu>
          )}

        {userId == post?.creator && location.pathname.includes("users") && (
          <button onClick={() => setShowFeedHeaderMenu(!showFeedHeaderMenu)}>
            <HiDotsHorizontal />
          </button>
        )}
      </header>

      <Link to={`posts/${post?._id}`} className="feed__body">
        <p>
          <Trimtext item={post?.body} maxLength={160} />
        </p>
        <div className="feed__images">
          <img src={post?.image} alt="" />
        </div>
      </Link>

      <footer className="feed__footer">
        <div>
          <LikeDislikePost post={post} />
          <button className="feed__footer-comments">
            <Link to={`/posts/${post?._id}`}>
              <FaRegCommentDots />
            </Link>
            <small>{post?.comments?.length}</small>
          </button>

          <button className="feed__footer-share">
            <IoMdShare />
          </button>
        </div>
        <BookmarksPost post={post} />
      </footer>
    </article>
  );
};

export default Feed;
