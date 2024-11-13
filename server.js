require('dotenv').config();
const { app } = require('./app');
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;


mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connection) => {
    console.log(`Server connected with MongoDB: ${connection.connection.name}`);
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  });


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME , 
    api_key: process.env.CLOUD_API_KEY , 
    api_secret: process.env.CLOUD_SECRET ,
  });
  
  // Test Cloudinary configuration
  cloudinary.api.ping((error, result) => {
    if (error) {
      console.error('Cloudinary configuration error:', error);
    } else {
      console.log('Cloudinary configuration successful:', result);
    }
  });
  
  // Create and start the server
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });

