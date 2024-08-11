import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/headerSup";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Posting() {
  const [projectHeading, setProjectHeading] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [userIdFromCookie, setUserIdFromCookie] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Cookies.get("userId");
    setUserIdFromCookie(userId);
    console.log("User ID: in post making ", userIdFromCookie);
  }, []);

  const handleSubmit = async () => {
    if (!projectHeading || !projectDescription || !skills || !userIdFromCookie) {
      setErrorMessage("Please fill in all fields.");
      setSuccessMessage("");
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/posts", {
        projectHeading,
        projectDescription,
        skills: skills.split("\n").map((skill) => skill.trim()),
        author: userIdFromCookie,
      });

      if (response.status === 201) {
        toast.success("Post created successfully");
        setErrorMessage("");
        setProjectHeading("");
        setProjectDescription("");
        setSkills("");
        setTimeout(() => {
          navigate("/homepage"); 
        }, 2000);
      } else {
        setErrorMessage("Failed to save the post: " + response.data.error);
        toast.error("Failed to save the post: " + response.data.error);
      }
    } catch (error) {
      console.error("Error posting project:", error);
      toast.error("Error posting project: " + error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="bg-[#DEE4EA]">
      <Header />
      <div className="p-12">
        <Card className="w-[60%] ml-[20%]">
          <CardBody className="flex flex-col gap-4">
            <Typography
              variant="h3"
              className="mb-4 grid h-28 place-items-center"
            >
              Post Ideas
            </Typography>
            <label className="block text-sm font-bold leading-6 text-gray-900">
              PROJECT HEADING
            </label>
            <input
              value={projectHeading}
              onChange={(e) => setProjectHeading(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <label className="block text-sm font-bold leading-6 text-gray-900">
              PROJECT DESCRIPTION
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <label className="block text-sm font-bold leading-6 text-gray-900">
              SKILLS (one per line):
            </label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              onBlur={(e) => {
                const skillsArray = e.target.value
                  .split("\n")
                  .map((skill) => skill.trim());
                setSkills(skillsArray.join("\n"));
              }}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />

            {successMessage && (
              <div className="text-green-500 text-center">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="text-red-500 text-center">{errorMessage}</div>
            )}
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              fullWidth
              onClick={handleSubmit}
              className="bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              POST
            </Button>
          </CardFooter>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
}
