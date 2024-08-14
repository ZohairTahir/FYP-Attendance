import mongoose from 'mongoose'
import Grpcard from "../models/Grpcard.js";  // Assuming you have a Grpcard model defined
import Users from "../models/Users.js";

  // const fetchGrpcardsBySupervisor = async (req, res) => {
  //   try {
  //     const userId = req.cookies.userId; // Retrieve the user ID from cookies
  //     console.log("recieved")
  //     // Find the supervisor in UsersData using the user ID
  //     const supervisor = await UsersData.findOne({ _id: userId, userType: 'supervisor' });
  //     if (!supervisor) {
  //       return res.status(404).json({ error: 'Supervisor not found' });
  //     }
  //   }
  //     catch (error) {
  //       console.error('Error fetching GRP cards:', error);
  //       res.status(500).json({ error: 'An error occurred while fetching GRP cards' });
  //     }
  //   }

const getProjectDesc = async (req,res) =>
{
  try {
    const grpcardId = req.params.cardId;
    //console.log(grpcardId);
    if (!mongoose.Types.ObjectId.isValid(grpcardId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const allGrpcards = await Grpcard.findOne({_id:grpcardId});
   // console.log(allGrpcards)
    // If no card found, return a 404 error
    if (!allGrpcards) {   
      return res.status(404).json({ message: 'Group card not found' });
    }
    res.cookie('grpcardId', grpcardId, { httpOnly: true, secure: true });

    // If found, return the group card details
    res.json({ cards: allGrpcards });
  } catch (error) {
    console.error(error); // Log the error to debug
    res.status(500).json({ error: error.message });
  }
};


  const getGroupCardsByAuthor = async (req, res) => {
    try {
      const email = req.params.email;
      
  
      // Fetch data from the Users collection based on supervisor_email
      const UsersCollection = await Users.find({ supervisor_email: email });
  
      // Create a map to group users by topic
      const topicMap = new Map();
  
      UsersCollection.forEach((card) => {
        if (topicMap.has(card.topic)) {
          // Add student name to the existing group
          topicMap.get(card.topic).groupMembers.push(card.name);
        } else {
          // Create a new entry for this topic
          topicMap.set(card.topic, {
            projectTitle: card.topic,
            groupMembers: [card.name], // Initialize with the first member
            supervisor: card.supervisor,
            email:card.supervisor_email,
            description: card.description,
            lastUpdated: new Date().toISOString(),
          });
        }
      });
  
      // Save or update each grpcard
      const grpcards = await Promise.all(
        Array.from(topicMap.values()).map(async (grpcardData) => {
          let grpcard = await Grpcard.findOne({ projectTitle: grpcardData.projectTitle });
          
          if (!grpcard) {
            // Create a new grpcard if it doesn't exist
            grpcard = new Grpcard(grpcardData);
            await grpcard.save();
          } else {
            // Update the existing grpcard
            await Grpcard.findByIdAndUpdate(grpcard._id, grpcardData);
          }
        
          return grpcard;
        })
      );
  
      // Fetch and return all grpcards associated with the supervisor's email
      const allGrpcards = await Grpcard.find({ email: req.params.email });
      res.json({ cards: allGrpcards });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
export default{
  getGroupCardsByAuthor,
  getProjectDesc,

}
