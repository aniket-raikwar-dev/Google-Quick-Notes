import React from 'react';
import EditIcon from "../images/lightbulb.svg"
import ReminderIcon from "../images/bell.svg"
import ArchiveIcon from "../images/archive.svg"
import PinIcon from "../images/pin.svg";
import TrashIcon from "../images/trash.svg";


const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header-pinned">
        <img className="bulb-icon" src={EditIcon} alt="icon" />
        <h1 className="sidebar-heading">Notes</h1>
      </div>
      <div className="sidebar-header">
        <img className="sidebar-icon" src={ReminderIcon} alt="icon" />
        <h1 className="sidebar-heading">Reminders</h1>
      </div>
      <div className="sidebar-header">
        <img className="sidebar-icon" src={ArchiveIcon} alt="icon" />
        <h1 className="sidebar-heading">Archive</h1>
      </div>
      <div className="sidebar-header">
        <img className="sidebar-icon" src={PinIcon} alt="icon" />
        <h1 className="sidebar-heading">Pinned</h1>
      </div>
      <div className="sidebar-header">
        <img className="sidebar-icon" src={TrashIcon} alt="icon" />
        <h1 className="sidebar-heading">Trash</h1>
      </div>
    </div>
  );
}

export default Sidebar