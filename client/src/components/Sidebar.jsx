import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { GoMail } from "react-icons/go";
import { FaRegBookmark } from "react-icons/fa";
import { PiPaintBrushBold } from "react-icons/pi";
import { uiSliceActions } from "../store/ui-slice";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch();

  const openThemeModal = () => {
    dispatch(uiSliceActions.openThemeModal());
  };

  return (
    <menu className="sidebar">
      <NavLink
        to=""
        className={`sidebar__item ${({ isActive }) =>
          isActive ? "active" : ""}`}
      >
        <i className="Sidebar__icon">
          <AiOutlineHome />
        </i>
        <p>Home</p>
      </NavLink>

      <NavLink
        to="/app/messages"
        className={`sidebar__item ${({ isActive }) =>
          isActive ? "active" : ""}`}
      >
        <i className="Sidebar__icon">
          <GoMail />
        </i>
        <p>Messages</p>
      </NavLink>

      <NavLink
        to="/app/bookmarks"
        className={`sidebar__item ${({ isActive }) =>
          isActive ? "active" : ""}`}
      >
        <i className="Sidebar__icon">
          <FaRegBookmark />
        </i>
        <p>Bookmarks</p>
      </NavLink>

      <a
        className={`sidebar__item ${({ isActive }) =>
          isActive ? "active" : ""}`}
        onClick={openThemeModal}
      >
        <i className="Sidebar__icon">
          <PiPaintBrushBold />
        </i>
        <p>Themes</p>
      </a>
    </menu>
  );
};

export default Sidebar;
