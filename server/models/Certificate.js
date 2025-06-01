import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  certificateData: {
    type: Buffer,
    contentType: String
  },
  status: {
    type: String,
    enum: ['issued', 'revoked'],
    default: 'issued'
  }
}, {
  timestamps: true
});

// Method to generate a unique certificate ID
const generateCertificateId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `CERT-${timestamp}-${random}`;
};

// Add static method to generate certificate ID
certificateSchema.statics.generateCertificateId = generateCertificateId;

export default mongoose.model('Certificate', certificateSchema);
