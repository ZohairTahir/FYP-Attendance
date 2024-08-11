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
import { useParams } from "react-router-dom"; // Import useParams hook
import Cookies from "js-cookie";

export default function UpdatePost() {
  const [projectHeading, setProjectHeading] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [userIdFromCookie, setUserIdFromCookie] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  
  const { postId } = useParams();

  useEffect(() => {
    const userId = Cookies.get("userId");
    setUserIdFromCookie(userId);

    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/posts/${postId}`
        );
        const postData = response.data.post;

        setProjectHeading(postData.projectHeading);
        setProjectDescription(postData.projectDescription);
        setSkills(postData.skills.join("\n"));
      } catch (error) {
        console.error("Error fetching post data:", error);
        setErrorMessage("Error fetching post data");
      }
    };

    fetchPostData(); // Fetch post data when component mounts
  }, [postId]); // Fetch post data whenever postId changes

  const handleSubmit = async () => {
    if (
      !projectHeading ||
      !projectDescription ||
      !skills ||
      !userIdFromCookie
    ) {
      setErrorMessage("Please fill in all fields.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5001/posts/${postId}`,
        {
          projectHeading,
          projectDescription,
          skills: skills.split("\n").map((skill) => skill.trim()),
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Post updated successfully");
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to update the post: " + response.data.error);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Error updating post: " + error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="bg-[#DEE4EA] ">
      <Header />
      <div className=" p-12">
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
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2  focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <label className="block text-sm  font-bold leading-6 text-gray-900">
              PROJECT DESCRIPTION
            </label>

            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2  focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <label className="block text-sm  font-bold leading-6 text-gray-900">
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
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2  focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              Update
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
