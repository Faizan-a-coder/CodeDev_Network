import Problem from "../models/Problem.js";
import User from "../models/User.js";
import Contest from "../models/Contest.js";
import ContestSubmission from "../models/ContestSubmission.js";
import Scoreboard from "../models/Scoreboard.js";

const createContest = async (req, res) => {
  try {
    const { title, slug, problems, startTime, endTime, participants } =
      req.body;

    //checking if any field is missing
    if (
      !title ||
      !slug ||
      !Array.isArray(problems) ||
      problems.length === 0 ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //checking if the start time is lesser then end time or not
    if (new Date(endTime) <= new Date(startTime)) {
      console.log("End time must be after start time");
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
      console.log("Invalid problems format");
      return res.status(400).json({
        success: false,
        message: "Invalid problems format",
      });
    }

    //checking if contest already exists
    const existingContest = await Contest.findOne({ slug });
    if (existingContest) {
      console.log("Contest already exists");
      return res.status(400).json({
        success: false,
        message: "Contest already exists",
      });
    }

    //checking if all provided problemIds exist in the db
    const problemIds = problems.map((p) => p.problemId);
    const existingProblems = await Problem.find({ _id: { $in: problemIds } });

    if (existingProblems.length !== problemIds.length) {
      console.log("One or more problems do not exist in the database");
      return res.status(404).json({
        success: false,
        message: "One or more problems do not exist in the database",
      });
    }

    //creating new contest document
    const newContest = await Contest.create({
      title,
      slug,
      problems,
      status: "upcoming",
      startTime,
      endTime,
      participants,
      createdBy: req.user.id,
    });

    console.log("Contest created");
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
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Contest not found",
      });
    }

    const contest = await Contest.findOne({ slug })
      .populate("createdBy", "username")
      .populate({
        path: "problems.problemId",
        select: "title slug",
      });

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    return res.status(200).json({
      success: true,
      contest,
    });
  } catch (err) {
    console.log(`An error occured while getting contest: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const joinContest = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Contest slug is required",
      });
    }

    const updatedContest = await Contest.findOneAndUpdate(
      { slug },
      {
        $addToSet: { participants: userId }, // prevents duplicates
      },
      { new: true },
    );

    if (!updatedContest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully joined the contest",
    });
  } catch (error) {
    console.error("Join Contest Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getContestProblems = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Contest not found",
      });
    }

    const contest = await Contest.findOne({ slug }).populate({
      path: "problems.problemId",
      select: "title slug",
    });

    if(!contest){
      return res.status(404).json({
        success:false,
        message:"Contest not found"
      })
    }

    //Checking if user joined
    if (!contest.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You have not joined this contest",
      });
    }

    const now = new Date();

    //Contest not started
    if (now < contest.startTime) {
      return res.status(403).json({
        success: false,
        message: "Contest has not started yet",
      });
    }

    // Storing the only required fields to send
    const problems = contest.problems.map((p) => ({
      _id: p.problemId._id,
      title: p.problemId.title,
      slug: p.problemId.slug,
    }));



    return res.status(200).json({
      success: true,
      message: "Contest problems",
      problems
    });

  } catch (err) {
    console.log(`Error in getting any contest problem, ${err.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export { createContest, getContest, joinContest, getContestProblems };
