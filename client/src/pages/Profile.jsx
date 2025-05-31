import { useEffect, useState } from "react";
import HeaderInfo from "../components/HeaderInfo";
import UserProfile from "../components/UserProfile";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Feed from "../components/Feed";
import EditPostModal from "../components/EditPostModal";
import EditProfileModal from "../components/EditProfileModal";

const Profile = () => {
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const editPostModalOpen = useSelector(
    (state) => state?.ui?.editPostModalOpen
  );
  const editProfileModalOpen = useSelector(
    (state) => state?.ui?.editProfileModalOpen
  );

  const { id: userId } = useParams();
  const token = useSelector((state) => state?.user?.currentUser?.token);

  // GET USER POSTS
  const getUserPosts = async () => {
    setisLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/posts`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response?.data);
      setUserPosts(response?.data.posts);
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    } finally {
      setisLoading(false);
    }
  };


  // THE A POST
  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setUserPosts(userPosts?.filter((p) => p?._id != postId));
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    }
  };

  const updatePost = async (data, postId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        data,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status == 200) {
        const updatedPost = response?.data;
        setUserPosts(
          userPosts?.map((post) => {
            if (updatedPost?._id.toString() == post?._id.toString()) {
              post.body = updatedPost?.body;
            }
            return post;
          })
        );
      }
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    }
  };
  // console.log("ALl user posts",userPosts)

    useEffect(() => {
    // getUser();
    getUserPosts();
  }, [userId]);


  return (
    <section>
      <UserProfile />
      <HeaderInfo text={`${user?.fullName}'s posts`} />

      <section className="profile__posts">
        {userPosts?.length < 1 ? (
          <p className="center">No posts by this user</p>
        ) : (
          userPosts?.map((post) => (
            <Feed key={post?._id} post={post} onDeletePost={deletePost} />
          ))
        )}
      </section>

      {editPostModalOpen && <EditPostModal onUpdatePost={updatePost} />}
      {editProfileModalOpen && <EditProfileModal onUpdatePost={updatePost} />}
    </section>
  );
};

export default Profile;
