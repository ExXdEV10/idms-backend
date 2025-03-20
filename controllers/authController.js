const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // Import the logger

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`User registration failed: User already exists (email: ${email})`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Log the registration
    logger.info(`User registered successfully (email: ${email})`);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Log the error
    logger.error(`Error registering user: ${error.message}`);

    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: Invalid email (email: ${email})`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password (email: ${email})`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Log the successful login
    logger.info(`User logged in successfully (email: ${email})`);

    res.status(200).json({ token });
  } catch (error) {
    // Log the error
    logger.error(`Error logging in: ${error.message}`);

    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Fetch user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      logger.warn(`User details not found for ID: ${req.user.userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the successful fetch
    logger.info(`Fetched user details for ID: ${req.user.userId}`);

    res.status(200).json(user);
  } catch (error) {
    // Log the error
    logger.error(`Error fetching user details: ${error.message}`);

    res.status(500).json({ message: 'Error fetching user details', error });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find the user
    const user = await User.findById(req.user.userId);
    if (!user) {
      logger.warn(`User not found for ID: ${req.user.userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      logger.warn(`Password change failed: Incorrect current password for user ID: ${req.user.userId}`);
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    // Log the successful password change
    logger.info(`Password updated successfully for user ID: ${req.user.userId}`);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    // Log the error
    logger.error(`Error changing password: ${error.message}`);

    res.status(500).json({ message: 'Error changing password', error });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    // Log the successful logout
    logger.info(`User logged out successfully for user ID: ${req.user.userId}`);

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    // Log the error
    logger.error(`Error logging out: ${error.message}`);

    res.status(500).json({ message: 'Error logging out', error });
  }
};