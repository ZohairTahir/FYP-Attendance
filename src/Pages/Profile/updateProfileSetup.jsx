import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/headerSup";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import HeaderStudent from "../components/headerStudent.jsx";
//import CompanyProfileData from "../../../models/CompanyProfile.js";

export default function UpdateProfileSetup() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const navigate = useNavigate();
  const [loadingProfileData, setLoadingProfileData] = useState(true);

  const [studentProfileData, setStudentProfileData] = useState({
    name: "",
    university: "",
    bio: "",
    projects: [],
    skills: [],
    experiences: [],
    education: [],
    profilePicture: "",
  });

  const [companyProfileData, setCompanyProfileData] = useState({
    companyName: "",
    description: "",
    products: [],
    services: [],
    profilePicture: "",
  });

  const [userType, setUserType] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userIdFromCookie = Cookies.get("userId");
    const userTypeFromCookie = Cookies.get("userType");
    const tokenFromCookie = Cookies.get("token");

    if (userIdFromCookie && userTypeFromCookie && tokenFromCookie) {
      setUserId(userIdFromCookie);
      setUserType(userTypeFromCookie);
      setToken(tokenFromCookie);

      console.log("User ID:", userIdFromCookie);
      console.log("User Type:", userTypeFromCookie);
      console.log("Token:", tokenFromCookie);

      // Fetch existing profile data
      axios
        .get(
          `http://localhost:5001/profile/profile?userId=${userId}&userType=${userType}`,
          {
            //   headers: { Authorization: `Bearer ${tokenFromCookie}` },
          }
        )
        .then((response) => {
          const data = response.data;
          if (userTypeFromCookie === "student") {
            setStudentProfileData(data);
          } else if (userTypeFromCookie === "company") {
            setCompanyProfileData(data);
            console.log("company profile", companyProfileData);
          }
          setLoadingProfileData(false);
        })
        .catch((error) => {
          console.error("Error fetching profile data", error);
          setLoadingProfileData(false);
        });
    } else {
      console.log("ID, type, and token not available in cookies");
    }
  }, []);

  useEffect(() => {
    if (redirectToProfile) {
      navigate("/profile");
    }
  }, [redirectToProfile]);

  const handleProfileSetup = async () => {
    try {
      if (userType === "student") {
        const requiredFields = [
          "name",
          "university",
          "bio",
          "projects",
          "skills",
          "experiences",
          "education",
        ];
        const missingFields = requiredFields.filter(
          (field) => !studentProfileData[field]
        );

        if (missingFields.length > 0) {
          const missingFieldsMessage = `Missing required fields: ${missingFields.join(
            ", "
          )}`;
          console.error(missingFieldsMessage);
          setErrorMessage(missingFieldsMessage);
          setSuccessMessage("");
          return;
        }
      } else if (userType === "company") {
        const requiredFields = [
          "companyName",
          "description",
          "products",
          "services",
        ];
        const missingFields = requiredFields.filter(
          (field) => !companyProfileData[field]
        );

        if (missingFields.length > 0) {
          const missingFieldsMessage = `Missing required fields: ${missingFields.join(
            ", "
          )}`;
          console.error(missingFieldsMessage);
          setErrorMessage(missingFieldsMessage);
          setSuccessMessage("");
          return;
        }
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("userType", userType);

      if (userType === "student") {
        formData.append("profileData", JSON.stringify(studentProfileData));
        formData.append("profilePicture", studentProfileData.profilePicture);
      } else if (userType === "company") {
        formData.append("profileData", JSON.stringify(companyProfileData));
        formData.append("profilePicture", companyProfileData.profilePicture);
      }

      await axios.put(
        `http://localhost:5001/profile/update-profile/?userId=${userId}&userType=${userType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("Profile successfully updated!");
      setErrorMessage("");
      setRedirectToProfile(true);
    } catch (error) {
      console.error(error);
      setSuccessMessage("");
      setErrorMessage("Error updating the profile. Please try again.");
    }
  };

  if (loadingProfileData) {
    return <div>Loading profile data...</div>;
  }

  return (
    <>
      {userType === "student" ? <HeaderStudent /> : <Header />}
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="w-100 mt-1 p-6 bg-white rounded-md shadow-md">
          <h1 className="text-3xl mb-4">Update Profile</h1>
          <div>
            {userType === "student" && (
              <div>
                <label className="block mb-2">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={studentProfileData.name || ""}
                    onChange={(e) =>
                      setStudentProfileData({
                        ...studentProfileData,
                        name: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  University:
                  <input
                    type="text"
                    name="university"
                    value={studentProfileData.university || ""}
                    onChange={(e) =>
                      setStudentProfileData({
                        ...studentProfileData,
                        university: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  Bio:
                  <input
                    value={studentProfileData.bio || ""}
                    name="bio"
                    onChange={(e) =>
                      setStudentProfileData({
                        ...studentProfileData,
                        bio: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  Projects (one per line):
                  <textarea
                    type="text"
                    name="projects"
                    value={studentProfileData.projects.join("\n") || ""}
                    onChange={(e) =>
                      setStudentProfileData({
                        ...studentProfileData,
                        projects: e.target.value.split("\n"),
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  Skills (one per line):
                  <textarea
                    type="text"
                    name="skills"
                    value={studentProfileData.skills.join("\n") || ""}
                    onChange={(e) =>
                      setStudentProfileData({
                        ...studentProfileData,
                        skills: e.target.value.split("\n"),
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  Experiences (one per line):
                  <textarea
                    type="text"
                    name="experiences"
                    value={studentProfileData.experiences.join("\n") || ""}
                    onChange={(e) =>
                      setStudentProfileData({
                        ...studentProfileData,
                        experiences: e.target.value.split("\n"),
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  Education (one per line):
                  <textarea
                    type="text"
                    name="education"
                    value={studentProfileData.education.join("\n") || ""}
                    onChange={(e) =>
                      setStudentProfileData({
                        ...studentProfileData,
                        education: e.target.value.split("\n"),
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  Profile Picture:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setStudentProfileData({
                        ...studentProfileData,
                        profilePicture: e.target.files[0],
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
              </div>
            )}
            {userType === "company" && (
              <div>
                <label className="block mb-2">
                  Company Name:
                  <input
                    type="text"
                    value={companyProfileData.companyName}
                    onChange={(e) =>
                      setCompanyProfileData({
                        ...companyProfileData,
                        companyName: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  Description:
                  <textarea
                    value={companyProfileData.description || ""}
                    onChange={(e) =>
                      setCompanyProfileData({
                        ...companyProfileData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  Products (one per line):
                  <textarea
                    type="text"
                    value={companyProfileData.products.join("\n") || ""}
                    onChange={(e) =>
                      setCompanyProfileData({
                        ...companyProfileData,
                        products: e.target.value.split("\n"),
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  Services (one per line):
                  <textarea
                    type="text"
                    value={companyProfileData.services.join("\n") || ""}
                    onChange={(e) =>
                      setCompanyProfileData({
                        ...companyProfileData,
                        services: e.target.value.split("\n"),
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
                <label className="block mb-2">
                  Profile Picture:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setCompanyProfileData({
                        ...companyProfileData,
                        profilePicture: e.target.files[0],
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                  />
                </label>
              </div>
            )}
          </div>
          <button
            onClick={handleProfileSetup}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Update Profile
          </button>
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </div>
    </>
  );
}
