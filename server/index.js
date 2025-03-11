const express = require ('express')
const mongoose = require ('mongoose')
const cors = require ('cors')

const app = express()
require("dotenv").config();

const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())

const URL = process.env.MONGODB_URL;

// Connect to MongoDB using the environment variable
mongoose.connect(URL, {
    //useNewUrlParser: true, 
    //useUnifiedTopology: true,    
})

.then(() => console.log("MongoDB connection success"))
.catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please choose another port.`);
        process.exit(1);
    }
});