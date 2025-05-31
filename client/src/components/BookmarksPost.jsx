import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const BookmarksPost = ({ post }) => {
  const [user, setUser] = useState({});
  const [postBookmarked, setPostBookmarked] = useState(
    user?.bookmarks?.includes(post?._id)
  );
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log("Get user", response);
       if (response?.data?.bookmarks?.includes(post?._id)) {
        setPostBookmarked(true);
        // toast.success(response?.data?.message);
      } else {
        setPostBookmarked(false);
        // toast.success(response?.data?.message);
      }

      setUser(response?.data);
    } catch (err) {
      // toast.error(err?.response?.data?.message);
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, [user, postBookmarked]);

  //   FUNCTION FOR CREATING BOOKMARKS
  const createBookmark = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmark`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response?.data?.bookmarks?.includes(post?._id)) {
        setPostBookmarked(true);
        toast.success(response?.data?.message);
      } else {
        setPostBookmarked(false);
        toast.success(response?.data?.message);
      }
      setUser(response?.data);
      console.log("Create BookmarksPost", response);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <button className="feed__footer-bookmark" onClick={createBookmark}>
      {postBookmarked ? "1" : "2"}
      {/* {postBookmarked ? <FaBookmark/> : <FaRegBookmark/>} */}
    </button>
  );
};

export default BookmarksPost;
