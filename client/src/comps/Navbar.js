import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../App";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import apiUrl from "../api-config";
const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          FrenzyQuiz
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {user && (
              <li className="nav-item">
                <NavLink activeclassname="active" className="nav-link">
                  Welcome, {user?.email}
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink activeclassname="active" className="nav-link" to="/Join">
                Join
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                activeclassname="active"
                className="nav-link"
                to="/Quizzes"
              >
                Create Quiz
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                activeclassname="active"
                className="nav-link"
                to="/QuizList"
              >
                QuizList
              </NavLink>
            </li>
            {!user && (
              <li className="nav-item">
                <NavLink
                  activeclassname="active"
                  className="nav-link"
                  to="/Login"
                >
                  Login
                </NavLink>
              </li>
            )}

            {!user && (
              <li className="nav-item">
                <NavLink
                  activeclassname="active"
                  className="nav-link"
                  to="/Register"
                >
                  Register
                </NavLink>
              </li>
            )}

            {user && (
              <li className="nav-item">
                <NavLink
                  activeclassname="active"
                  className="nav-link"
                  to="/Register"
                  onClick={handleLogout}
                >
                  LogOut
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
