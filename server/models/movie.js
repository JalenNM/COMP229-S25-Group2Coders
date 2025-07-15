import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    releaseYear: {
      type: Number,
      min: 1888, // first known film year
      max: new Date().getFullYear() + 1,
    },
    genre: {
      type: String,
      trim: true,
    },
    director: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    posterUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Movie', movieSchema);