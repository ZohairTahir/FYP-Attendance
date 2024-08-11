import Grpcard from "../models/Grpcard.js";  // Assuming you have a Grpcard model defined

// Get group cards by author ID




  const fetchGrpcardsBySupervisor = async (req, res) => {
    try {
      const userId = req.cookies.userId; // Retrieve the user ID from cookies
      console.log("recieved")
      // Find the supervisor in UsersData using the user ID
      const supervisor = await UsersData.findOne({ _id: userId, userType: 'supervisor' });
      if (!supervisor) {
        return res.status(404).json({ error: 'Supervisor not found' });
      }
    }
      catch (error) {
        console.error('Error fetching GRP cards:', error);
        res.status(500).json({ error: 'An error occurred while fetching GRP cards' });
      }
    }

const getGroupCardsByAuthor = async (req, res) => {
  const email = req.params.email;
  const authorId = req.params.authorId; // Use the userId from the auth middleware
  try {
    const cards = await Grpcard.find({ author: authorId }).populate("applicants");
    res.status(200).json({ cards });
  } catch (error) {
    console.error("Error fetching group cards by author:", error);
    res.status(500).json({ error: "An error occurred while fetching group cards by author" });
  }
};
export default{
  getGroupCardsByAuthor,
  fetchGrpcardsBySupervisor
}
