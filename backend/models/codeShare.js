import mongoose from 'mongoose';

const codeShareSchema = new mongoose.Schema({
  shareId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  stdin: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous sharing
  },
  views: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

export default mongoose.model('CodeShare', codeShareSchema);