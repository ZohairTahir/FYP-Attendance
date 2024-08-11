import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/headerStudent.jsx";
import { Card, Button, Input } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

export default function StudentMilestones() {
  const { postId } = useParams();

  const [milestones, setMilestones] = useState([]);
  const [submissionLinks, setSubmissionLinks] = useState({});

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/milestone/${postId}`
        );
        console.log(response.data);
        setMilestones(response.data);
      } catch (error) {
        console.error("Error fetching milestones:", error);
      }
    };

    fetchMilestones();
  }, [postId]);

  const submitLink = async (milestoneId) => {
    if (!submissionLinks[milestoneId]) {
      toast.error("Please provide a submission link.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5001/milestone/${milestoneId}/link`,
        { submissionLink: submissionLinks[milestoneId] }
      );
      const updatedMilestone = response.data;

      setMilestones(
        milestones.map((m) => (m._id === milestoneId ? updatedMilestone : m))
      );
      setSubmissionLinks({ ...submissionLinks, [milestoneId]: "" });
      toast.success("Submission link added successfully!");
    } catch (error) {
      console.error("Error adding submission link:", error);
      toast.error("Failed to add submission link.");
    }
  };

  const handleLinkChange = (milestoneId, link) => {
    setSubmissionLinks({ ...submissionLinks, [milestoneId]: link });
  };

  return (
    <div className="bg-[#DEE4EA] min-h-screen">
      <Header />
      <ToastContainer />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">My Milestones</h1>
        <div className="grid grid-cols-1 gap-6">
          {milestones.map((milestone, index) => (
            <Card key={index} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-lg">{milestone.name}</p>
                <p className="text-sm text-gray-500">
                  Status: {milestone.status}
                </p>
              </div>
              <p>{milestone.description}</p>
              <p>
                Start Date: {new Date(milestone.startDate).toLocaleDateString()}
              </p>
              <p>
                End Date: {new Date(milestone.endDate).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <label className="block mb-1 font-semibold text-gray-800">
                  Submission Links
                </label>
                {milestone.submissionLinks?.map((link, i) => (
                  <p key={i} className="text-gray-600 mb-2">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {link}
                    </a>
                  </p>
                ))}
                <Input
                  type="text"
                  value={submissionLinks[milestone._id] || ""}
                  onChange={(e) =>
                    handleLinkChange(milestone._id, e.target.value)
                  }
                  className="mb-2"
                />
                <Button
                  onClick={() => submitLink(milestone._id)}
                  className="mb-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Submit Link
                </Button>
                <div>
                  <label className="block mb-1 font-semibold text-gray-800">
                    Comments
                  </label>
                  {milestone.comments?.map((c, i) => (
                    <p key={i} className="text-gray-600">
                      {c.comment} -{" "}
                      <span className="text-gray-400 text-sm">
                        {new Date(c.date).toLocaleDateString()}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
