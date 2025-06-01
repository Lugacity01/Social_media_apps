import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { LuUpload } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { userActions } from "../store/user-slice";
import { uiSliceActions } from "../store/ui-slice";

const UserProfile = () => {
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const loggedInUserId = useSelector((state) => state?.user?.currentUser?.id);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  const { id: userId } = useParams();

  const [user, setUser] = useState({});
  const [followsUser, setFollowsUser] = useState(
    user?.followers?.includes(loggedInUserId)
  );
  const [avatar, setAvatar] = useState(user?.profilePhoto);
  const [avatarTouched, setAvatarTouched] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // GET USER FROM DB
  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response?.data);
      setFollowsUser(response?.data?.followers?.includes(loggedInUserId));
      setAvatar(response?.data?.profilePhoto);
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    }
  };

  // console.log("User", user )

  //   FUNTION TO CHANGE AVATAR/PROFILE PHOTO
  const changeAvatarHandler = async (e) => {
    e.preventDefault();
    setAvatarTouched(true);

    try {
      const postData = new FormData();
      postData.set("avatar", avatar);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/avatar`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(
        userActions?.changeCurrentUser({
          ...currentUser,
          profilePhoto: response?.data?.profilePhoto,
        })
      );
      navigate(0);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const openEditProfileModal = () => {
    dispatch(uiSliceActions.openEditProfileModal());
  };

  const FollowUnFollowUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/follow-unfollow`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowsUser(response?.data?.followers?.includes(loggedInUserId));
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId, followsUser, avatar]);

  return (
    <section className="profile">
      <div className="profile__container">
        <form
          className="profile__image"
          onSubmit={changeAvatarHandler}
          encType="multipart/form-data"
        >
          <img src={user?.profilePhoto} alt="" />
          {!avatarTouched ? (
            <label htmlFor="avatar" className="profile__image-edit">
              <span>
                <LuUpload />
              </span>
            </label>
          ) : (
            <button className="profile__image-btn">
              <FaCheck />
            </button>
          )}
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={(e) => {
              setAvatar(e.target.files[0]);
              setAvatarTouched(true);
            }}
            accept="png, jpg, jpeg"
          />
        </form>

        <h4>{user?.fullName}</h4>
        <small>{user?.email}</small>
        <ul className="profile__follows">
          <li>
            <h4>{user?.following?.length}</h4>
            <small>Following</small>
          </li>

          <li>
            <h4>{user?.followers?.length}</h4>
            <small>Followers</small>
          </li>

          <li>
            <h4>0</h4>
            <small>Likes</small>
          </li>
        </ul>

        <div className="profile__actions-wrapper">
          {user?._id == loggedInUserId ? (
            <button className="btn" onClick={openEditProfileModal}>
              {" "}
              Edit Profile
            </button>
          ) : (
            <button className="btn dark" onClick={FollowUnFollowUser}>
              {followsUser ? "Unfollow" : "Follow"}
            </button>
          )}
          {user?._id != loggedInUserId && (
            <Link to={`/app/messages/${user?._id}`} className="btn default">
              {" "}
              Message
            </Link>
          )}
        </div>
        <article className="profile__bio">{user?.bio}</article>
      </div>
    </section>
  );
};

export default UserProfile;
