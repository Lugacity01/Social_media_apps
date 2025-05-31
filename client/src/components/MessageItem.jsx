import React from "react";
import { useSelector } from "react-redux";
import ProfileImage from "./ProfileImage";

const MessageItem = ({ message, imageSender, receiverPhoto }) => {
  const userId = useSelector((state) => state?.user?.currentUser?.id);

  const isSentByCurrentUser = message?.senderId === userId;

  const profilePhoto = isSentByCurrentUser ? imageSender : receiverPhoto;

  return (
    <li
      className={`messagesBox__message ${
        isSentByCurrentUser ? "sent" : "received"
      }`}
    >
      <div className="messageItem__avatar">
        <ProfileImage image={profilePhoto} />
      </div>
      <p className="messageItem__text">{message?.text}</p>
    </li>
  );
};

export default MessageItem;
