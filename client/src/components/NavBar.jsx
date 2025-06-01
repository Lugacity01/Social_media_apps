import React, { useEffect, useState } from "react";

import { CiSearch } from "react-icons/ci";
import ProfileImage from "./ProfileImage";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const NavBar = () => {
  const [user, setUser] = useState({});
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const token = useSelector((state) => state?.user?.currentUser?.token);

  // const profilePhoto = useSelector(
  //   (state) => state?.user?.currentUser?.profilePhoto
  // );
  // const profilePhoto = useSelector(
  //   (state) => state?.user?.currentUser?.profilePhoto
  // );

  // console.log("DIspaly the profilePhoto", profilePhoto);

  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response?.data);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  // LOGOUT USER AFTER 1HR
  useEffect(() => {
    setTimeout(() => {
      navigate("/logout");
    }, 1000 * 60 * 60);
  }, []);

  // const {id:userId, token, profilePhoto} = useSelector((state) => state?.user?.currentUser?.id);

  return (
    <nav className="navbar">
      <div className="container navbar__container">
        <Link to="/" className="navbar__logo">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#3385ff] flex items-center justify-center text-white font-bold text-xl">
                Y
              </div>
              <span className="ml-2 text-xl font-bold ">YankApp</span>
            </div>
          </div>
        </Link>
        <form className="navbar__search">
          <input type="search" placeholder="Search" />
          <button type="submit">
            <CiSearch />
          </button>
        </form>

        <div className="navbar__right">
          <Link to={`/app/users/${userId}`} className="navbar__profile ">
            <ProfileImage image={user?.profilePhoto} />
          </Link>

          {token ? (
            <Link to="/logout">Logout</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
