// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Header from "../components/header.jsx";
// import { Card, Button, Input, Textarea } from "@material-tailwind/react";
// import { Pencil } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Milestone() {
//   const { postId } = useParams();
//   const [milestone, setMilestone] = useState({
//     name: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//   });
//   const [savedMilestones, setSavedMilestones] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingMilestoneId, setEditingMilestoneId] = useState(null);
//   const [newComment, setNewComment] = useState({});
//   const [submissionLinks, setSubmissionLinks] = useState({});

//   const handleMilestoneChange = (field, value) => {
//     setMilestone({
//       ...milestone,
//       [field]: value,
//     });
//   };

//   const handleSaveMilestone = async () => {
//     if (isEditing) {
//       await handleUpdateMilestone();
//     } else {
//       try {
//         const response = await axios.post("http://localhost:5000/milestone", {
//           postId,
//           ...milestone,
//         });
//         setSavedMilestones((prevMilestones) => [
//           ...prevMilestones,
//           response.data.milestone,
//         ]);
//         setMilestone({
//           name: "",
//           description: "",
//           startDate: "",
//           endDate: "",
//         });
//         toast.success("Milestone added successfully!");
//       } catch (error) {
//         console.error("Error saving milestone:", error);
//         toast.error("Failed to add milestone.");
//       }
//     }
//   };

//   const handleEditMilestone = (milestone) => {
//     setIsEditing(true);
//     setEditingMilestoneId(milestone._id);
//     setMilestone({
//       name: milestone.name,
//       description: milestone.description,
//       startDate: milestone.startDate.split("T")[0], // Format date correctly
//       endDate: milestone.endDate.split("T")[0], // Format date correctly
//     });
//     toast.info("Editing milestone.");
//   };

//   const handleUpdateMilestone = async () => {
//     try {
//       await axios.put(`http://localhost:5000/milestone/${editingMilestoneId}`, {
//         postId,
//         ...milestone,
//       });
//       setSavedMilestones((prevMilestones) =>
//         prevMilestones.map((m) =>
//           m._id === editingMilestoneId ? { ...m, ...milestone } : m
//         )
//       );
//       setMilestone({
//         name: "",
//         description: "",
//         startDate: "",
//         endDate: "",
//       });
//       setIsEditing(false);
//       setEditingMilestoneId(null);
//       toast.success("Milestone updated successfully!");
//     } catch (error) {
//       console.error("Error updating milestone:", error);
//       toast.error("Failed to update milestone.");
//     }
//   };

//   const handleLinkChange = (milestoneId, link) => {
//     setSubmissionLinks({ ...submissionLinks, [milestoneId]: link });
//   };

//   const submitLink = async (milestoneId) => {
//     if (!submissionLinks[milestoneId]) {
//       toast.error("Please provide a submission link.");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `http://localhost:5000/milestone/${milestoneId}/link`,
//         { submissionLink: submissionLinks[milestoneId] }
//       );
//       const updatedMilestone = response.data;

//       setSavedMilestones(
//         savedMilestones.map((m) =>
//           m._id === milestoneId ? updatedMilestone : m
//         )
//       );
//       setSubmissionLinks({ ...submissionLinks, [milestoneId]: "" });
//       toast.success("Submission link added successfully!");
//     } catch (error) {
//       console.error("Error adding submission link:", error);
//       toast.error("Failed to add submission link.");
//     }
//   };

//   const handleCommentChange = (milestoneId, comment) => {
//     setNewComment({ ...newComment, [milestoneId]: comment });
//   };

//   const addComment = async (milestoneId) => {
//     if (!newComment[milestoneId]) {
//       toast.error("Please provide a comment.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:5000/milestone/${milestoneId}/comment`,
//         { comment: newComment[milestoneId] }
//       );
//       const updatedMilestone = response.data;

//       setSavedMilestones(
//         savedMilestones.map((m) =>
//           m._id === milestoneId ? updatedMilestone : m
//         )
//       );
//       setNewComment({ ...newComment, [milestoneId]: "" });
//       toast.success("Comment added successfully!");
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       toast.error("Failed to add comment.");
//     }
//   };

//   // const updateMilestoneStatus = async (milestoneId, status) => {
//   //   try {
//   //     const response = await axios.put(
//   //       `http://localhost:5000/milestone/${milestoneId}/status`,
//   //       { status }
//   //     );
//   //     const updatedMilestone = response.data;

