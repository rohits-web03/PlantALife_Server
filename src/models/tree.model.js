import { Schema, model } from "mongoose";

const treeSchema = new Schema(
  {
    plantedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    location: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        latitude: {
          type: Number,
          required: true
        },
        longitude: {
          type: Number,
          required: true
        }
      },
      required: true
    },
    plantSpecies: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    treeImages: [{
      type: String, //cloudinary link
      required: true
    }]
  },
  { timestamps: true }
);

export const Tree = model("Tree", treeSchema);
