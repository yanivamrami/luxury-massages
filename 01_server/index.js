const express = require('express')
require('../00_db/mongoose.js') // Establishes the connection to the database
const cors = require('cors') // Allows our server to receive requests from clients on a different origins
const https = require('https');
const fs = require('fs');
// const dotenv = require('dotenv') 
// dotenv.config() // Makes environment variables available

// var privateKey  = fs.readFileSync('/etc/letsencrypt/live/luxury-massages.com/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/luxury-massages.com/fullchain.pem', 'utf8');
// var credentials = {key: privateKey, cert: certificate};

// Import mongoose models
const User = require('../00_db/models/user')
const Appointment = require('../00_db/models/appointment')
const Service = require('../00_db/models/service')
const Advertising = require('../00_db/models/advertising')
const Distributor = require('../00_db/models/distributor')
const Article = require('../00_db/models/articles')



// Import routes
const userRouter = require('./routes/user')
const appointmentRouter = require('./routes/appointment')
const serviceRouter = require('./routes/service')
const advertisingRouter = require('./routes/advertising')




// Initialize server
const app = express()
app.use(cors())
// app.use(express.static(process.cwd() + "/02_client/src/app/"));
app.use(express.static(process.cwd() + "/dist"));
app.use(express.json())

// var httpsServer = https.createServer(credentials, app);
const port = process.env.PORT || 3000

// Use routes
app.use(userRouter)
app.use(appointmentRouter)
app.use(serviceRouter)
app.use(advertisingRouter)


// serve angular front end files from root path
app.use('/', express.static(process.cwd() + "/dist"));

// rewrite virtual urls to angular app to enable refreshing of internal pages
app.get('*', function (req, res, next) {
    res.sendFile(process.cwd() + "/dist/index.html");
});

// Listening for incoming connections
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

// httpsServer.listen(port, () => {
//     console.log(`Listening on port ${port}`)
// })
