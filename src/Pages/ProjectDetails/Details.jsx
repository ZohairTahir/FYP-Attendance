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
    Card,
  } from "@material-tailwind/react";
  import { XMarkIcon } from "@heroicons/react/24/outline";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";


export default function Project() {
  const [groupCard, setGroupCard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = useState(false);
const [editTaskId, setEditTaskId] = useState(null);

  const [newTask, setNewTask] = useState({

    title: "",

    status: "",

    startDate: "",

    endDate: "",

    description: "",

    groupCardId: "",

  });

  
  const handleOpen = () => {if (open) {
    // When closing the modal, reset the form
    resetForm();
  }
  setOpen(!open);};
  const { id: cardId } = useParams();
 

  const handleInputChange = (e) => {
  
    const { name, value } = e.target;

    setNewTask({ ...newTask, [name]: value })

};

const resetForm = () => {
    setNewTask({
      title: "",
      status: "",
      startDate: "",
      endDate: "",
      description: "",
      groupCardId: "",
    });
    setIsEditing(false);
    setEditTaskId(null);
  };

useEffect(() => {
    setNewTask((prevTask) => ({
      ...prevTask,
      groupCardId: cardId,
    }));
  }, [cardId]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/grpcrd/group/${cardId}`
        );
        setGroupCard(response.data.cards);

        const tasksResponse = await axios.get(
          `http://localhost:5001/task/${cardId}`
        );
        setTasks(tasksResponse.data.tasks);
        console.log("card is this: ",tasksResponse.data.tasks);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchProjectData();
  }, [cardId]);

  const handleCreateTask = async () => {
    try {
        
        const today = new Date();
        const startDate = new Date(newTask.startDate);
        const endDate = new Date(newTask.endDate);
        
        // Condition 1: Check if the start date or end date is in the future
        if (startDate > today || endDate > today) {
          toast.error("Start date and end date should not be in the future.");
          return;
        }
  
        // Condition 2: Check if the difference between start and end date is at least 7 days
        const dateDifference = (endDate - startDate) / (1000 * 60 * 60 * 24); // Difference in days
        if (dateDifference < 7) {
          toast.error("The difference between the start date and end date should be at least 7 days.");
          return;
        }
      if (isEditing) {
        // Validate the editTaskId
        
        const response = await axios.put(
          `http://localhost:5001/task/update/${editTaskId}`,
          {
            title: newTask.title,
            status: newTask.status,
            startDate: newTask.startDate,
            endDate: newTask.endDate,
            description: newTask.description,
          }
        );

        const updatedTask = response.data.task;
        setTasks(tasks.map(task => task._id === editTaskId ? updatedTask : task));
        toast.success("Task updated successfully!");
      } else {
        // Task creation logic (no validation needed here for ID)
        
        const response = await axios.post(
          `http://localhost:5001/task/taskscreate`,
          {
            title: newTask.title,
            status: newTask.status,
            startDate: newTask.startDate,
            endDate: newTask.endDate,
            description: newTask.description,
            groupCardId: cardId,
          }
        );
        const createdTask = response.data.task;
        setTasks([...tasks, createdTask]);
        toast.success("Task created successfully!");
      }

      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating/updating task:", error.message);
      toast.error("Failed to create/update task.");
    }
  };



    const handleEditTask = (task) => {
        
        setNewTask({
            title: task.title,
            status: task.status,
            startDate: new Date(task.startDate).toISOString().split("T")[0],
            endDate: new Date(task.endDate).toISOString().split("T")[0],
            description: task.description,
            groupCardId: task.groupCardId,
            _id: task._id,  // Store the task ID for updating
        });
        console.log("The task id is: ",task._id)
        setEditTaskId(task._id);
        setIsEditing(true);
        setOpen(true); 
        
    };
    
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
          return; // Early return if the user cancels the confirmation
        }
    
        try {
          await axios.delete(`http://localhost:5001/task/delete/${taskId}`);
          setTasks(tasks.filter((task) => task._id !== taskId));
          toast.success("Task deleted successfully!");
        } catch (error) {
          console.error("Error deleting task:", error.message);
          toast.error("Failed to delete task.");
        }
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
                      <div className="grid grid-cols-1 gap-4 bg-gray-195">
                        {tasks.map((task) => (
                          <Card key={task._id} className="p-4 bg-gray-200 border border-solid border-gray-300">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold">{task.title}</h4>
                                <p>{task.description}</p>
                                <p><strong>Start Date:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
                                <p><strong>End Date:</strong> {new Date(task.endDate).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                              </div>
                              <div className="flex flex-col gap-3">
  <Button
    className="ml-4"
    color="white"
    style={{ height: '50px', width: '100px' }}
    onClick={() => handleEditTask(task)}
  >
    Edit
  </Button>
  <Button
    className="ml-4 text-black"
    style={{ backgroundColor: '#D00000', height: '50px', width: '100px' }}
    color="red"
    onClick={() => handleDeleteTask(task._id)}
  >
    Delete
  </Button>
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
      <>
        <Dialog
          size="lg"
          open={open}
          handler={handleOpen}
          className="p-4 relative justify-center backdrop-blur-sm overflow-y-auto h-full"
        >
          <DialogHeader className="mt-1 block">
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
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
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
                name="status"
                value={newTask.status}
                onChange={(e) =>
                  handleInputChange({ target: { name: "status", value: e } })
                }
                labelProps={{
                  className: "hidden",
                }}
              >
                <Option value="In-Progress">In-Progress</Option>
                <Option value="Revision">Revision</Option>
                <Option value="Completed">Completed</Option>
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
                  name="startDate"
                  value={newTask.startDate}
                  onChange={handleInputChange}
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
                  name="endDate"
                  value={newTask.endDate}
                  onChange={handleInputChange}
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
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="eg. Project's Description"
                className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-600 ring-4 ring-transparent focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              className="flex ml-[65%] w-[30%] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleCreateTask}
            >
              Add Task
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    </>

    </div>
  );
}