//   //     setSavedMilestones(
//   //       savedMilestones.map((m) =>
//   //         m._id === milestoneId ? updatedMilestone : m
//   //       )
//   //     );
//   //     toast.success("Milestone status updated successfully!");
//   //   } catch (error) {
//   //     console.error("Error updating milestone status:", error);
//   //     toast.error("Failed to update milestone status.");
//   //   }
//   // };
//   const updateMilestoneStatus = async (milestoneId, status) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/milestone/${milestoneId}/status`,
//         { status }
//       );
//       const updatedMilestone = response.data;

//       setSavedMilestones(
//         savedMilestones.map((m) =>
//           m._id === milestoneId ? updatedMilestone : m
//         )
//       );
//       toast.success("Milestone status updated successfully!");
//     } catch (error) {
//       console.error("Error updating milestone status:", error);
//       toast.error("Failed to update milestone status.");
//     }
//   };

//   useEffect(() => {
//     const fetchMilestones = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/milestone/${postId}`
//         );
//         setSavedMilestones(response.data);
//       } catch (error) {
//         console.error("Error fetching milestones:", error);
//       }
//     };

//     fetchMilestones();
//   }, [postId]);

//   return (
//     <div className="bg-[#DEE4EA] min-h-screen">
//       <Header />
//       <ToastContainer />
//       <div className="p-10">
//         <Card className="mb-8">
//           <div className="p-6">
//             <h1 className="text-xl font-bold mb-4">
//               {isEditing ? "Edit Milestone" : "Milestone Details"}
//             </h1>
//             <div className="mb-4">
//               <label
//                 htmlFor="name"
//                 className="block mb-1 font-semibold text-gray-800"
//               >
//                 Milestone Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 placeholder="Milestone Name"
//                 value={milestone.name}
//                 onChange={(e) => handleMilestoneChange("name", e.target.value)}
//                 className="mb-2"
//               />
//               <label
//                 htmlFor="description"
//                 className="block mb-1 font-semibold text-gray-800"
//               >
//                 Description
//               </label>
//               <input
//                 type="text"
//                 id="description"
//                 placeholder="Description"
//                 value={milestone.description}
//                 onChange={(e) =>
//                   handleMilestoneChange("description", e.target.value)
//                 }
//                 className="mb-2"
//               />
//               <label
//                 htmlFor="startDate"
//                 className="block mb-1 font-semibold text-gray-800"
//               >
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 id="startDate"
//                 placeholder="Start Date"
//                 value={milestone.startDate}
//                 onChange={(e) =>
//                   handleMilestoneChange("startDate", e.target.value)
//                 }
//                 className="mb-2"
//               />
//               <label
//                 htmlFor="endDate"
//                 className="block mb-1 font-semibold text-gray-800"
//               >
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 id="endDate"
//                 placeholder="End Date"
//                 value={milestone.endDate}
//                 onChange={(e) =>
//                   handleMilestoneChange("endDate", e.target.value)
//                 }
//                 className="mb-4"
//               />
//             </div>
//             <Button
//               onClick={handleSaveMilestone}
//               className="w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
//             >
//               {isEditing ? "Update Milestone" : "Save Milestone"}
//             </Button>
//           </div>
//         </Card>
//         <div className="grid grid-cols-1 gap-6">
//           {savedMilestones.map((savedMilestone, index) => (
//             <Card key={index} className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <p className="text-gray-500">Milestone {index + 1}</p>
//                 <button
//                   onClick={() => handleEditMilestone(savedMilestone)}
//                   className="text-indigo-600 hover:text-indigo-800"
//                 >
//                   <Pencil />
//                 </button>
//               </div>
//               <p className="font-semibold mb-2">{savedMilestone.name}</p>
//               <p className="mb-2">{savedMilestone.description}</p>
//               <p className="mb-2">
//                 Start Date:{" "}
//                 {new Date(savedMilestone.startDate).toLocaleDateString()}
//               </p>
//               <p className="mb-4">
//                 End Date:{" "}
//                 {new Date(savedMilestone.endDate).toLocaleDateString()}
//               </p>
//               <div className="mb-4">
//                 <label className="block mb-1 font-semibold text-gray-800">
//                   Submission Links
//                 </label>
//                 {savedMilestone.submissionLinks.map((link, i) => (
//                   <p key={i} className="text-gray-600 mb-2">
//                     <a
//                       href={link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-500 underline"
//                     >
//                       {link}
//                     </a>
//                   </p>
//                 ))}
//                 {/* <Input
//                   type="text"
//                   value={submissionLinks[savedMilestone._id] || ""}
//                   onChange={(e) =>
//                     handleLinkChange(savedMilestone._id, e.target.value)
//                   }
//                   className="mb-2"
//                 />
//                 <Button
//                   onClick={() => submitLink(savedMilestone._id)}
//                   className="mb-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
//                 >
//                   Submit Link
//                 </Button> */}
//               </div>
//               {/* <div className="mb-4">
//                 <label className="block mb-1 font-semibold text-gray-800">
//                   Comments
//                 </label>
//                 {savedMilestone.comments.map((c, i) => (
//                   <p key={i} className="text-gray-600 mb-2">
//                     {c.comment} -{" "}
//                     <span className="text-gray-400 text-sm">
//                       {new Date(c.date).toLocaleDateString()}
//                     </span>
//                   </p>
//                 ))}
//                 <Textarea
//                   value={newComment[savedMilestone._id] || ""}
//                   onChange={(e) =>
//                     handleCommentChange(savedMilestone._id, e.target.value)
//                   }
//                   className="mb-2"
//                 />
//                 <Button
//                   onClick={() => addComment(savedMilestone._id)}
//                   className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
//                 >
//                   Add Comment
//                 </Button>
//               </div> */}
//               {/* <div className="mb-4">
//                 <label className="block mb-1 font-semibold text-gray-800">
//                   Update Status
//                 </label>
//                 <select
//                   value={savedMilestone.status}
//                   onChange={(e) =>
//                     updateMilestoneStatus(savedMilestone._id, e.target.value)
//                   }
//                   className="mb-2"
//                 >
//                   <option value="in progress">In Progress</option>
//                   <option value="completed">Completed</option>
//                 </select>
//               </div> */}
//               <div className="mb-4">
//                 <label className="block mb-1 font-semibold text-gray-800">
//                   Update Status
//                 </label>
//                 <select
//                   value={savedMilestone.status}
//                   onChange={(e) =>
//                     updateMilestoneStatus(savedMilestone._id, e.target.value)
//                   }
//                   className="mb-2"
//                 >
//                   <option value="in progress">In Progress</option>
//                   <option value="completed">Completed</option>
//                 </select>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/headerSup.jsx";
import { Card, Button, Textarea } from "@material-tailwind/react";
import { Pencil } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Milestone() {
  const { postId } = useParams();
  const [milestone, setMilestone] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [savedMilestones, setSavedMilestones] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [newComment, setNewComment] = useState({});

  const handleMilestoneChange = (field, value) => {
    setMilestone({
      ...milestone,
      [field]: value,
    });
  };

  const handleSaveMilestone = async () => {
    if (isEditing) {
      await handleUpdateMilestone();
    } else {
      try {
        const response = await axios.post("http://localhost:5000/milestone", {
          postId,
          ...milestone,
        });
        setSavedMilestones((prevMilestones) => [
          ...prevMilestones,
          response.data.milestone,
        ]);
        setMilestone({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
        });
        toast.success("Milestone added successfully!");
      } catch (error) {
        console.error("Error saving milestone:", error);
        toast.error("Failed to add milestone.");
      }
    }
  };

  const handleEditMilestone = (milestone) => {
    setIsEditing(true);
    setEditingMilestoneId(milestone._id);
    setMilestone({
      name: milestone.name,
      description: milestone.description,
      startDate: milestone.startDate.split("T")[0], 
      endDate: milestone.endDate.split("T")[0], 
    });
    toast.info("Editing milestone.");
  };

  const handleUpdateMilestone = async () => {
    try {
      await axios.put(`http://localhost:5000/milestone/${editingMilestoneId}`, {
        postId,
        ...milestone,
      });
      setSavedMilestones((prevMilestones) =>
        prevMilestones.map((m) =>
          m._id === editingMilestoneId ? { ...m, ...milestone } : m
        )
      );
      setMilestone({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
      });
      setIsEditing(false);
      setEditingMilestoneId(null);
      toast.success("Milestone updated successfully!");
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error("Failed to update milestone.");
    }
  };

  // const handleCommentChange = (milestoneId, comment) => {
  //   setNewComment({ ...newComment, [milestoneId]: comment });
  // };

  // const addComment = async (milestoneId) => {
  //   if (!newComment[milestoneId]) {
  //     toast.error("Please provide a comment.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `http://localhost:5000/milestone/${milestoneId}/comment`,
  //       { comment: newComment[milestoneId] }
  //     );
  //     const updatedMilestone = response.data;

  //     setSavedMilestones(
  //       savedMilestones.map((m) =>
  //         m._id === milestoneId ? updatedMilestone : m
  //       )
  //     );
  //     setNewComment({ ...newComment, [milestoneId]: "" });
  //     toast.success("Comment added successfully!");
  //   } catch (error) {
  //     console.error("Error adding comment:", error);
  //     toast.error("Failed to add comment.");
  //   }
  // };

  const updateMilestoneStatus = async (milestoneId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/milestone/${milestoneId}/status`,
        { status }
      );
      const updatedMilestone = response.data;

      setSavedMilestones(
        savedMilestones.map((m) =>
          m._id === milestoneId ? updatedMilestone : m
        )
      );
      toast.success("Milestone status updated successfully!");
    } catch (error) {
      console.error("Error updating milestone status:", error);
      toast.error("Failed to update milestone status.");
    }
  };

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/milestone/${postId}`
        );
        setSavedMilestones(response.data);
      } catch (error) {
        console.error("Error fetching milestones:", error);
      }
    };

    fetchMilestones();
  }, [postId]);

  return (
    <div className="bg-[#DEE4EA] min-h-screen">
      <Header />
      <ToastContainer />
      <div className="p-10">
        <Card className="mb-8">
          <div className="p-6">
            <h1 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Milestone" : "Milestone Details"}
            </h1>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-1 font-semibold text-gray-800"
              >
                Milestone Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Milestone Name"
                value={milestone.name}
                onChange={(e) => handleMilestoneChange("name", e.target.value)}
                className="mb-2"
              />
              <label
                htmlFor="description"
                className="block mb-1 font-semibold text-gray-800"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                placeholder="Description"
                value={milestone.description}
                onChange={(e) =>
                  handleMilestoneChange("description", e.target.value)
                }
                className="mb-2"
              />
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
                value={milestone.startDate}
                onChange={(e) =>
                  handleMilestoneChange("startDate", e.target.value)
                }
                className="mb-2"
              />
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
                value={milestone.endDate}
                onChange={(e) =>
                  handleMilestoneChange("endDate", e.target.value)
                }
                className="mb-4"
              />
            </div>
            <Button
              onClick={handleSaveMilestone}
              className="w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {isEditing ? "Update Milestone" : "Save Milestone"}
            </Button>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-6">
          {savedMilestones.map((savedMilestone, index) => (
            <Card key={index} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-500">Milestone {index + 1}</p>
                <button
                  onClick={() => handleEditMilestone(savedMilestone)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Pencil />
                </button>
              </div>
              <p className="font-semibold mb-2">{savedMilestone.name}</p>
              <p className="mb-2">{savedMilestone.description}</p>
              <p className="mb-2">
                Start Date:{" "}
                {new Date(savedMilestone.startDate).toLocaleDateString()}
              </p>
              <p className="mb-4">
                End Date:{" "}
                {new Date(savedMilestone.endDate).toLocaleDateString()}
              </p>
              {/* <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-800">
                  Comments
                </label>
                {savedMilestone.comments?.map((c, i) => (
                  <p key={i} className="text-gray-600 mb-2">
                    {c.comment} -{" "}
                    <span className="text-gray-400 text-sm">
                      {new Date(c.date).toLocaleDateString()}
                    </span>
                  </p>
                ))}
                <Textarea
                  value={newComment[savedMilestone._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(savedMilestone._id, e.target.value)
                  }
                  className="mb-2"
                />
                <Button
                  onClick={() => addComment(savedMilestone._id)}
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Add Comment
                </Button>
              </div> */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-800">
                  Update Status
                </label>
                <select
                  value={savedMilestone.status}
                  onChange={(e) =>
                    updateMilestoneStatus(savedMilestone._id, e.target.value)
                  }
                  className="mb-2"
                >
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
