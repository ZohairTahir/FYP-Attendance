import React, { useState, useEffect } from "react";
import Header from "../components/headerSup.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Input,
    Option,
    Select,
    Dialog,
    Textarea,
    IconButton,
    Typography,
    DialogBody,
    DialogHeader,
    DialogFooter,
    cardBody,
    Button,
  } from "@material-tailwind/react";
  import { XMarkIcon } from "@heroicons/react/24/outline";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";


export default function Project() {
  const [groupCard, setGroupCard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);

  
  const handleOpen = () => setOpen(!open);
  const { id: cardId } = useParams();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/grpcrd/group/${cardId}`
        );
        setGroupCard(response.data.cards);

        const tasksResponse = await axios.get(
          `http://localhost:5001/tasks/${cardId}`
        );
        setTasks(tasksResponse.data.tasks);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchProjectData();
  }, [cardId]);

  const handleCreateTask = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#DEE4EA]">
      <Header />
      <ToastContainer />
      <div className="p-15 bg-white">
        <cardBody className="p-9">
          <Tabs value={activeTab} className="m-5">
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
              indicatorProps={{
                className:
                  "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
              }}
            >
              <Tab
                value="Overview"
                onClick={() => setActiveTab("Overview")}
                className={activeTab === "Overview" ? "text-gray-900" : ""}
              >
                Overview
              </Tab>
              <Tab
                value="dashboard"
                onClick={() => setActiveTab("dashboard")}
                className={activeTab === "dashboard" ? "text-gray-900" : ""}
              >
                Dashboard
              </Tab>
            </TabsHeader>

            <TabsBody>
              <TabPanel value="Overview">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Overview</h2>
                  {groupCard && (
                    <cardBody key={groupCard._id} className="p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg">
                            {groupCard.projectTitle}
                          </h3>
                          <p className="mt-2">{groupCard.description}</p>
                          <div className="mt-4">
                            <p><strong>Supervisor:</strong> {groupCard.supervisor}</p>
                            <p><strong>Email:</strong> {groupCard.email}</p>
                            <p><strong>Group Members:</strong> {groupCard.groupMembers.join(", ")}</p>
                          </div>
                        </div>
                      </div>
                    </cardBody>
                  )}

                  {/* Task Card */}
                  { (
                    <cardBody className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Tasks</h3>
                        <Button
                          className="flex ml-[25%] w-[15%] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          color="blue"
                          onClick={handleOpen}
                          style={{ padding: '8px 8px', fontSize: '14px' }}
                        >
                          Create Task
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {tasks.map((task) => (
                          <Card key={task._id} className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold">{task.title}</h4>
                                <p>{task.description}</p>
                                <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </cardBody>
                  )}
                </div>
              </TabPanel>

              <TabPanel value="dashboard">
                {/* Dashboard content goes here */}
              </TabPanel>
            </TabsBody>
          </Tabs>
        </cardBody>
      </div>

      {/* Modal for Creating a Task */}
      <>
      
      <Dialog
  size="lg"
  open={open}
  handler={handleOpen}
  className="p-4 relative justify-center backdrop-blur-sm overflow-y-auto h-full"
>
  <DialogHeader className="mt-1 block ">
    <Typography variant="h4" color="blue-gray">
      Task
    </Typography>
    <Typography className="mt-1 font-normal text-gray-600">
      Add your weekly tasks
    </Typography>
    <IconButton
      size="sm"
      variant="text"
      className="!absolute right-3.5 top-3.5"
      onClick={handleOpen}
    >
      <XMarkIcon className="h-4 w-4 stroke-2" />
    </IconButton>
  </DialogHeader>
  <DialogBody className="space-y-4 pb-6 max-h-[calc(100vh-13rem)] overflow-y-auto">
    <div>
      <Typography
        variant="small"
        color="blue-gray"
        className="mb-2 text-left font-medium"
      >
        Task Title
      </Typography>
      <Input
        color="gray"
        size="lg"
        placeholder="eg. Marketplace App"
        name="name"
        className="placeholder:opacity-100 focus:!border-t-gray-900"
        containerProps={{
          className: "!min-w-full",
        }}
        labelProps={{
          className: "hidden",
        }}
      />
    </div>
    <div>
      <Typography
        variant="small"
        color="blue-gray"
        className="mb-2 text-left font-medium"
      >
        Project Status
      </Typography>
      <Select
        className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
        placeholder="1"
        labelProps={{
          className: "hidden",
        }}
      >
        <Option>In-Progress</Option>
        <Option>Revision</Option>
        <Option>Completed</Option>
      </Select>
    </div>
    <div className="flex gap-4">
      <div className="w-full">
        <label
          htmlFor="startDate"
          className="block mb-1 font-semibold text-gray-800"
        >
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          placeholder="Start Date"
          className="mb-2"
        />
      </div>
      <div className="w-full">
        <label
          htmlFor="endDate"
          className="block mb-1 font-semibold text-gray-800"
        >
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          placeholder="End Date"
          className="mb-2"
        />
      </div>
    </div>
    <div>
      <Typography
        variant="small"
        color="blue-gray"
        className="mb-2 text-left font-medium"
      >
        Description
      </Typography>
      <Textarea
        rows={7}
        placeholder="eg. Project's Description"
        className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-600 ring-4 ring-transparent focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
        labelProps={{
          className: "hidden",
        }}
      />
    </div>
  </DialogBody>
  <DialogFooter>
    <Button className="flex ml-[65%] w-[30%] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    onClick={handleOpen}>
      Add Task
    </Button>
  </DialogFooter>
</Dialog>

    </>

    </div>
  );
}
