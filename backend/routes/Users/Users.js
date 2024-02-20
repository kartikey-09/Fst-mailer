const express = require('express');
const router = express.Router();
const { asyncError } = require('../../middlewares/error');
const User = require('../../models/User');
const verifyToken = require('../../utils/verifyToken');
const generateToken = require('../../utils/generateToken')
const mongoose = require('mongoose');

// Create User
router.post('/create-user', asyncError(async (req, res) => {
    // Token Verification
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }
    let user = verifyToken(token);
    if (!user.success) {
        return res.status(400).json({ success: false, message: user.message });
    }
    // const {  emailId, password, name, role } = req.body;
    const { creator, emailId, password, name, role } = req.body;
    if ( !creator ||!emailId || !password || !name || !role) {
        return res.status(400).json({ success: false, message: "Please enter all fields." });
    }

    // finding the user if he/she exist or not
    user = await User.findOne({ emailId });
    if (user) {
        return res.status(400).json({ success: false, message: "User already registered with this Email Id." });
    }

    user = await User.create(req.body)

    res.status(201).json({
        success: true,
        message: "Registered Successfully",
        user
    })
}))

// Login User
router.post('/login-user', asyncError(async (req, res) => {
    const { emailId, password } = req.body;

    if (!emailId || !password) return res.status(400).json({ success: false, message: "Please enter all fields." });
    // finding the user if he/she exist or not
    let user = await User.findOne({ emailId });
    if (!user) {
        console.log("first")
        return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    if (password !== user.password) {
        console.log("second")
        return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(user._id, user.name, user.role, user.emailId);

    res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}`,
        token
    })
}))

// get users
router.get('/get-users', asyncError(async (req, res) => {
    // Token Verification
    const token = req.headers.authorization;
    if (!token) {
        
        return res.status(400).json({ success: false, message: "No token provided" });
    }
    let user = verifyToken(token);
    if (!user.success) {
        return res.status(400).json({ success: false, message: user.message });
    }

    // check data
    const { id } = req.query;
    if (!id) { 
        return res.status(400).json({ success: false, message: "Invalid Api route" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Api route/Id" });
    }

    const users = await User.find({creator: id});
    res.status(200).json({success: true,users})
}))

// update password
router.put('/update-password/:id', asyncError(async(req,res)=>{
    // Token Verification
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }
    let verify = verifyToken(token);
    if (!verify.success) {
        return res.status(400).json({ success: false, message: verify.message });
    }

    const { password } = req.body;
    if (!password) return res.status(400).json({ success: false, message: "Please provide password." });

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Id" });
    }

    // Update the user's password in the database
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { password },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
}))


// delete user
router.delete('/delete-user/:id', asyncError( async(req,res) => {
    // Token Verification
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }
    let user = verifyToken(token);
    if (!user.success) {
        return res.status(400).json({ success: false, message: user.message });
    }

    const id = req.params.id;

    const data = await User.findById(id);
    if (!data) {
        return res.status(400).json({ success: false, message: "User not found" })
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Deleted Successfully." })
}))


module.exports = router;