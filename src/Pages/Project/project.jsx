import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Header from "../components/headerSup.jsx";
import { Card, Button } from "@material-tailwind/react";
import { Copy } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Project() {
  const [applicantsData, setApplicantsData] = useState([]);
  const [activeTab, setActiveTab] = useState("Applicants");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplicantsIds, setSelectedApplicantsIds] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [projectStarted, setProjectStarted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // Correctly initialize selectedDate
  const [attendanceData, setAttendanceData] = useState({});

  const { id: postId } = useParams();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/posts/${postId}/applicants`
        );
        const applicantsWithoutNull = response.data.applicants.filter(
          (applicant) => applicant !== null
        );

        const applicantsWithUserData = await Promise.all(
          applicantsWithoutNull.map(async (applicant) => {
            const userDataResponse = await axios.get(
              `http://localhost:5001/profile/profile?userId=${applicant}&userType=student`
            );

            const { userProfile, email } = userDataResponse.data;

            return {
              id: applicant,
              userData: userProfile,
              email: email,
            };
          })
        );

        setApplicantsData(applicantsWithUserData);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    const fetchMilestones = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/milestone/${postId}`
        );
        setMilestones(response.data);
        setProjectStarted(response.data.length > 0);
      } catch (error) {
        console.error("Error fetching milestones:", error);
      }
    };

    fetchApplicants();
    fetchMilestones();
  }, [postId]);

  const openSelectionDialog = () => {
    setIsDialogOpen(true);
  };

  const closeSelectionDialog = () => {
    setIsDialogOpen(false);
  };

  const handleApplicantSelection = (applicantId) => {
    const selectedIndex = selectedApplicantsIds.indexOf(applicantId);

    if (selectedIndex === -1 && selectedApplicantsIds.length < 2) {
      setSelectedApplicantsIds([...selectedApplicantsIds, applicantId]);
    } else if (selectedIndex !== -1) {
      setSelectedApplicantsIds(
        selectedApplicantsIds.filter((id) => id !== applicantId)
      );
    }
  };

  const submitSelectedApplicants = async () => {
    try {
      await axios.post("http://localhost:5001/posts/select-applicants", {
        postId,
        applicantIds: selectedApplicantsIds,
      });

      if (selectedApplicantsIds.length === 2)
        toast.success("Applicants selected successfully!");
      else toast.error("Minimum 2 applicants");

      closeSelectionDialog();
    } catch (error) {
      console.error("Error submitting selected applicants:", error);
      toast.error("Failed to select applicants.");
    }
  };

  const openDialog = (applicant) => {
    console.log("Selected Applicant:", applicant);
    setSelectedApplicant(applicant);
  };

  const closeDialog = () => {
    setSelectedApplicant(null);
  };

  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email);
    toast.info("Email copied to clipboard!");
  };

  const handleAttendanceChange = (applicantId, status) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [selectedDate]: {
        ...(prevData[selectedDate] || {}),
        [applicantId]: status,
      },
    }));
  };

  return (
    <div className="bg-[#DEE4EA]">
      <Header />
      <ToastContainer />
      <div className="p-10">
        <Card className="">
          <Tabs value={activeTab} className="m-5">
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
              indicatorProps={{
                className:
                  "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
              }}
            >
              <Tab
                value="dashboard"
                onClick={() => setActiveTab("dashboard")}
                className={activeTab === "dashboard" ? "text-gray-900" : ""}
              >
                Dashboard
              </Tab>
              <Tab
                value="Applicants"
                onClick={() => setActiveTab("Applicants")}
                className={activeTab === "Applicants" ? "text-gray-900" : ""}
              >
                Applicants
              </Tab>
              <Tab
                value="attendance"
                onClick={() => setActiveTab("attendance")}
                className={activeTab === "attendance" ? "text-gray-900" : ""}
              >
                Attendance
              </Tab>
            </TabsHeader>

            <TabsBody>
              <TabPanel value="Applicants">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Applicants</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {applicantsData.map((applicant) => (
                      <Card key={applicant.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-lg">
                              {applicant.userData.name}
                            </h3>
                            <div className="flex items-center">
                              <span className="mr-2">{applicant.email}</span>
                              <button
                                onClick={() => copyToClipboard(applicant.email)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="text-black hover:text-gray-500" />
                              </button>
                            </div>
                          </div>
                          <Button
                            onClick={() => openDialog(applicant)}
                            className="flex  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            View Profile
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabPanel>

              <TabPanel value="dashboard">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
                  {!projectStarted ? (
                    <Button
                      className="flex ml-[25%] w-[50%] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={openSelectionDialog}
                    >
                      Start Project
                    </Button>
                  ) : (
                    <div>
                      <Link to={`/milestone/${postId}`}>
                        <Button className="w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50 mb-4">
                          Go to Milestones
                        </Button>
                      </Link>
                      <h2 className="text-lg font-semibold mb-4">Milestones</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {milestones.map((milestone, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-center mb-1">
                              <p className="font-bold text-lg">
                                {milestone.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Status: {milestone.status}
                              </p>
                            </div>
                            <p>{milestone.description}</p>
                            <p>
                              Start Date:{" "}
                              {new Date(
                                milestone.start_date
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              End Date:{" "}
                              {new Date(milestone.end_date).toLocaleDateString()}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel value="attendance">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Attendance</h2>
                  <div className="mb-4">
                    <label
                      htmlFor="attendance-date"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Select Date
                    </label>
                    <input
                      type="date"
                      id="attendance-date"
                      className="border rounded p-2"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {applicantsData.map((applicant) => (
                      <Card key={applicant.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg">
                            {applicant.userData.name}
                          </h3>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name={`attendance-${applicant.id}`}
                              value="Present"
                              checked={
                                attendanceData[selectedDate] &&
                                attendanceData[selectedDate][applicant.id] ===
                                  "Present"
                              }
                              onChange={() =>
                                handleAttendanceChange(
                                  applicant.id,
                                  "Present"
                                )
                              }
                            />
                            <label
                              htmlFor={`present-${applicant.id}`}
                              className="ml-2"
                            >
                              Present
                            </label>
                            <input
                              type="radio"
                              name={`attendance-${applicant.id}`}
                              value="Absent"
                              checked={
                                attendanceData[selectedDate] &&
                                attendanceData[selectedDate][applicant.id] ===
                                  "Absent"
                              }
                              onChange={() =>
                                handleAttendanceChange(applicant.id, "Absent")
                              }
                            />
                            <label
                              htmlFor={`absent-${applicant.id}`}
                              className="ml-2"
                            >
                              Absent
                            </label>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>

          <Dialog open={isDialogOpen} onClose={closeSelectionDialog}>
            <DialogBody>
              <h2 className="text-xl font-semibold mb-4">Select Applicants</h2>
              <div className="grid grid-cols-1 gap-4">
                {applicantsData.map((applicant) => (
                  <Card key={applicant.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">
                        {applicant.userData.name}
                      </h3>
                      <div>
                        <input
                          type="checkbox"
                          id={`applicant-${applicant.id}`}
                          checked={selectedApplicantsIds.includes(
                            applicant.id
                          )}
                          onChange={() =>
                            handleApplicantSelection(applicant.id)
                          }
                        />
                        <label
                          htmlFor={`applicant-${applicant.id}`}
                          className="ml-2"
                        >
                          Select
                        </label>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                onClick={submitSelectedApplicants}
                className="mr-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </Button>
              <Button
                onClick={closeSelectionDialog}
                className="rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Cancel
              </Button>
            </DialogFooter>
          </Dialog>
        </Card>
      </div>

      <Dialog open={!!selectedApplicant} onClose={closeDialog}>
        <DialogBody>
          {selectedApplicant && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {selectedApplicant.userData.name}
              </h2>
              <p className="mb-2">
                <strong>Email:</strong> {selectedApplicant.email}
              </p>
              <p className="mb-2">
                <strong>Bio:</strong> {selectedApplicant.userData.bio}
              </p>
              <p className="mb-2">
                <strong>Skills:</strong> {selectedApplicant.userData.skills}
              </p>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={closeDialog}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
