const ClassSchema = new Schema({
    title: String,
    description: String,
    instructor_id: { type: ObjectId, ref: "User" },
    price: Number,
    duration: String,
    schedule: Date,
    maxSpots: Number,
    bookedSpots: Number,
    category: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Solo Jazz"] }, // 💡 New field
    created_at: { type: Date, default: Date.now }
  });
  