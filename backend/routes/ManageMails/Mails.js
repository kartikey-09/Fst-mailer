const express = require("express");
const router = express.Router();
const { asyncError } = require("../../middlewares/error");
const User = require("../../models/User");
const Mail = require("../../models/Mail");
// const Template = require("../../models/Templates")
const verifyToken = require("../../utils/verifyToken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
// const EmailTracking = require("../../models/EmailTracking")
// const { createObjectCsvWriter } = require("csv-writer");

// create mail
router.post(
  "/create-mail",
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

    let { senderId, receivers, subject, content, withCC } = req.body;

    if (!senderId || !receivers || !subject || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields." });
    }

    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Sender Id" });
    }

    user = await User.findById(senderId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found." });
    }

    // let mailTransporter = nodemailer.createTransport({
    //   host: "premium275.web-hosting.com",
    //   port: 465,
    //   service: "cPanel Webmail",
    //   auth: {
    //     user: user.emailId,
    //     pass: user.password,
    //   },
    // });

    let mailTransporter = nodemailer.createTransport({
      
      service: "gmail",
      host:"smtp.gmail.com",
      auth: {
        user: "webdesysdemo@gmail.com",
        pass: "jxdx olak hbda qsxk",
      },
    });

    // initially save the mail content in database, after that at last we save other informations.
    const createdMail = await Mail.create({
      senderId: senderId,
      subject: subject,
      content: content,
      receivers: receivers
    });

    // Initialize emailResults array to store responses
    let emailResults = [];
    let acceptedMailIds = [];
    let rejectedMailIds = [];

    // Split receivers into batches of 12 recipients
    const batchSize = 100;
    const batches = [];

    for (let i = 0; i < receivers.length; i += batchSize) {
      batches.push(receivers.slice(i, i + batchSize));
    }

    // Loop through batches with a 5-second delay
    // const delay = 1000*30; //  seconds in milliseconds
    const delay = 1000 * 1; //  seconds in milliseconds

    let batchNo = 1;
    for (const batch of batches) {
      // Set the recipient list for this batch
      // const details = {
      //   from: `Team - WebDesys <${user.emailId}>`,
      //   to: withCC && batch.join(", "),
      //   bcc: !withCC && batch.join(","),
      //   subject: subject,
      //   html: `
      //           <!DOCTYPE html>
      //           <html>
      //           <head>
      //           <meta charset="UTF-8">
      //           <title>${subject}</title>
      //           <style>
      //               body {
      //                border: 1px solid #ccc;
      //               }
      //           </style>
      //           </head>
      //           <body>
      //               <div style="border: 2px solid gray; padding:1rem;">
      //                   ${content}
      //               </div>
      //           </body>
      //           </html>
      //       `,
      // };
     
      const details = {
        from: `Team - WebDesys <webdesysdemo@gmail.com>`,
        to: withCC && batch.join(", "),
        bcc: !withCC && batch.join(","),
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
                    <img src="http://localhost:5000/api/track/track/abhishek14kl@gmail.com alt="Tracking Pixel" style="display: none;" />
                </body>
                </html>
            `,
           
      };

      // Send email batch
      await new Promise((resolve) => {
        setTimeout(async () => {
          try {
            // console.log(batch);
            const info = await mailTransporter.sendMail(details);

            // console.log(info);
            console.log("Accepted:", info.accepted);
            acceptedMailIds.push(...info.accepted);
            console.log("Rejected:", info.rejected);
            rejectedMailIds.push(...info.rejected);
            // Push successful result to emailResults
            
            emailResults.push({
              success: true,
              recipients: batch,
              message: "Email Sent Successfully",
              info: info,
              timestamp: new Date(),
            });
          } catch (err) {
            // Push error result to emailResults
            emailResults.push({
              success: false,
              recipients: batch,
              message: "Failed to send the email",
              error: err,
              timestamp: new Date(),
            });
          }

          batchNo += 1;
          console.log(`Batch No : ${batchNo}`);

          resolve();
        }, delay);
      });
    }

    // Update the existing document with additional fields
    const data = await Mail.findByIdAndUpdate(
      createdMail._id, // Use the ID of the created document
      {
        acceptedMailIds: acceptedMailIds,
        rejectedMailIds: rejectedMailIds,
      },
      {new:true}
    );
    console.log(data);

    // Send the response with email results
    res
      .status(200)
      .json({ success: true, message: "Mail Sent Successfully", emailResults });
  })
);

// fetch mails
router.get(
  "/get-mails/:id",
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
    
    // paramas
    const id = req.params.id;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Please provide valid params" });

    // query 
    const {pageNo, pageSize} = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Params Id" });
    }

    user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    let count;
    let data;
    switch (user.role) {
      case "TL":
        let members = await User.distinct("_id", { creator: id });
        members.push(id);
        count = await Mail.count({ senderId: { $in: members } });
        data = await Mail.find({ senderId: { $in: members } })
          .sort({ createdAt: -1 })
          .skip((pageNo-1)*pageSize)
          .limit(pageSize)
          .populate({
            path: "senderId",
            select: "name",
            strictPopulate: true,
          })
          .populate("receivers");
        return res
          .status(200)
          .json({ success: true, data: data, totalCount:count, resultCount:data?data.length:0 });

      case "Member":
        count = await Mail.count({senderId: id});
        data = await Mail.find({ senderId: id })
          .sort({ createdAt: -1 })
          .skip((pageNo-1)*pageSize)
          .limit(pageSize)
          .populate({
            path: "senderId",
            select: "name",
            strictPopulate: true,
          });
        return res
          .status(200)
          .json({ success: true, data: data, totalCount:count, resultCount:data?data.length:0 });

      case "Admin":
        count = await Mail.count({senderId: id});
        data = await Mail.find().sort({ createdAt: -1 }).skip((pageNo-1)*pageSize)
        .limit(pageSize).populate({
          path: "senderId",
          select: "name",
          strictPopulate: true,
        })
        .populate("receivers");
        console.log("data" , data)
        return res
          .status(200)
          .json({ success: true, data: data, totalCount:count, resultCount:data?data.length:0 });

      default:
        res.status(400).json({ success: false, message: "Data not found" });
    }
  })
);

// delete mails
router.delete(
  "/delete-mail/:id",
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

    if (id === "delete-all-mails") {
      await Mail.deleteMany();
      return res
        .status(200)
        .json({ success: true, message: "All Mails Deleted Successfully" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Params Id" });
    }

    const data = await Mail.findById(id);
    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "Mail not found" });
    }

    await Mail.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Deleted Successfully." });
  })
);

router.get(
  "/downloadCSV/:dbId", asyncError(async(req,res)=>{
    const id = req.params.dbId;

    // Fetch the data from the database (assuming you have the 'Mail' model)
    const data = await Mail.findById(id)
      .select('+receivers +acceptedMailIds +rejectedMailIds')
      .exec();
  
    if (!data) return res.status(400).json({ success: false, message: "No data found." });
  
    return res.status(200).json({success:true, data});

    // const csvWriter = createObjectCsvWriter({
    //   path: "output.csv",
    //   header: [
    //     { id: "receivers", title: "Receivers" },
    //     { id: "acceptedMailIds", title: "Accepted Mails" },
    //     { id: "rejectedMailIds", title: "Rejected Mails" },
    //   ],
    // });
     
    // const records = [
    //   {
    //     receivers: data.receivers.join(", "),
    //     acceptedMailIds: data.acceptedMailIds.join(", "),
    //     rejectedMailIds: data.rejectedMailIds.join(", "),
    //   },
    // ];
  
    // csvWriter.writeRecords(records).then(() => {
    //   const file = `${__dirname}/output.csv`;
    //   res.download(file, "data.csv", (err) => {
    //     if (err) {
    //       console.error("Error sending file:", err);
    //       res.status(500).send("Error sending file");
    //     } else {
    //       fs.unlinkSync(file); // Delete the temporary CSV file after sending
    //     }
    //   });
    // });
  })
)



// Get templates based on subject keyword


module.exports = router;
