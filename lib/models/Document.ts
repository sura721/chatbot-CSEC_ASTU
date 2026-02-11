// src/lib/models/Document.ts
import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    // This is the "Vector" - an array of numbers representing the text
    embedding: {
      type: [Number], 
      required: true,
    },
    metadata: {
      fileName: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

// Prevent recompilation of model if it already exists
export const DocumentModel =
  mongoose.models.Document || mongoose.model("Document", DocumentSchema);