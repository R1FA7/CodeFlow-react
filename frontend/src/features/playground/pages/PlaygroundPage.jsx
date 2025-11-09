import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSharedCode, storeCode } from "../../../api/codeShare";
import { runPlaygroundCode } from "../../../api/submission";
import { GradientButton } from "../../common/components/GradientButton";
import { Editor } from "../../problemSet/components/Editor";

import { useNavigate, useParams } from "react-router-dom";

export const PlaygroundPage = () => {
  const navigate = useNavigate();
  const { shareId } = useParams(); // For /share/:shareId route

  const defaultCode = {
    javascript: "// JavaScript example\nconsole.log('Hello from Playground');",
    py: "# Python example\nprint('Hello from Playground')",
    java: '// Java example\nclass Main { public static void main(String[] args){ System.out.println("Hello from Playground"); }}',
    cpp: '// C++ example\n#include <bits/stdc++.h>\nusing namespace std;\nint main(){ cout << "Hello from Playground"; }',
  };

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(defaultCode.cpp);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");

  // Load shared code from backend if shareId exists
  useEffect(() => {
    if (shareId) {
      getSharedCode(shareId)
        .then((response) => {
          console.log("Shared code response:", response);
          const data = response?.data;
          if (data) {
            const show = `// Author:${data.author.username}\n// Email:${data.author.email}\n${data.code}`;
            setCode(show);
            setLanguage(data.language);
            setStdin(data.stdin || "");
          }
        })
        .catch((err) => {
          console.error("Error loading shared code:", err);
          toast.error("Shared code not found");
          navigate("/playground");
        });
    }
  }, [shareId, navigate]);

  // Run code mutation
  const { mutate: mutateRunPlaygroundCode, isPending: isRunning } = useMutation(
    {
      mutationKey: ["playground"],
      mutationFn: ({ code, language, stdin }) =>
        runPlaygroundCode({ code, language, stdin }),
      onMutate: () => {
        setOutput("");
      },
      onSuccess: (apiResponse) => {
        const data = apiResponse?.data || {};
        const message = apiResponse?.message || "";
        console.log(apiResponse);

        const compileStderr = data.compileStderr || "";
        const stderr = data.stderr || "";
        const stdout = data.stdout || "";

        let combined = "";
        if (compileStderr) combined += `Compilation:\n${compileStderr}\n\n`;
        if (stderr) combined += `Errors:\n${stderr}\n\n`;
        combined += stdout || "";

        setOutput(combined || "// (no output)");
        toast.success(message || "Run finished");
      },
      onError: (err) => {
        const msg = err?.message || "Run failed";
        const resp = err?.response;
        console.log(err);
        if (resp?.data) {
          const data = resp.data;
          const compileStderr = data.compileStderr || "";
          const stderr = data.stderr || "";
          const stdout = data.stdout || "";

          let combined = "";
          if (compileStderr) combined += `Compilation:\n${compileStderr}\n\n`;
          if (stderr) combined += `Errors:\n${stderr}\n\n`;
          combined += stdout || "";

          setOutput(combined || msg);
        } else {
          setOutput(msg);
        }
        toast.error(msg);
      },
    }
  );

  //Share code mutation
  const { mutate: mutateStoreCode, isPending: isSharing } = useMutation({
    mutationKey: ["storeCode"],
    mutationFn: ({ code, language, stdin, description }) =>
      storeCode({ code, language, stdin, description }),
    onSuccess: (apiResponse) => {
      console.log("Share API Response:", apiResponse);

      const responseData = apiResponse?.data;
      const newShareId = responseData?.shareId;

      console.log("ShareId received:", newShareId);

      if (newShareId) {
        const url = `${window.location.origin}/playground/share/${newShareId}`;
        navigator.clipboard.writeText(url);
        toast.success("Share link copied to clipboard");
      }
    },
    onError: (err) => {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create share link";
      toast.error(errorMessage);
    },
  });

  const handleRun = () => {
    setOutput("");
    console.log(language);
    mutateRunPlaygroundCode({ code, language, stdin });
  };

  const handleReset = () => {
    setCode(defaultCode[language] || "");
    setStdin("");
    setOutput("");
    // Clear URL if viewing shared code
    if (shareId) {
      navigate("/playground");
    }
  };

  const handleShare = () => {
    if (!code || code.trim() === "") {
      toast.error("Cannot share empty code!");
      return;
    }

    mutateStoreCode({
      code,
      language,
      stdin,
      description: `${language} playground code`,
    });
  };

  return (
    <div className="min-h-screen text-gray-200 flex flex-col ml-5 p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
        Code Playground
        {shareId && (
          <span className="text-sm text-gray-400 ml-2">(Shared Code)</span>
        )}
      </h1>

      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => {
              const newLang = e.target.value;
              setLanguage(newLang);
              if (!code || Object.values(defaultCode).includes(code)) {
                setCode(defaultCode[newLang] || "");
              }
            }}
            className="bg-slate-800 text-gray-200 px-3 py-1 rounded border border-slate-700"
          >
            <option value="javascript">JavaScript</option>
            <option value="py">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <GradientButton onClick={handleReset} className="px-3 py-1">
            Reset
          </GradientButton>
        </div>

        <div className="flex items-center gap-2">
          <GradientButton
            onClick={handleShare}
            className="px-3 py-1"
            disabled={isSharing}
            loading={isSharing}
          >
            Share
          </GradientButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col bg-slate-800 rounded shadow-sm min-h-0 overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">
            <div className="text-sm text-gray-300">Editor — {language}</div>
            <div className="text-xs text-gray-400">
              {isRunning ? "Running..." : "Idle"}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor code={code} language={language} setCode={setCode} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-slate-800 rounded p-4 border border-slate-700 flex-1 flex flex-col">
            <label className="text-sm text-gray-300 mb-2">Input</label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Type program input here..."
              className="w-full flex-1 resize-none bg-slate-900 border border-slate-700 text-gray-200 rounded px-3 py-2 focus:outline-none"
            />
          </div>

          <div className="bg-slate-800 rounded p-4 border border-slate-700 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-300">Output</label>
              <div className="text-xs text-gray-400">
                {isRunning ? "Running..." : "Result"}
              </div>
            </div>
            <pre className="w-full flex-1 overflow-auto bg-slate-900 border border-slate-700 text-gray-200 rounded p-3 text-sm whitespace-pre-wrap">
              {output ||
                (isRunning ? "Running..." : "// Output will appear here")}
            </pre>
          </div>

          <div className="flex gap-3">
            <GradientButton
              className="flex-1 px-4 py-2"
              onClick={handleRun}
              disabled={isRunning}
              loading={isRunning}
            >
              Run
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
};
