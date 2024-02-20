const express = require('express');
const router = express.Router();
const { asyncError } = require('../../middlewares/error');
const User = require('../../models/User');
const Mail = require('../../models/Mail');
const verifyToken = require('../../utils/verifyToken');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');


// create mail
router.post('/create-mail', asyncError(async (req, res) => {
    // Token Verification
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }
    let user = verifyToken(token);
    if (!user.success) {
        return res.status(400).json({ success: false, message: user.message });
    }


    let { senderId, receivers, subject, content } = req.body;
    console.log(req.body);

    if (!senderId || !receivers || !subject || !content) {
        return res.status(400).json({ success: false, message: "Please enter all fields." });
    }

    if (!mongoose.Types.ObjectId.isValid(senderId)) {
        return res.status(400).json({ success: false, message: "Invalid Sender Id" });
    }

    user = await User.findById(senderId);
    if (!user) {
        return res.status(400).json({ success: false, message: "User Not Found." });
    }


    let mailTransporter = nodemailer.createTransport({
        host: 'premium275.web-hosting.com',
        port: 465,
        service: 'cPanel Webmail',
        auth: {
            user: user.emailId,
            pass: user.password
        }
    });


    let details = {
        from: `Team - WebDesys <${user.emailId}>`,
        to: receivers,
        subject: subject,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <title>${subject}</title>
            <style>
                body {
                 border: 1px solid #ccc;
                }
            </style>
</head>
<body>
    <div style="border: 2px solid gray; padding:1rem;">
        ${content}
    </div>
</body>
</html>

`
    }

    mailTransporter.sendMail(details, async (err) => {
        if (err) {
            res.status(400).json({ success: false, message: "Invalid Mail" });
            console.log(err)
        }
        else {
            /* create the mail model object */
            await Mail.create({ senderId, receivers, subject, content, });
            res.status(200).json({ success: true, message: "Mail Sent Successfully." });
        }
    })

}))


// fetch mails
router.get('/get-mails/:id', asyncError(async (req,res) => {
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
    if (!id) return res.status(400).json({ success: false, message: "Please provide valid params" });

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Params Id" });
    }

    user = await User.findById(id);
    if(!user){
        return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    switch(user.role){

        case "TL":
            let members = await User.distinct("_id", { creator: id });
            members.push(id);
            const results = await Mail.find({ senderId: { $in: members } }).populate({
                path: 'senderId',
                select: "name",
                strictPopulate: true,
            });;
            return res.status(200).json({ success: true, count: results.length,data: results});

        case "Member": 
            let data = await Mail.find({ senderId: id }).populate({
                path: 'senderId',
                select: "name",
                strictPopulate: true,
            });;
            return res.status(200).json({ success: true, count: data.length, data: data });

        case "Admin":
            const mails = await Mail.find()
            .populate({
                path: 'senderId',
                select: "name",
                strictPopulate: true,
            });
            return res.status(200).json({ success: true, count: mails.length, data: mails });

        default: 
            res.status(400).json({success:false, message: "Data not found"})
    }

}))


// delete mails
router.delete('/delete-mail/:id', asyncError(async (req,res) => {
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
    if (!id) return res.status(400).json({ success: false, message: "Please provide valid params" });

    if(id === "delete-all-mails"){
        await Mail.deleteMany();
        return res.status(200).json({ success: true, message: "All Mails Deleted Successfully" })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Params Id" });
    }

    const data = await Mail.findById(id);
    if (!data) {
        return res.status(400).json({ success: false, message: "Mail not found" })
    }

    await Mail.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Deleted Successfully." })
}))



module.exports = router;