import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { HashLink } from "react-router-hash-link";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import { FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import jwt_decode from "jwt-decode";
import { useMemo } from "react";
import { useCallback } from "react";

const Navbar = () => {
  const [iconActive, setIconActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("token") || "");
  const [user] = useState(
    localStorage.getItem("token")
      ? jwt_decode(localStorage.getItem("token"))
      : ""
  );

  const logoutFunc = useCallback(() => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
  }, [dispatch, navigate]);

  const navItems = useMemo(
    () => [
      { path: "/", label: "Home" },

      ...(token && user.isAdmin
        ? [{ path: "/dashboard/users", label: "Dashboard" }]
        : token && user.isDoctor
        ? [
            { path: "/appointments", label: "Appointments" },
            { path: "/notifications", label: "Notifications" },
            { path: "/profile", label: "Profile" },
          ]
        : token && [
            { path: "/doctors", label: "Book an appointment" },
            { path: "/appointments", label: "Appointments" },
            { path: "/notifications", label: "Notifications" },
            { path: "/applyfordoctor", label: "Apply to Peer" },
            { path: "/#contact", label: "Contact Us", isHashLink: true },
            { path: "/profile", label: "Profile" },
          ]),
      ...(!token
        ? [
            { path: "/login", label: "Login", isButton: true },
            { path: "/register", label: "Register", isButton: true },
          ]
        : [{ action: logoutFunc, label: "Logout", isAction: true }]),
    ],
    [token, user.isAdmin, user.isDoctor, logoutFunc]
  );

  return (
    <header>
      <nav className={iconActive ? "nav-active" : ""}>
        <h2 className="nav-logo">
          <NavLink to={"/"}>Mental Health App</NavLink>
        </h2>
        <ul className="nav-links">
          {navItems.map((item, index) =>
            item.isHashLink ? (
              <li key={index}>
                <HashLink to={item.path}>{item.label}</HashLink>
              </li>
            ) : item.isAction ? (
              <li key={index}>
                <span className="btn" onClick={item.action}>
                  {item.label}
                </span>
              </li>
            ) : (
              <li key={index}>
                <NavLink
                  className={item.isButton ? "btn" : ""}
                  to={item.path}
                  onClick={() => setIconActive(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            )
          )}
        </ul>
      </nav>
      <div className="menu-icons">
        {!iconActive && (
          <FiMenu
            className="menu-open"
            onClick={() => {
              setIconActive(true);
            }}
          />
        )}
        {iconActive && (
          <RxCross1
            className="menu-close"
            onClick={() => {
              setIconActive(false);
            }}
          />
        )}
      </div>
    </header>
  );
};

export default Navbar;
