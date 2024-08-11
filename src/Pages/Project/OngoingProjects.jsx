import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import HeaderStudent from "../components/headerStudent";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function OngoingProjects() {
  const [projects, setProjects] = useState([]);
  const userId = Cookies.get("userId");
  const [userIdFromCookie, setUserIdFromCookie] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userIdFromCookie = Cookies.get("userId");
        setUserIdFromCookie(userIdFromCookie);
        console.log(userIdFromCookie);

        const response = await axios.get(
          `http://localhost:5001/posts/projects-for-student/${userIdFromCookie}`
        );
        console.log("Response from server:", response.data);
        const reversedPosts = response.data.posts.reverse();
        setProjects(reversedPosts);
      } catch (error) {
        console.error("Error fetching project posts:", error);
      }
    };
    fetchProjects();
  }, [userId]);

  return (
    <div className="bg-[#DEE4EA] min-h-screen">
      <HeaderStudent />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Ongoing Projects</h1>
        {projects.length === 0 ? (
          <p>No ongoing projects found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <Card key={project._id} className="p-4">
                <CardBody>
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    {project.projectHeading}
                  </Typography>
                  <Typography>{project.projectDescription}</Typography>
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    Skills
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-200 px-2 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardBody>
                <CardFooter className="pt-0">
                  <Link to={`/student-milestones/${project._id}`}>
                    <Button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Go to Milestones
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
