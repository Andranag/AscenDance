const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    profileImage: { type: String },
    phone: { type: String },
    location: { type: String },
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
  }, { timestamps: true });
  