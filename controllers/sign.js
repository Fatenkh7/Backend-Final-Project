// // Import necessary modules and models
// import bcrypt from "bcryptjs";
// import User from "../models/User.js";
// const saltRounds = 11;
// // Login controller
// export const loginController = async (req, res) => {
//   try {
//     // Retrieve email and password from the request body
//     const { email, password } = req.body;

//     // Find the user by email in the database
//     const user = await User.findOne({ where: { email } });

//     // If user does not exist, send an error response
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Compare the provided password with the hashed password in the database
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     // If passwords do not match, send an error response
//     if (!passwordMatch) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Set the user's ID in the session to establish the session-based authentication
//     req.session.userId = user.id;

//     // Send a success response
//     res.status(200).json({ message: "Logged in successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred during login" });
//   }
// };

// export const registerController = async (req, res) => {
//   try {
//     // Retrieve user details from the request body
//     const { first_name, last_name, username, email, password } = req.body;

//     // Check if the user already exists in the database
//     const existingUser = await User.findOne({ where: { email } });

//     // If user already exists, send an error response
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Hash the password using bcrypt
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create a new user instance
//     const newUser = new User({
//       first_name,
//       last_name,
//       username,
//       email,
//       password: hashedPassword,
//     });

//     // Save the user to the database
//     await newUser.save();

//     // Send a success response
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred during registration" });
//   }
// };
