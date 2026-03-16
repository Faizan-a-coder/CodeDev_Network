import Problem from "../models/Problem.js";
import { mapJudge0Verdict } from "../config/verdictMapper.js";
import { languageMap } from "../config/languages.js";
import axios from "axios";
import { JUDGE0_URL } from "../config/judgeUrl.js";


const codeRunner = async (req, res) => {
  try {

    const { problemId, code, language } = req.body;

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    const language_id = languageMap[language];

    const sampleTestcases = problem.testCases.filter(tc => tc.isSample);

    let outputs = [];
    let executionTime = 0;
    let verdict = "AC";

    for (const testcase of sampleTestcases) {

      const judgeResponse = await axios.post(
        JUDGE0_URL,
        {
          source_code: code,
          language_id,
          stdin: testcase.input,
          cpu_time_limit: problem.timeLimit,
          memory_limit: problem.memoryLimit
        }
      );

      const result = judgeResponse.data;

      executionTime = Math.max(executionTime, result.time || 0);

      const actualOutput = (result.stdout || "").trim();
      const expectedOutput = testcase.output.trim();

      let testcaseStatus = "Passed";

      if (result.status.description !== "Accepted") {
        testcaseStatus = mapJudge0Verdict(result.status.description);
        verdict = testcaseStatus;
      } else if (actualOutput !== expectedOutput) {
        testcaseStatus = "Failed";
        verdict = "WA";
      }

      outputs.push({
        input: testcase.input,
        expected: expectedOutput,
        actual: actualOutput,
        status: testcaseStatus
      });

      if (verdict !== "AC") break;
    }

    res.json({
      success: true,
      verdict,
      executionTime,
      outputs
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export default codeRunner;




// Scanner sc = new Scanner(System.in);
//         int a = sc.nextInt();
//         int b= sc.nextInt();
//         System.out.println(a+b);
    