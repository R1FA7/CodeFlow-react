import { Schema, SchemaTypes, model } from "mongoose";
const codeShareSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  author: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  language: {
    type: String, 
    enum: ['java','cpp','py', 'js'],
    default:'cpp'
  },
  code: {
    type: String,
    required: true,
  }
}, {timestamps: true})

export default model('CodeShare', codeShareSchema)