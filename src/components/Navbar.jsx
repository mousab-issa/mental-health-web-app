import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { HashLink } from "react-router-hash-link";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { useMemo } from "react";
import { useCallback } from "react";
import { logout } from "../redux/reducers/auth.slice";

const Navbar = () => {
  const [iconActive, setIconActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const logoutFunc = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const navItems = useMemo(
    () => [
      { path: "/", label: "Home" },
      ...(user?.isAdmin
        ? [{ path: "/dashboard/users", label: "Dashboard" }]
        : user?.isDoctor
        ? [
            { path: "/appointments", label: "Appointments" },
            { path: "/notifications", label: "Notifications" },
            { path: "/profile", label: "Profile" },
          ]
        : user
        ? [
            { path: "/doctors", label: "Book an appointment" },
            { path: "/appointments", label: "Appointments" },
            { path: "/notifications", label: "Notifications" },
            { path: "/applyfordoctor", label: "Apply to Peer" },
            { path: "/#contact", label: "Contact Us", isHashLink: true },
            { path: "/profile", label: "Profile" },
          ]
        : []),
      ...(!user
        ? [
            { path: "/login", label: "Login", isButton: true },
            { path: "/register", label: "Register", isButton: true },
          ]
        : [{ action: logoutFunc, label: "Logout", isAction: true }]),
    ],
    [user, logoutFunc]
  );

  useEffect(() => {
    console.log(user);
  }, [user]);

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
