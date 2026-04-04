import Problem from "../models/Problem.js";
import User from "../models/User.js";
import Contest from "../models/Contest.js";
import ContestSubmission from "../models/ContestSubmission.js";
import Scoreboard from "../models/Scoreboard.js";

const createContest = async (req, res) => {
  try {
    const { title, problems, startTime, endTime, participants } = req.body;

    //checking if any field is missing
    if (
      !title ||
      !Array.isArray(problems) ||
      problems.length === 0 ||
      !startTime ||
      !endTime ||
      !Array.isArray(participants) ||
      participants.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //checking if the starttime is lesser then end time or not
    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    //checking for problem validity
    const isValidProblems = problems.every(
      (p) => p.problemId && p.order !== undefined && p.points !== undefined,
    );

    if (!isValidProblems) {
      return res.status(400).json({
        success: false,
        message: "Invalid problems format",
      });
    }

    //creating new contest document
    const newContest = await Contest.create({
      title,
      problems,
      status: "upcoming",
      startTime,
      endTime,
      participants,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Contest created",
      title: newContest.title,
      status: newContest.status,
      contestId: newContest._id,
    });
  } catch (err) {
    console.log(`An error occured while creating contest: ${err.message}`);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Contest already exists",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getContest = async (req, res) => {
  console.log("got the contest");
};

const joinContest = async (req, res) => {
  console.log("Joined the contest");
};

const getContestProblems = async (req, res) => {
  console.log("Problems of the contest");
};

export { createContest, getContest, joinContest, getContestProblems };
