import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersData from "../models/UsersData.js";
// import Studentdata from "../models/Studentdata.js";
// import Supervisordata from "../models/Supervisordata.js";

const register = async (req, res) => {
  try {
    const { email, password, userType, regno } = req.body;

    if (userType === 'Supervisor') {
      const existingUser = await UsersData.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UsersData({ email, password: hashedPassword, userType, ...(regno && { regno }) });
      await newUser.save();
      res.status(201).json({ userId: newUser._id, userType, message: "Registration successful" });
    } else if (userType === 'Student') {
      const existingUser = await Studentdata.findOne({ regno });
      if (existingUser) {
        return res.status(400).json({ error: "Registration number is already registered." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UsersData({ regno, password: hashedPassword, userType });
      await newUser.save();
      res.status(201).json({ userId: newUser._id, userType, message: "Registration successful" });
    } else {
      return res.status(400).json({ error: "Invalid user type." });
    }


    // if (userType === 'Supervisor') {
    //   const newSupervisor = new Supervisordata({ userId: newUser._id, email });
    //   await newSupervisor.save();
    // } else if (userType === 'Student') {
    //   const newStudent = new Studentdata({ userId: newUser._id, regno });
    //   await newStudent.save();
    // }

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, userType, regno } = req.body;
    let user;  // Define user variable here

    console.log(`Received request for userType: ${userType}, email: ${email}, regno: ${regno}, password: ${password}`);

    if (userType === 'Supervisor') {
      console.log('Looking for supervisor with email:', email);
      user = await UsersData.findOne({ email });
      if (!user) {
        console.log("No supervisor found with email:", email);
        return res.status(401).json({ error: "Invalid credentials." });
      }
    } else if (userType === 'Student') {
      console.log('Looking for student with regno:', regno);
      user = await UsersData.findOne({ regno });
      if (!user) {
        console.log("No student found with regno:", regno);
        return res.status(401).json({ error: "Invalid credentials." });
      }
    } else {
      console.log("Invalid user type:", userType);
      return res.status(400).json({ error: "Invalid user type." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password comparison result for user ${userType} (ID: ${user._id}): ${isPasswordValid}`);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const expiresIn = 3600;
    const payload = {
      userId: user._id,
      userType: user.userType
    };

    const token = jwt.sign(payload, "your_secret_key", { expiresIn });

    console.log("Authentication successful, sending response with token");
    return res.json({ userId: user._id, userType: user.userType, token, email: user.email });
  } catch (error) {
    console.error("Error in login function:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default { register, login };

// const updateUserType = async (req, res) => { 
//   try {
//     const { userId, userType } = req.body;

//     await Users.updateOne({ _id: userId }, { userType });
//     console.log("Received userType:", userType);

//     if (userType === "Student") {
//       const newStudentdata = new Studentdata({ userId });
//       await newStudentdata.save();
//     } else if (userType === "Supervisor") {
//       const newSupervisordata = new Supervisordata({ userId });
//       await newSupervisordata.save();
//     } else {
//       return res.status(400).json({ error: "Invalid user type." });
//     }

//     res.json({ message: "User type and profile setup successful." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };


