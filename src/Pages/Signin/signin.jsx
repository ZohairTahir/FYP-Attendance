import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import LOGO from "../Assets/logo.png";

export default function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "",
    regno: "", // Add regno to formData
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (userType) => {
    setFormData({ ...formData, userType });
    setDropdownOpen(false);
    setErrorMessage(""); // Reset error message on user type change
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateRegno = (regno) => {
    return /^[0-9]+$/.test(regno); // Ensures regno contains only numbers
  };

  const validateRegnoNotEmpty = (regno) => {
    return regno.trim() !== "";
  };

  const handleRegnoChange = (e) => {
    const regno = e.target.value;
    setFormData({ ...formData, regno });

    if (!validateRegnoNotEmpty(regno)) {
      setErrorMessage("Registration Number cannot be empty.");
    } else if (!validateRegno(regno)) {
      setErrorMessage("Registration Number must be numeric.");
    } else {
      setErrorMessage(""); // Clear error if regno is valid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userType) {
      setErrorMessage("Please select a user type.");
      return;
    }

    if (formData.userType === "Student") {
      if (!validateRegnoNotEmpty(formData.regno)) {
        setErrorMessage("Registration Number cannot be empty.");
        return;
      } else if (!validateRegno(formData.regno)) {
        setErrorMessage("Registration Number must be numeric.");
        return;
      }
    }

    if (formData.userType === "Supervisor" && !validateEmail(formData.email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/user/login", formData);

      if (response.status === 200) {
        setMessage("User is signed in.");

        const { token, userId, userType, email } = response.data;
        Cookies.set("token", token);
        Cookies.set("userId", userId);
        Cookies.set("userType", userType);
        Cookies.set("email",email);

        if (userType === "Student") {
          navigate("/homepageStudent");
        } else if (userType === "Supervisor") {
          navigate("/homepage");
        }

        setErrorMessage("");
        return;
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setMessage("");

      if (error.response) {
        if (
          error.response.status === 401 &&
          error.response.data.error === "Invalid credentials."
        ) {
          setErrorMessage("Incorrect Email & Password");
        } else {
          setErrorMessage("Login failed: " + error.response.data.error);
        }
      } else {
        setErrorMessage("Error occurred during login");
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <header className="bg-blue-900">
          <div className="flex justify-center">
            <img className="h-12 w-auto mt-10" src={LOGO} alt="SZABIST" />
          </div>
        </header>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mt-2 relative">
          <label
            htmlFor="userType"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Select Type
          </label>
          <div
            className="w-full bg-white border border-gray-300 rounded-md shadow-sm relative"
            style={{ zIndex: 10, marginBottom: "10px" }}
            onClick={toggleDropdown}
          >
            <div className="p-2 cursor-pointer">
              {formData.userType ? formData.userType : "Select Type"}
            </div>
            {dropdownOpen && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <div
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect("Student")}
                >
                  Student
                </div>
                <div
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect("Supervisor")}
                >
                  Supervisor
                </div>
              </div>
            )}
          </div>
        </div>

        {formData.userType && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {formData.userType === "Student" && (
              <div>
                <label
                  htmlFor="regno"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Registration Number
                </label>
                <div className="mt-2">
                  <input
                    id="regno"
                    name="regno"
                    type="text"
                    autoComplete="regno"
                    required
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) =>
                      setFormData({ ...formData, regno: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {formData.userType === "Supervisor" && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex justify-center w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {message && (
          <div className="text-center text-l text-indigo-600">{message}</div>
        )}
        {errorMessage && (
          <div className="text-red-500 text-center">{errorMessage}</div>
        )}
        <p className="mt-10 text-center text-sm text-gray-500">
            Not Registered?{" "}
            <a
              href="/register"
              className="mr-4   justify-center rounded-md   text-sm font-semibold leading-6 text-indigo-500  hover:text-indigo-500 "
            >
              Register Your Self First
            </a>
          </p>
      </div>
    </div>
  );
}
