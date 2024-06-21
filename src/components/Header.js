import React, { useState } from "react";
import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
const Header = () => {
  const [activeBox, setActiveBox] = useState(null);
  const navigate = useNavigate();
  const handleClick = (box) => {
    setActiveBox(box.class);
    navigate(box.path);
  };
  return (
    <div className="header-container">
      <NavLink className="header-box" to="/" activeClassName="active">
        Path Finding Visualization
      </NavLink>
      <NavLink className="header-box" to="/sorting" activeClassName="active">
        Sorting
      </NavLink>
    </div>
  );
};

export default Header;
