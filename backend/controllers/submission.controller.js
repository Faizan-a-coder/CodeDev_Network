import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';
import axios from 'axios';
import { languageMap } from '../config/languages.js';
import { JUDGE0_URL } from '../config/judgeUrl.js';


const normalize = (str) => {
  return (str || "").trim().replace(/\s+/g, " ");
};

const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user.id;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: "Missing fields"
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    const language_id = languageMap[language];

    if (!language_id) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language"
      });
    }

    let verdict = "AC";
    let executionTime = 0;
    const outputs = [];

    for (const testcase of problem.testCases) {
      const judgeResponse = await axios.post(
        JUDGE0_URL,
        {
          source_code: code,
          language_id,
          stdin: testcase.input,
          cpu_time_limit: problem.timeLimit,
          memory_limit: problem.memoryLimit
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      const result = judgeResponse.data;
      const statusId = result?.status?.id;

      executionTime = Math.max(
        executionTime,
        parseFloat(result?.time) || 0
      );

      const actualOutput = normalize(result.stdout);
      const expectedOutput = normalize(testcase.output);

      let testcaseStatus = "Accepted";

      // CE
      if (statusId === 6) {
        testcaseStatus = "CE";
        verdict = "CE";
      }
      // TLE
      else if (statusId === 5) {
        testcaseStatus = "TLE";
        verdict = "TLE";
      }
      // RE
      else if (statusId >= 7 && statusId <= 12) {
        testcaseStatus = "RE";
        verdict = "RE";
      }
      // Successful execution → compare
      else if (statusId === 3) {
        if (actualOutput !== expectedOutput) {
          testcaseStatus = "Wrong Answer";
          verdict = "WA";
        }
      }
      // Unknown
      else {
        testcaseStatus = "Error";
        verdict = "RE";
      }

      //PUSH RESULT (YOU MISSED THIS)
      outputs.push({
        input: testcase.input,
        expectedOutput,
        actualOutput,
        status: testcaseStatus,
        executionTime: result.time || 0,
        memoryUsed: result.memory || 0
      });

      // stop early if failed
      if (verdict !== "AC") break;
    }

    const newSubmission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      verdict,
      executionTime
    });

    //RETURN OUTPUT (YOU MISSED THIS TOO)
    return res.status(201).json({
      success: true,
      verdict,
      executionTime,
      output: outputs,
      submission: newSubmission
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id }).sort({ createdAt: -1 }).select("-code");


    res.status(200).json({
      success: true,
      message: "submissions found",
      count: submissions.length,
      data: submissions
    });

  } catch (err) {
    console.log(`An error occured ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

const getOneSubmission = async (req, res) => {
  try {
    const submissionId = req.params.id;

    const submission = await Submission.findById(submissionId);

    //checking if submission exists or not
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    //sending the submission if the logedIn user is admin
    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        message: "Submissions found",
        data: submission
      });
    }

    if (submission.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    res.status(200).json({
      success: true,
      message: "Submission found",
      data: submission
    });
  } catch (err) {
    console.log(`An error occured ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

const getAllSubmissionsOfaProblem = async (req, res) => {
  try {
    const slug = req.params.slug;

    //finding the problem with given slug
    const problem = await Problem.findOne({ slug });

    //checking if problem with given slug exists or not
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    //finding the submissions attached with the problem
    const submission = await Submission.find({ problemId: problem._id, userId: req.user.id }).sort({ createdAt: -1 }).select("-code");

    //checking if submission exists or not
    if (submission.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });
    }

    //seding response
    res.status(200).json({
      success: true,
      message: "Submission found",
      data: submission
    });

  } catch (err) {
    console.log(`An error occured ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export { createSubmission, getOneSubmission, getSubmissions, getAllSubmissionsOfaProblem };