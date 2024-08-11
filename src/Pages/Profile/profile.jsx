import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LOGO from "../Assets/logo.png";
import HeaderStudent from "../components/headerStudent.jsx";


import Header from "../components/headerSup";

// ... (imports)

export default function Profile() {
  const [userData, setUserData] = useState({});
  const [userProfile, setUserProfile] = useState({});

  const [userType, setUserType] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    const userType = Cookies.get("userType");

    axios
      .get(
        `http://localhost:5001/profile/profile?userId=${userId}&userType=${userType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setUserProfile(response.data.userProfile);
        console.log("User Profile Data:", response.data.userProfile);
      })
      .catch((error) => {
        console.error("Error fetching user profile data:", error);
      });
  }, []);

  useEffect(() => {
    console.log("Updated User Profile Data:", userProfile);
    const userTypeFromCookie = Cookies.get("userType");
    if (userTypeFromCookie) {
      setUserType(userTypeFromCookie);

      console.log("User Type:", userTypeFromCookie);
    }
  }, [userProfile]);

  return (
    <>
      {userType === "student" ? <HeaderStudent /> : <Header />}

      <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="rounded-full overflow-hidden">
                <img
                  className="h-40 w-40 "
                 src={userProfile.profilePicture}
                  alt="Profile Picture"
                />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-800">
                  {userProfile.name || userProfile.companyName}
                </h1>
                <p className="text-gray-500">{userProfile.university}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                About Me
              </h2>
              <p className="text-gray-600">
                {userProfile.bio || userProfile.description}
              </p>
            </div>

            {(userProfile.projects || userProfile.products) && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {userProfile.projects ? "Projects" : "Products"}
                </h2>
                <ul>
                  {Array.isArray(
                    userProfile.projects || userProfile.products
                  ) ? (
                    (userProfile.projects || userProfile.products).map(
                      (detail, index) => <li key={index}>{detail}</li>
                    )
                  ) : (
                    <li>No data available</li>
                  )}
                </ul>
              </div>
            )}

            {userProfile.skills && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-200 px-2 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(userProfile.experiences || userProfile.services) && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {userProfile.experiences ? "Experiences" : "Services"}
                </h2>
                <ul>
                  {Array.isArray(
                    userProfile.experiences || userProfile.services
                  ) ? (
                    (userProfile.experiences || userProfile.services).map(
                      (detail, index) => <li key={index}>{detail}</li>
                    )
                  ) : (
                    <li>No data available</li>
                  )}
                </ul>
              </div>
            )}

            {userProfile.education && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Education
                </h2>
                <ul>
                  {Array.isArray(userProfile.education) ? (
                    userProfile.education.map((educationDetail, index) => (
                      <li key={index}>{educationDetail}</li>
                    ))
                  ) : (
                    <li>No education data available</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
