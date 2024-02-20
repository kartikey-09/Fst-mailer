const express = require('express');
const router = express.Router();
const { asyncError } = require('../../middlewares/error');
// const User = require('../../models/User');
const Template = require('../../models/Templates');
const verifyToken = require('../../utils/verifyToken');
const mongoose = require('mongoose')


router.get('/get-templates', async (req, res) => {
    try {
      const templates = await Template.find({}, 'subject content'); // Fetch only subject and content
      res.status(200).json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post(
    "/create-template",
    asyncError(async (req, res) => {
      // Token Verification
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(400)
          .json({ success: false, message: "No token provided" });
      }
  
      let user = verifyToken(token);
      if (!user.success) {
        return res.status(400).json({ success: false, message: user.message });
      }
  
      let { createrId, subject, content } = req.body;
  
      if (!createrId || !subject || !content) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter all fields." });
      }
  
      if (!mongoose.Types.ObjectId.isValid(createrId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Creater Id" });
      }
  
      // Save the template in the database
      const createdTemplate = await Template.create({
        createrId: createrId,
        subject: subject,
        content: content,
      });
  
      // Send the response with the created template
      res.status(200).json({ success: true, message: "Template Created Successfully", template: createdTemplate });
    })
  );

  router.delete(
    "/delete-template/:id",
    asyncError(async (req, res) => {
      // Token Verification
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(400)
          .json({ success: false, message: "No token provided" });
      }
  
      let user = verifyToken(token);
      if (!user.success) {
        return res.status(400).json({ success: false, message: user.message });
      }
  
      const id = req.params.id;
      if (!id)
        return res
          .status(400)
          .json({ success: false, message: "Please provide valid params" });
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Params Id" });
      }
  
      const template = await Template.findById(id);
      if (!template) {
        return res
          .status(400)
          .json({ success: false, message: "Template not found" });
      }
  
      await Template.findByIdAndDelete(id);
  
      res.status(200).json({ success: true, message: "Deleted Successfully." });
    })
  );
  

  module.exports = router;