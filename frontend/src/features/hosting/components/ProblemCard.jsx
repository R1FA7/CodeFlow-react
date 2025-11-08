import { PlusIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { GradientButton } from "../../common/components/gradientButton";

export const ProblemCard = ({ formData, setStep, addProblem }) => {
  const [currentProblem, setCurrentProblem] = useState({
    id: "",
    title: "",
    statement: "",
    testCases: [],
  });
  const inputFileRef = useRef(null);
  const outputFileRef = useRef(null);
  const handleProblemChange = (field, value) => {
    setCurrentProblem((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    console.log(currentProblem);
    if (
      !currentProblem.title.trim().length ||
      !currentProblem.statement.trim().length ||
      currentProblem.testCases.length < 1
    ) {
      toast(
        "Please provide problem title, statement and upload in both input and expected output file"
      );
      return;
    }
    console.log(currentProblem);
    addProblem(currentProblem);
    toast.success("Problem added");
    setCurrentProblem({
      title: "",
      statement: "",
      testCases: [],
    });
    if (inputFileRef.current) inputFileRef.current.value = "";
    if (outputFileRef.current) outputFileRef.current.value = "";
  };

  // const handleProblemChangePrev = (field, value) => {
  //   setFormData((prev) => {
  //     const updated = [...prev.problems];
  //     updated[currentProblemIndex] = {
  //       ...updated[currentProblemIndex],
  //       [field]: value,
  //     };
  //     return { ...prev, problems: updated };
  //   });
  // };
  // const addTestCase = () => {
  //   if (!currentTestCase.input || !currentTestCase.expectedOutput) {
  //     alert("Please fill in both input and expected output");
  //     return;
  //   }

  //   setFormData((prev) => {
  //     const updatedProblems = [...prev.problems];
  //     const problem = updatedProblems[currentProblemIndex];
  //     problem.testCases = [...problem.testCases, currentTestCase];
  //     return { ...prev, problems: updatedProblems };
  //   });
  //   setCurrentTestCase({ input: "", output: "" });
  // };

  const handleTestFile = (file, type) => {
    if (!file) {
      toast.error("NO FILE IS SELECTED");
      return;
    }

    file.text().then((content) => {
      const testCaseStrings = content
        .replace(/\r\n/g, "\n") // normalize Windows line breaks
        .split(/\n{2,}/)
        .map((str) => str.trim())
        .filter((str) => str.length > 0);

      setCurrentProblem((prev) => {
        const newTestCases = [...prev.testCases];
        testCaseStrings.forEach((str, index) => {
          if (!newTestCases[index]) {
            newTestCases[index] = { input: "", output: "" };
          }
          if (type === "input") {
            newTestCases[index].input = str;
          } else {
            newTestCases[index].output = str;
          }
        });
        console.log(newTestCases);
        return { ...prev, testCases: newTestCases };
      });
    });
  };

  // const removeTestCase = (index) => {
  //   setCurrentProblem((prev) => ({
  //     ...prev,
  //     testCases: prev.testCases.filter((_, i) => i !== index),
  //   }));
  // };
  return (
    <div className="space-y-6 relative">
      {/* {formData.problems.length > 1 && (
        <div
          className="absolute -left-5 bottom-1/2 translate-y-1/2 bg-black/40 p-3 rounded-md cursor-pointer"
          title="previous problem"
          onClick={() => setCurrentProblemIndex(currentProblemIndex - 1)}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </div>
      )}
      {formData.problems.length > 0 && (
        <div
          className="absolute -right-5 bottom-1/2 translate-y-1/2 bg-black/40 p-3 rounded-md cursor-pointer"
          title="next problem"
          onClick={() => setCurrentProblemIndex(currentProblemIndex + 1)}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </div>
      )} */}
      {/* Add New Problem Form */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Problem {String.fromCharCode(formData.problems.length + 65)}
          </h2>
          {formData.problems.length > -1 && (
            <GradientButton onClick={() => setStep(3)} className="p-3">
              Preview
            </GradientButton>
          )}
        </div>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Problem Title *
              </label>
              <input
                type="text"
                value={currentProblem.title}
                onChange={(e) => handleProblemChange("title", e.target.value)}
                placeholder="e.g., Two Sum Problem"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Problem Description *
              </label>
              <textarea
                value={currentProblem.statement}
                onChange={(e) =>
                  handleProblemChange("statement", e.target.value)
                }
                placeholder="Describe the problem statement..."
                rows={4}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Test Cases */}
          <div className="border-t border-slate-700 pt-6 relative">
            <p className="text-xs">
              *The inputs must be separated by 2 blank spaces in a text file.
            </p>
            <h3 className="text-sm font-semibold mb-2">
              Upload Test Cases *(input file then output file)
            </h3>

            <div className="flex flex-col xl:flex-row items-center space-y-2">
              <input
                ref={inputFileRef}
                type="file"
                onChange={(e) => handleTestFile(e.target.files[0], "input")}
                className="block w-full text-gray-400 text-sm file:border file:border-gray-300 file:rounded file:px-3 file:py-2 file:bg-white file:text-gray-700 file:cursor-pointer hover:file:bg-gray-100"
              />
              <input
                ref={outputFileRef}
                type="file"
                onChange={(e) => handleTestFile(e.target.files[0], "output")}
                className="block w-full text-gray-400 text-sm file:border file:border-gray-300 file:rounded file:px-3 file:py-2 file:bg-white file:text-gray-700 file:cursor-pointer hover:file:bg-gray-100"
              />
            </div>
            <button
              className="absolute w-15 h-15 rounded-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-indigo-900 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/80 hover:scale-105 flex items-center justify-center right-0 -bottom-3 z-50"
              onClick={() => handleNext()}
              aria-label="Add problem"
              title="Add problem"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <GradientButton onClick={() => setStep(1)} className="px-6 py-3">
              Back
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
};
