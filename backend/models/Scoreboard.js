import mongoose from "mongoose";

const { Schema } = mongoose;

const ScoreboardSchema = new Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    totalScore: {
      type: Number,
      default: 0,
    },

    totalPenalty: {
      type: Number,
      default: 0,
    },
    problems: [
      {
        problemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Problem",
        },
        score: {
          type: Number,
          default: 0,
        },
        attempts: {
          type: Number,
          default: 0,
        },
        isSolved: {
          type: Boolean,
          default: false,
        },
        penalty: {
          type: Number,
          default: 0,
        },
        lastSubmissionTime: {
          type: Number, // seconds from contest start
        },
      },
    ]
  },
  { timestamps: true },
);

ScoreboardSchema.index({ contestId: 1, totalScore: -1, totalPenalty: 1 });
ScoreboardSchema.index({ contestId: 1, userId: 1 }, { unique: true });

const Scoreboard = mongoose.model("Scoreboard",ScoreboardSchema);

export default Scoreboard;