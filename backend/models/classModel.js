const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    instructor: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'],  default: 'Beginner',},
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    startDate: { type: Date, required: true },
    recurringTime: { type: String, required: true },
    maxSpots: { type: Number, required: true },
    sessions: [
      {
        sessionDate: { type: Date, required: true },
        bookedSpots: { type: Number, default: 0 }, 
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
