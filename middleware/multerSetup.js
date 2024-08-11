// const multer = require('multer');

// // Storage configuration for Multer
// const storage = multer.memoryStorage(); // You can customize storage as needed

// // Create Multer instance with configuration
// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5, // Limit file size if required
//   },
//   fileFilter: (req, file, callback) => {
//     // Implement file filtering if needed (e.g., check file types)
//     // Example:
//     // if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
//     //   callback(null, true);
//     // } else {
//     //   callback(new Error('Invalid file type'), false);
//     // }
//     callback(null, true); // Allow all files by default
//   },
// });

// module.exports = upload;

// const multer = require('multer');

// import multer from "multer";

//const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/png"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// const upload = multer({
//   //storage,
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: fileFilter,
// }).single("profilePicture"); // Modify this to match your file field name

// // module.exports = upload;

// export default upload;

// middleware/multerSetup.js
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public"); // Save files to the public/uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    //cb(null, Date.now() + "-" + file.originalname); // Add timestamp to the filename to ensure uniqueness
  },
});

const upload = multer({ storage: storage }).single("profilePicture");

export default upload;
