export const mapJudge0Verdict = (status) => {
  const verdictMap = {
    "Accepted": "AC",
    "Wrong Answer": "WA",
    "Compilation Error": "CE",
    "Time Limit Exceeded": "TLE",

    // Runtime errors
    "Runtime Error (NZEC)": "RE",
    "Runtime Error (SIGSEGV)": "RE",
    "Runtime Error (SIGABRT)": "RE",
    "Runtime Error (SIGFPE)": "RE",
    "Runtime Error (SIGKILL)": "RE",

    // other possible judge states
    "Memory Limit Exceeded": "RE",
    "Internal Error": "RE"
  };

  return verdictMap[status] || "RE";
};