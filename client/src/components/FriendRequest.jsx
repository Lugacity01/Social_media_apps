import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import Trimtext from "../helpers/Trimtext";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

const FriendRequest = ({ friend, onFilterFriend }) => {
  // const userId = useSelector((state) => state?.user?.currentUser?.id);
  const token = useSelector((state) => state?.user?.currentUser?.token);

  const followUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${friend?._id}/follow-unfollow`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      onFilterFriend(friend?._id); //closefriend badge
      //   setFriends(response?.data);
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    }
  };

  return (
    <article className="friendRequest">
      <div className="friendRequest__info">
        <Link to={`/users/${friend?._id}`}>
          <ProfileImage image={friend?.profilePhoto} />
        </Link>
        <div className="friendRequest__details">
          <Link to={`/users/${friend?._id}`}>
            <h5>{friend?.fullName}</h5>
          </Link>
          <small>
            <Trimtext item={friend?.email} maxLength={20} />
          </small>
        </div>
      </div>
      <div className="friendRequest__actions">
        <button className="friendRequest__actions-approve" onClick={followUser}>
          <FaCheck />
        </button>
        <button
          className="friendRequest__actions-approve"
          onClick={() => onFilterFriend(friend?._id)}
        >
          <IoMdClose />
        </button>
      </div>
    </article>
  );
};

export default FriendRequest;
