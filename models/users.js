const mongoose = require('mongoose')


const signupdetail = new mongoose.Schema({
    name: {
      type: String, 
      required: true,
    },
    email: {
      type: String, 
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
       password: {
        type: String, 
        required: true,
      },
      role: {
        type: String,
        default: "user"
      }
  });
  const userdetail = mongoose.model("userdetail", signupdetail);

  module.exports = userdetail