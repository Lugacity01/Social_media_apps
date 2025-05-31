import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { uiSliceActions } from "../store/ui-slice";

const EditProfileModal = () => {
  const [userData, setUserData] = useState({ fullName: "", bio: "" });
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const id = useSelector((state) => state?.user?.currentUser?.id);
  const dispatch = useDispatch();

  // GET USER FROM DATABASE
  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(response?.data);
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const closeModal = (e) => {
    if(e.target.classList.contains('editProfile')){
        dispatch(uiSliceActions.closeEditProfileModal())
    }
  };


//   UPDATE USER PROFILE  
  const updateUser = async () => {
     try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/edit`, userData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal()
    //   setUserData(response?.data);
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    }
  };


  const changeUserData = (e) => {
    setUserData((prevState) =>{
        return {...prevState, [e.target.name]: e.target.value}
    })
  };
  return (
    <section className="editProfile" onClick={(e) => closeModal(e)}>
        <div className="editProfile__container">
            <h3>Edit Profile</h3>
            <form onSubmit={updateUser}>
                <input placeholder="Full Name" type="text" name="fullName" value={userData?.fullName} onChange={changeUserData}/>
                <textarea placeholder="Bio" name="bio" value={userData?.bio} onChange={changeUserData}/>
                <button className="btn primary">Update</button>
            </form>
        </div>
    </section>
  );
};

export default EditProfileModal;
