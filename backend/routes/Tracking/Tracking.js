const express = require('express');
const router = express.Router();
const EmailTracking = require('../../models/EmailTracking')

router.get('/track/:emailId', async (req, res) => {
  const emailId = req.params.emailId;
   
  try {
    await EmailTracking.create({ emailId });
    console.log(`Email with ID ${emailId} opened at ${new Date()}`);
    console.log("mail-opened")
  res.status(200).json({success:true , message:"mail opened"})
  } catch (error) {
    console.error('Error logging email opening:', error);
    res.status(500).json({success:false , message:error});
  }
  
  });

  module.exports = router;