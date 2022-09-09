import React from "react";
import NotesIcon from "../images/file.svg";
import UserProfile from "../images/user.svg";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-header">
        <img className="note-icon" src={NotesIcon} alt="icon" />
        <h1 className="heading">Keep Notes</h1>
      </div>
      <a href="https://github.com/aniket-6234/Keep-Notes" target="_blank">
        <div className="user">
          <img className="icon" src={UserProfile} alt="icon" title="User" />
        </div>
      </a>
    </nav>
  );
};

export default Navbar;
