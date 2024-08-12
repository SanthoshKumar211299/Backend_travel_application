import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from 'nodemailer'
import dotenv from "dotenv"

dotenv.config()
//user Registration

export const register = async (req, res) => {
  try {
    //hashing password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      photo: req.body.photo,
    });

    await newUser.save();

    res
    .status(200).
    json({success: true, message: "SuccessFully Created"});
  } 
  catch (err) {
    res
      .status(500)
      .json({success: false, message: "Failed to create..try again"});
  }
};

//user Login
export const login = async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });

    //if user doesn't exist
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    //if user is exist then check the passowrd or compare the password

    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // if password  is incorrect
    if (!checkCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "incorrect email or Password" });
    }

    const { password, role, ...rest } = user._doc;

    //create jwt token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );
    // set token in the browser cookies and send the response to the client
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: token.expiresIn,
      })
      .status(200)
      .json({
        token,
        data: { ...rest },
        role,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "login failed" });
  }
};

//forgot password:
// Adjust the path according to your project structure

// Forgot password function
export const forgotPassword = async (req, res) => {
  const email = req.body.email;

  try {
    // Fetch the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex');
    const resetToken = crypto.createHash('sha256').update(token).digest('hex');

    // Set token and expiry time on the user instance
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 600; // 10min from now
    await user.save(); // Save the user with the reset token

    // Create the reset URL
    const resetUrl = `${process.env.CLIENT_URL}/resetPassword/${resetToken}`;

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or any other service you use
      auth: {
        user: process.env.NODEMAILER_USER, // Your email id
        pass: process.env.NODEMAILER_PASSWORD, // Your password
      },
    });

    // Email content
    const mailOptions = {
      to: user.email,
      from: process.env.NODEMAILER_USER,
      subject: 'Password Reset Request',
      html: `<p>You requested for a password reset</p>
             <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.error('There was an error: ', error);
        return res.status(500).json({ message: 'Error sending the email' });
      } else {
        return res.status(200).json({ message: 'Password reset link sent to your email' });
      }
    });

  } catch (err) {
    console.error('Server error: ', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

 if (!token || !password) {
   return res.status(400).json({ message: 'Token and new password are required' });
 }

  try {
    // Hash the token to compare with the stored hashed token
    
   // const token = crypto.randomBytes(32).toString('hex');
   /* const hashedToken = crypto.createHash('sha256').update(token).digest('hex');*/

    // Find user by hashed token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      //resetPasswordExpires: { $lt: Date.now()+ 3600000 }, // Check if the token is still valid
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};




