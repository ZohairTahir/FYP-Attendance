import Notification from "../models/Notification.js";

// After adding the notification schema, you can create a new notification when a student connects with a project

// router.post('/posts/connect',
const connectNotification = async (req, res) => {
  const { postId, studentId } = req.body;

  try {
    // Logic to connect the student with the project...

    // Create a notification for the company
    const newNotification = new Notification({
      sender: studentId,
      receiver: companyId, // Assuming you have companyId available
      message: "New applicant connected with your project",
      projectId: postId,
    });
    await newNotification.save();

    res.status(200).json({ message: "Connected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  connectNotification,
};
