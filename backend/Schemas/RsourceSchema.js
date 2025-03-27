const ResourceSchema = new Schema({
    title: String,
    description: String,
    category: { type: String, enum: ["video", "article", "PDF"] },
    url: String,
    created_at: { type: Date, default: Date.now },
    progress: { type: Number, min: 0, max: 100 },
    completed: { type: Boolean, default: false }
  });
  