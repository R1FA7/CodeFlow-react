import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export const TestCaseCard = ({ idx, input, output }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="text-sm font-semibold text-purple-400 mb-2">
        Example {idx + 1}
      </div>
      <div className="space-y-2">
        <div>
          <span className="text-gray-400 text-sm">Input:</span>
          <pre
            className="bg-slate-900 p-3 rounded mt-1 text-green-400 text-sm overflow-x-auto relative"
            onClick={() => {
              navigator.clipboard.writeText(input);
              toast("Copied to clipboard!");
            }}
          >
            <DocumentDuplicateIcon className="w-5 h-5 absolute right-2 text-gray-600" />
            {input}
          </pre>
        </div>
        <div>
          <span className="text-gray-400 text-sm">Output:</span>
          <pre className="bg-slate-900 p-3 rounded mt-1 text-blue-400 text-sm overflow-x-auto">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
};
