const BookingSchema = new Schema({
    user_id: { type: ObjectId, ref: "User" },
    class_id: { type: ObjectId, ref: "Class" },
    date: Date,
    status: { type: String, enum: ["pending", "confirmed", "cancelled"] },
    paymentStatus: { type: String, enum: ["paid", "unpaid"] },
    price: Number,
    created_at: { type: Date, default: Date.now }
  });