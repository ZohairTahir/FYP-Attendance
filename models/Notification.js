const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema();
// {
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "UserData", // Reference to the sender (student)
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "UserData", // Reference to the receiver (company)
//   },
//   message: String,
//   projectId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Post", // Reference to the project
//   },
//   read: {
//     type: Boolean,
//     default: false,
//   },
// },
// { timestamps: true }

// selected applicantsid max 2
// postid
// name
// discription
// start
// end
// status
// crated by

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
