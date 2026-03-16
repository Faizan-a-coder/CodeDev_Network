import { useContext, useEffect, useState } from "react";
import { fetchOneProblemAPI } from "../../api/problem.api";
import { Context } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import "./ProblemDetails.css";
import { createSubmission } from "../../api/submission.api";
import Spinner from "../../components/Spinner/Spinner.jsx";
import runCode from "../../api/codeRunner.api.js";


export default function ProblemDetails() {
  //fetching url from context api
  const { url, token } = useContext(Context);

  //use params hook to extract slug from the url
  const { slug } = useParams();
  //state variable to store the problem detail
  const [problemDetail, setProblemDetail] = useState({});

  //state variables for code editor
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(`class Solution {\n\n}`);

  //state variable for loader
  const [loading, setLoading] = useState(true);

  //state variables for storing the status of code and result of the code 
  const [verdict, setVerdict] = useState(null);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);


  const [showResult, setShowResult] = useState(false);

  //function to call the problem details api
  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchOneProblemAPI(url, slug);
      setProblemDetail(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const boilerplates = {
    java: `import java.util.*;\nclass Main {\n    public static void main(String[] args) {\n\n    }\n}`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\n}`,
    python: `def solve():\n    pass`,
  };

  //useEffect to re-render after language change
  useEffect(() => {
    setCode(boilerplates[language]);
  }, [language]);

  //useEffect to re-render when new problem is requested
  useEffect(() => {
    fetchProblemDetails();
  }, [slug]);

  //submit button handler
  const submitHandler = async () => {
    try {
      setRunning(true);

      const payload = {
        problemId: problemDetail._id,
        code,
        language
      };

      const response = await createSubmission(url, payload, token);

      setVerdict(response.verdict);
      setOutput(`Execution Time: ${response.executionTime}s`);

    } catch (error) {
      console.error(error);
      setVerdict("Error");
      setOutput("Something went wrong");
    } finally {
      setRunning(false);
    }
  };

  //handler to call the codeRunner function to only run the code
  const runHandler = async () => {
    try {
      setRunning(true);

      const payload = {
        problemId: problemDetail._id,
        code,
        language
      };

      const response = await runCode(url, payload, token);

      setVerdict(response.verdict);
      setOutput(`Execution Time: ${response.executionTime}s`);

    } catch (error) {
      console.error(error);
      setVerdict("Error");
      setOutput("Something went wrong");
    } finally {
      setRunning(false);
    }
  };


  // Spinner
  if (loading) {
    return <Spinner fullPage />;
  }

  return (
    <div className="problem-details">
      {/* Left */}
      <div className="problem-left">
        <h1>{problemDetail.title}</h1>
        <p>{problemDetail.description}</p>

        {problemDetail?.testCases?.map((test, index) => (
          <div className="testCase" key={index}>
            <h2>Input: {test.input}</h2>
            <p>Output: {test.output}</p>
          </div>
        ))}

        <span>Topic Tags:</span>
        {problemDetail?.tags?.map((tag, index) => (
          <span className="tag" key={index}>{tag}</span>
        ))}

        <div className="constraints">
          Constraints: {problemDetail.constraints}
        </div>
      </div>

      {/* Right */}
      <div className="problem-right">
        <div className="toolbar">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <div className="run-submit-buttons">
            <button
              className="run-btn"
              onClick={() => {
                setShowResult(true);
                runHandler();
              }}
            >
              Run
            </button>

            <button
              className="submit-btn"
              onClick={() => {
                setShowResult(true);
                submitHandler();
              }}
            >
              Submit
            </button>
          </div>
        </div>
        <CodeEditor language={language} code={code} setCode={setCode} />

        {/* Execution Panel */}
        {showResult && (
          <div className="execution-panel">
            <div className="execution-header">
              <span>Execution Result</span>

              <button
                className="close-result"
                onClick={() => setShowResult(false)}
              >
                Close
              </button>
            </div>

            <div className="execution-result">
              {running && <p>Running...</p>}

              {verdict && !running && (
                <>
                  <h3>Verdict: {verdict}</h3>
                  <pre>{output}</pre>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
