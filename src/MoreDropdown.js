import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import "./MoreDropdown.css";

function MoreDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="more-dropdown">
      <FiMoreVertical size={25} onClick={() => setOpen(!open)} />
      {open && (
        <div className="dropdown-menu">
          <Link to="/about" onClick={() => setOpen(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact Us</Link>
          <Link to="/suggestions" onClick={() => setOpen(false)}>Suggestions</Link>
        </div>
      )}
    </div>
  );
}

export default MoreDropdown;
