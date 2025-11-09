import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProblem } from "../../../api/problems";
import { submitProblem } from "../../../api/submission";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { GradientButton } from "../../common/components/GradientButton";
import { LoadingSpinner } from "../../common/components/LoadingSpinner";
import { Editor } from "../components/Editor";
import { TestCaseCard } from "../components/TestCaseCard";

export const ProblemPage = () => {
  const { problemId } = useParams();
  const [code, setCode] = useState("//Write your code here...\n\n\n\n\n");
  const [language, setLanguage] = useState("cpp");
  const { data: user } = useCurrentUser();

  const { data: problem, isLoading } = useQuery({
    queryKey: ["problem", problemId],
    queryFn: () => getProblem(problemId),
    enabled: !!problemId,
  });
  console.log(problemId);
  if (isLoading) <LoadingSpinner />;

  const { mutate: mutateSubmitProblem, isPending } = useMutation({
    mutationFn: submitProblem,
    onSuccess: (data) => {
      toast.success(data?.message);
      console.log(data);
    },
    onError: (error) => {
      if (error.errors?.length) {
        error.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleSubmit = () => {
    if (!user) {
      toast.error("Please login to submit");
      return;
    }
    console.log("Submitting code:", code, language, problemId);
    if (!problemId || !code.trim()) return;
    mutateSubmitProblem({
      code,
      language,
      problemId,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 text-center">
        <h1 className="text-xl font-bold text-gray-100">{problem?.title}</h1>
      </div>
      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 min-h-0">
        {/* Left Panel - Problem Description */}
        <div className=" border-r border-slate-700 flex flex-col bg-slate-850 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 text-gray-300 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Problem Statement
              </h2>
              <p className="leading-relaxed text-gray-300">
                {problem?.statement || "Loading..."}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Test Cases
              </h2>
              <div className="space-y-4">
                {problem?.testCases?.map((tc, idx) => (
                  <TestCaseCard
                    key={idx}
                    idx={idx}
                    input={tc?.input}
                    output={tc?.output}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex flex-col bg-slate-900 min-h-0">
          {/* Language Selector */}
          <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-700 text-gray-200 px-4 py-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="js">JavaScript</option>
              <option value="py">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <button
              onClick={() => setCode("// Write your code here...\n\n")}
              className="text-gray-400 hover:text-gray-200 text-sm px-3 py-1 rounded hover:bg-slate-700 transition-colors"
            >
              Reset Code
            </button>
          </div>

          {/* Editor (scrollable area) */}
          <div className="flex-1 overflow-y-auto p-4">
            <Editor code={code} language={language} setCode={setCode} />
          </div>

          {/* Action Bar */}
          <div className="bg-slate-800 border-t border-slate-700 px-4 py-3 flex">
            <GradientButton
              className="px-5 py-2 flex-1"
              onClick={handleSubmit}
              loading={isPending}
            >
              Submit
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
};
