// import Milestone from "../models/Milestone.js";
// import Post from "../models/post.js"; // Ensure the filename and export are correct
// import User from "../models/UserData.js";

const createMilestone = async (req, res) => {
  try {
    const { postId, name, description, startDate, endDate } = req.body;
    const newMilestone = new Milestone({
      postId,
      name,
      description,
      startDate,
      endDate,
    });
    await newMilestone.save();
    const post = await Post.findById(postId);
    post.milestones.push(newMilestone._id);
    await post.save();
    res.status(201).json({
      message: "Milestone created successfully",
      milestone: newMilestone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMilestones = async (req, res) => {
  try {
    const { postId } = req.params;
    const milestones = await Milestone.find({ postId });
    res.status(200).json(milestones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateMilestoneStatus = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { status } = req.body;
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }
    milestone.status = status;
    await milestone.save();
    res
      .status(200)
      .json({ message: "Milestone status updated successfully", milestone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addMilestoneComment = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { comment } = req.body;
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }
    milestone.comments.push({ comment, date: new Date() });
    await milestone.save();
    res.status(200).json({ message: "Comment added successfully", milestone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;
    const { milestoneId } = req.params;
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }
    milestone.name = name;
    milestone.description = description;
    milestone.startDate = startDate;
    milestone.endDate = endDate;
    milestone.status = status;
    await milestone.save();
    res
      .status(200)
      .json({ message: "Milestone updated successfully", milestone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getStudentMilestones = async (req, res) => {
  try {
    const { userId } = req.userData;
    const user = await User.findById(userId).populate("Sprofile").exec();
    const post = await Post.findOne({ selectedApplicants: user.Sprofile._id });
    if (!post) {
      return res
        .status(403)
        .json({ error: "Not authorized to view milestones" });
    }
    const milestones = await Milestone.find({ projectId: post._id });
    res.status(200).json(milestones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addSubmissionLink = async (req, res) => {
  const { milestoneId } = req.params;
  const { submissionLink } = req.body;

  try {
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    milestone.submissionLinks.push(submissionLink);
    await milestone.save();

    res.status(200).json(milestone);
  } catch (error) {
    console.error("Error adding submission link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  createMilestone,
  updateMilestoneStatus,
  addMilestoneComment,
  getMilestones,
  updateMilestone,
  getStudentMilestones,
  updateMilestoneStatus,
  addMilestoneComment,
  addSubmissionLink,
};

// const isSelectedForProject = async (req, res) => {
//   const { userId } = req.query;

//   try {
//     const posts = await Post.find({ selectedApplicants: userId });

//     if (posts.length > 0) {
//       res.status(200).json({ selected: true });
//     } else {
//       res.status(200).json({ selected: false });
//     }
//   } catch (error) {
//     console.error("Error checking selected applicants:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const addSubmissionLink = async (req, res) => {
//   try {
//     const { milestoneId } = req.params;
//     const { submissionLink } = req.body;
//     const milestone = await Milestone.findById(milestoneId);
//     if (!milestone) {
//       return res.status(404).json({ error: "Milestone not found" });
//     }
//     milestone.submissionLink = submissionLink;
//     await milestone.save();
//     res
//       .status(200)
//       .json({ message: "Submission link added successfully", milestone });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// const addSubmissionLink = async (req, res) => {
//   try {
//     const { milestoneId } = req.params;
//     const { submissionLink } = req.body;
//     const milestone = await Milestone.findById(milestoneId);
//     if (!milestone) {
//       return res.status(404).json({ error: "Milestone not found" });
//     }
//     milestone.submissionLink = submissionLink;
//     await milestone.save();
//     res
//       .status(200)
//       .json({ message: "Submission link added successfully", milestone });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// const addSubmissionLink = async (req, res) => {
//   const { milestoneId } = req.params;
//   const { submissionLink } = req.body;

//   try {
//     const milestone = await Milestone.findById(milestoneId);
//     if (!milestone) {
//       return res.status(404).json({ error: "Milestone not found" });
//     }

//     milestone.submissionLinks.push(submissionLink);
//     await milestone.save();

//     res.status(200).json(milestone);
//   } catch (error) {
//     console.error("Error adding submission link:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// const getStudentMilestones = async (req, res) => {
//   try {
//     const { userId } = req.userData;
//     const user = await User.findById(userId).populate("Sprofile").exec();
//     const milestones = await Milestone.find({ applicants: user.Sprofile._id });
//     res.status(200).json(milestones);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// const addMilestoneComment = async (req, res) => {
//   try {
//     const { milestoneId, comment } = req.body;
//     const milestone = await Milestone.findById(milestoneId);
//     if (!milestone) {
//       return res.status(404).json({ error: "Milestone not found" });
//     }
//     milestone.comments.push({ comment, date: new Date() });
//     await milestone.save();
//     res.status(200).json({ message: "Comment added successfully", milestone });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// const updateMilestoneStatus = async (req, res) => {
//   try {
//     const { milestoneId, status, submissionLink } = req.body;
//     const milestone = await Milestone.findById(milestoneId);
//     if (!milestone) {
//       return res.status(404).json({ error: "Milestone not found" });
//     }
//     milestone.status = status;
//     if (submissionLink) {
//       milestone.submissionLink = submissionLink;
//     }
//     await milestone.save();
//     res
//       .status(200)
//       .json({ message: "Milestone updated successfully", milestone });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
