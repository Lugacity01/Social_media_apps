import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const LikeDislikePost = (props) => {
  const [post, setPost] = useState(props.post);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const [postLiked, setPostLiked] = useState(post?.likes?.includes?.userId);

  const handLikeDislikePost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/like`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(response?.data);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };


  // FUNTION TO CHECK IF POST IS LIKED OR NOT
  const handleCheckIfUserLikedPost = () => {
    if (post?.likes?.includes(userId)) {
      setPostLiked(true);
    } else {
      setPostLiked(false);
    }
  };

  useEffect(() => {
    handleCheckIfUserLikedPost();
  }, [post]);

  return (
    <button className="feed__footer-comments" onClick={handLikeDislikePost}>
      {postLiked ? <FcLike /> : <FaRegHeart />}
      <small>{post?.likes?.length}</small>
    </button>
  );
};

export default LikeDislikePost;
