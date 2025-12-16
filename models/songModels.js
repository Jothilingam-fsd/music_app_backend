import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    artist: {
      type: String,
      required: true,
      trim: true
    },

    album: {
      type: String,
      trim: true
    },

    movie: {
      type: String,
      trim: true
    },

    genre: {
      type: String,
      trim: true,
      index: true // search fast
    },

    duration: {
      type: Number, // seconds
      min: 1
    },

    audioUrl: {
      type: String,
      required: true
    },

    imageUrl: {
      type: String
    },

    cloudinaryPublicId: {
      type: String // delete/update purpose
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        text: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    playCount: {
      type: Number,
      default: 0
    },

    downloads: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

export default mongoose.model("Song", songSchema);
