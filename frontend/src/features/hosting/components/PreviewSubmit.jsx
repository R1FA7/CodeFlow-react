import { BellAlertIcon } from "@heroicons/react/24/outline";
import { GradientButton } from "../../common/components/gradientButton";
import { ReusableTable } from "../../common/components/Table";

const columns = [
  {
    header: "Input",
    key: "input",
    // render: (input) => ,
    cellClassName: "whitespace-nowrap font-medium text-purple-400 bg-gray-900",
  },
  {
    header: "Output",
    key: "output",
    cellClassName: "font-medium text-gray-100 bg-gray-900",
  },
];

export const PreviewSubmit = ({
  formData,
  setStep,
  handleSubmit,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-6">Contest Summary</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Level</p>
            <p className="text-lg font-semibold text-purple-400">
              {formData.level}
            </p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Duration</p>
            <p className="text-lg font-semibold text-purple-400">
              {formData.duration} minutes
            </p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Problems</p>
            <p className="text-lg font-semibold text-purple-400">
              {formData.problems.length}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">Scheduled For</p>
          <p className="font-semibold text-gray-200">Admin will decide</p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Problems List</h3>
          <div className="space-y-3">
            {formData.problems.map((problem, idx) => (
              <div key={idx} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex flex-col space-y-4">
                    <h4 className="font-semibold text-gray-100 mb-1">
                      {problem.title}
                    </h4>
                    <p className="text-sm text-gray-400 mb-2 line-clamp-none">
                      {problem.statement}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-slate-600 rounded text-gray-300">
                        2s
                      </span>
                      <span className="px-2 py-1 bg-slate-600 rounded text-gray-300">
                        500MB
                      </span>
                      <span className="px-2 py-1 bg-slate-600 rounded text-gray-300">
                        {problem.testCases.length} test cases
                      </span>
                    </div>
                    <ReusableTable
                      columns={columns}
                      data={problem.testCases.slice(0, 2)}
                      scale={0.8}
                      keyExtractor={(item, index) => `${item?._id}-${index}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
        <BellAlertIcon className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-500 font-semibold mb-1">
            Review Before Submitting
          </p>
          <p className="text-sm text-gray-400">
            Make sure all details are correct. Once submitted, it will go for
            admin review.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:justify-between md:flex-row">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg font-medium transition-colors"
        >
          Back to Problems
        </button>
        <GradientButton
          onClick={handleSubmit}
          loading={isLoading}
          className="px-4 py-3 "
        >
          Submit Contest
        </GradientButton>
      </div>
    </div>
  );
};
