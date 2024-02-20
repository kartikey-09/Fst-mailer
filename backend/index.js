const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./utils/connectDB');

// importing routes

const Mails = require('./routes/ManageMails/Mails')
const Users = require('./routes/Users/Users')
const Contacts = require('./routes/Contacts/Contacts')
const Templates = require('./routes/Templates/templates')
const Tracking = require('./routes/Tracking/Tracking')
//  Initializing app
const app = express();

// using middlewares
dotenv.config();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

// Default Get Request
app.get('/', async (req, res) => {
    res.send("Global Mailer")
})

// Main Routes

// mails route
app.use('/api/mails', Mails)
//template routes
app.use('/api/templates', Templates)
// users
app.use('/api/users', Users)
//Contacts
app.use('/api/contacts', Contacts)
//track
app.use('/api/track' , Tracking)

// APP LISTENING AND DB
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server running on port:", PORT)
    })
})

