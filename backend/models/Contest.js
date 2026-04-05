import mongoose from "mongoose";

const { Schema } = mongoose;

const ContestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    problems: [
      {
        problemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Problem",
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
        points: {
          type: Number,
          required: true,
        },
      },
    ],
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
      index: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "running", "ended"],
      default: "upcoming",
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//for unique contests
ContestSchema.index({ title: 1, startTime: 1 }, { unique: true });

const Contest = mongoose.model("Contest", ContestSchema);

export default Contest;
