import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Assuming you have a User model

export async function authenticateUser(req, res, next) {
  try {
    // Check for the "Authorization" header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "You need to login" });
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: " Authentication required" });
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get the user ID from the decoded token
    const userId = decodedToken.user_id;

    // Find the user in the database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error(error); // Log the error to the console for debugging purposes
    return res.status(500).json({ error: "Internal server error" });
  }
}
