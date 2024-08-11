// import StudentProfile from "../models/StudentProfile.js";
// import CompanyProfile from "../models/CompanyProfile.js";
// import UserData from "../models/UserData.js";
import upload from "../middleware/multerSetup.js";

// const setupProfile = async (req, res) => {
//   try {
//     const { userId, userType, profileData } = req.body;

//     const file = req.file;

//     let profileModel;
//     let userUpdateField;
//     if (userType === "student") {
//       profileModel = StudentProfile;
//       userUpdateField = "Sprofile";
//     } else if (userType === "company") {
//       profileModel = CompanyProfile;
//       userUpdateField = "Cprofile";
//     } else {
//       return res.status(400).json({
//         error: `Invalid user type: ${userType}. Supported types are 'student' and 'company'.`,
//       });
//     }

//     const parsedProfileData = JSON.parse(profileData);

//     const newProfile = new profileModel({
//       userID: userId,
//       ...(userType === "student"
//         ? {
//             name: parsedProfileData.name,
//             university: parsedProfileData.university,
//             bio: parsedProfileData.bio,
//             projects: parsedProfileData.projects,
//             skills: parsedProfileData.skills,
//             experiences: parsedProfileData.experiences,
//             education: parsedProfileData.education,
//             profilePicture: file ? file.path : "",
//           }
//         : userType === "company"
//         ? {
//             companyName: parsedProfileData.companyName,
//             description: parsedProfileData.description,
//             products: parsedProfileData.products,
//             services: parsedProfileData.services,
//             profilePicture: file ? file.path : "",
//           }
//         : {}),
//     });

//     await newProfile.save();

//     const updateQuery = {
//       [userUpdateField]: newProfile._id,
//     };
//     const updatedUser = await UserData.findByIdAndUpdate(userId, updateQuery, {
//       new: true,
//     });

//     console.log("Setup Profile Data:", {
//       userId,
//       userType,
//       profileData: parsedProfileData,
//       newProfile,
//       updatedUser,
//     });

//     res
//       .status(201)
//       .json({ message: "Profile setup successful.", user: updatedUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

// const getProfile = async (req, res) => {
//   try {
//     const { userId, userType } = req.query;

//     if (!userId || !userType) {
//       return res
//         .status(400)
//         .json({ error: "Missing userId or userType in the request." });
//     }
//     let profileModel;
//     let userUpdateField;

//     if (userType === "student") {
//       profileModel = StudentProfile;
//       userUpdateField = "Sprofile";
//     } else if (userType === "company") {
//       profileModel = CompanyProfile;
//       userUpdateField = "Cprofile";
//     } else {
//       return res.status(400).json({ error: "Invalid user type." });
//     }
//     const userData = await UserData.findById(userId);

//     if (!userData) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     const profileId = userData[userUpdateField];

//     if (!profileId) {
//       return res.status(404).json({ error: "Profile not found." });
//     }

//     const userProfile = await profileModel.findById(profileId);

//     if (!userProfile) {
//       return res.status(404).json({ error: "Profile not found." });
//     }

//     const { email } = userData;

//     return res.status(200).json({ userProfile, email });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };
// const updateProfile = async (req, res) => {
//   try {
//     const { userId, userType, updatedProfileData } = req.body;

//     if (!userId || !userType || !updatedProfileData) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     let profileModel;
//     let userUpdateField;

//     if (userType === "student") {
//       profileModel = StudentProfile;
//       userUpdateField = "Sprofile";
//     } else if (userType === "company") {
//       profileModel = CompanyProfile;
//       userUpdateField = "Cprofile";
//     } else {
//       return res.status(400).json({ error: "Invalid user type." });
//     }

//     const userData = await UserData.findById(userId);

//     if (!userData) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     const profileId = userData[userUpdateField];

//     if (!profileId) {
//       return res.status(404).json({ error: "Profile not found." });
//     }

//     const updatedProfile = await profileModel.findOneAndUpdate(
//       { _id: profileId },
//       { $set: updatedProfileData },
//       { new: true }
//     );

//     if (!updatedProfile) {
//       return res.status(404).json({ error: "Profile not found." });
//     }

//     return res.status(200).json({ updatedProfile });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };

// export default { setupProfile, getProfile, updateProfile };
