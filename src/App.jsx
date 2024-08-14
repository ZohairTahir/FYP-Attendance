import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Home/homepage.jsx";
import HomepageStudent from "./Pages/Home/homepageStudent.jsx";
import Welcome from "./Pages/Welcome/welcomepage.jsx";
import Signin from "./Pages/Signin/signin";
//import Profile from "./Pages/Profile/profile";
import Register from "./Pages/Signin/register";
import ProjectDetails from "./Pages/ProjectDetails/Details.jsx"
import ProjectPost from "./Pages/ProjectPost/posting";
import Profilesetup from "./Pages/Profile/ProfileSetup";
import UpdateProfileSetup from "./Pages/Profile/updateProfileSetup.jsx";
import Projectpage from "./Pages/Project/project.jsx";
import UpdatePost from "./Pages/ProjectPost/updatepost.jsx";
import Milestone from "./Pages/Project/milestone.jsx";
import StudentMilestones from "./Pages/Project/StudentMilestones.jsx"; // Import the new component
import OngoingProjects from "./Pages/Project/OngoingProjects.jsx"; // New import

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/homepageStudent" element={<HomepageStudent />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
           <Route path="/group/:id" element={<ProjectDetails/>} />
          {/* <Route path="/profilesetup" element={<Profilesetup />} /> */}
         {/* <Route path="/updateProfileSetup" element={<UpdateProfileSetup />} /> */}
          {/* <Route path="/projectpage" element={<Projectpage />} /> */}
          {/* <Route path="/projectpage/:id" element={<Projectpage />} /> */}
          {/* <Route
            path="/profile"
            element={
              <>
                <Profile />
              </>
            }
          /> */}
          {/* <Route path="/post" element={<ProjectPost />} /> */}
          {/* <Route path="/milestone/:postId" element={<Milestone />} /> */}
          {/* <Route path="/updatepost/:postId" element={<UpdatePost />} /> */}
          <Route path="/" element={<Welcome />} />
          {/* <Route
            path="/student-milestones/:postId"
            element={<StudentMilestones />}
          /> */}
          {/* Add new route */}
          {/* <Route path="/ongoing-projects" element={<OngoingProjects />} /> */}
          {/* New route */}
        </Routes>
      </>
    </Router>
  );
}

export default App;
