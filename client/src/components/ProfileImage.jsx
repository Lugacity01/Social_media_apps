import React from "react";

const ProfileImage = ({ image, className }) => {
  return (
    <div className={`profileImage ${className}`}>
      <img src={image} alt="" className=""/>
    </div>
  );
};

export default ProfileImage;
