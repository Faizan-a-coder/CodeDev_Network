import Problem from "../models/Problem.js";
import { languageMap } from "../config/languages.js";
import axios from "axios";
import { JUDGE0_URL } from "../config/judgeUrl.js";


const normalize = (str) => {
  return (str || "").trim().replace(/\s+/g, " ");
};

const codeRunner = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

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

    const sampleTestcases = problem.testCases.filter(tc => tc.isSample);

    let outputs = [];
    let executionTime = 0;
    let overallVerdict = "AC";

    for (const testcase of sampleTestcases) {
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

      let testcaseStatus = "Passed";

      // Compilation Error
      if (statusId === 6) {
        testcaseStatus = "CE";
        overallVerdict = "CE";
      }

      // Time Limit Exceeded
      else if (statusId === 5) {
        testcaseStatus = "TLE";
        overallVerdict = "TLE";
      }

      // Runtime Errors
      else if (statusId >= 7 && statusId <= 12) {
        testcaseStatus = "RE";
        overallVerdict = "RE";
      }

      // Successful execution → compare output
      else if (statusId === 3) {
        if (actualOutput !== expectedOutput) {
          testcaseStatus = "Failed";
          overallVerdict = "WA";
        }
      }

      // Unknown case
      else {
        testcaseStatus = "Error";
        overallVerdict = "RE";
      }

      outputs.push({
        input: testcase.input,
        expectedOutput,
        actualOutput,
        status: testcaseStatus,
        executionTime: result.time || 0,
        memoryUsed: result.memory || 0
      });

      // Stop early on serious errors (optional but better UX)
      if (overallVerdict !== "AC") break;
    }

    return res.status(200).json({
      success: true,
      verdict: overallVerdict,
      executionTime,
      output: outputs
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export default codeRunner;




// import java.util.*;
// class Main {
//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);
//         int a = sc.nextInt();
//         int b= sc.nextInt();
//         System.out.println(a+b);
//     }
// }
    