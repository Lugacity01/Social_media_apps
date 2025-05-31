import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../components/CreatePost";
import axios from "axios";
import { toast } from "react-toastify";
import Feeds from "../components/Feeds";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // const [successMessage, setSuccessMessage] = useState("");
  const token = useSelector((state) => state?.user?.currentUser?.token);

  // Funtion to create a post
  const createPost = async (data) => {
    setError("");
    // setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        data,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      const newPost = response?.data;
      console.log("Post created successfully", newPost);
      setPosts([newPost, ...posts]);
      // setSuccessMessage(response?.data?.message)

      toast.success(response?.data?.message || "Post created successfully!"); // ✅ Show toast
    } catch (err) {
      // setError(err?.response?.data?.message);
      toast.error(err?.response?.data?.message);
    } finally {
      // setIsLoading(false);
    }
  };

  // FUNTION TO GET POST
  const getPosts = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(response?.data)
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    getPosts()
  }, [setPosts])

  console.log(posts)

  return (
    <section className="mainArea">
      <CreatePost onCreatePost={createPost} loading={isLoading} error={error} />

      <Feeds posts={posts} onSetPosts={setPosts}/>
    </section>
  );
};

export default Home;
