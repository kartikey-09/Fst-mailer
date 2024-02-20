const express = require('express');
const router = express.Router();
const { asyncError } = require('../../middlewares/error');
const Contact = require('../../models/Contact');
const verifyToken = require('../../utils/verifyToken'); 
const mongoose = require('mongoose');


router.post('/create-contact', asyncError(async (req, res) => {
    // Token Verification
    const token = req.headers.authorization;
   
    if (!token) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }

    let user = verifyToken(token);
    
    
    if (!user.success) {
        return res.status(400).json({ success: false, message: user.message });
    }

    // Ensure that req.body.contacts is an array
    if (!Array.isArray(req.body.contacts) || req.body.contacts.length === 0) {
        return res.status(400).json({ success: false, message: "Please provide an array of contacts." });
    }


    const contacts = req.body.contacts;

    // Ensure that the groupName is present
    const groupName = req.body.groupName;
    if (!groupName) {
        return res.status(400).json({ success: false, message: "Please provide groupName." });
    }

    const createdContacts = [];

    for (const contact of contacts) {
        const { emailId, name, phone } = contact;

        // Check if required fields are present
        if (!emailId || !name || !phone) {
            console.log("object1")
            return res.status(400).json({ success: false, message: "Please provide emailId and name for each contact." });
        }

        // Check if the contact already exists
        const existingContact = await Contact.findOne({ emailId });
        const existingContactByPhone = await Contact.findOne({ phone });

        if (existingContact) {
            console.log("object2")
            return res.status(400).json({ success: false, message: `Contact with emailId ${emailId} already exists.` });
        }
        if (existingContactByPhone) {
            console.log("object3")
            return res.status(400).json({ success: false, message: `Contact with phone number ${phone} already exists.` });
        }
        // Set the creator and groupName based on the token information and request body

        contact.creator = user.user._id;
        contact.groupName = groupName;

        // Create the contact using the Contact model
        const createdContact = await Contact.create(contact);
        // Push the created contact to the array
        createdContacts.push(createdContact);
    }

    res.status(201).json({
        success: true,
        message: "Contacts created successfully",
        contacts: createdContacts
    });
}));

router.get('/get-contacts', asyncError(async (req, res) => {
    // Token Verification
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }
    let user = verifyToken(token);
    if (!user.success) {
        return res.status(400).json({ success: false, message: user.message });
    }

    // Check data
    const { id, groupName } = req.query;
    if (!id) {
        return res.status(400).json({ success: false, message: "Invalid API route" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid API route/Id" });
    }

    try {
        let contacts;

        // Check if groupName is provided
        if (groupName) {
            // Get contacts for the specified user ID and groupName
            contacts = await Contact.find({ groupName: groupName });
        } else {
            // Get all contacts for the specified user ID
            contacts = await Contact.find();
        }

        res.status(200).json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}));


router.delete('/delete-contact/:id', asyncError(async (req, res) => {
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
  
    try {
      
      const contact = await Contact.findById(id);

      if (!contact) {
        return res.status(400).json({ success: false, message: "Contact not found" });
      }
 
      await Contact.findByIdAndDelete(id);
 
      res.status(200).json({ success: true, message: "Contact deleted successfully." });
    } catch (error) {

      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }));
  
module.exports = router;