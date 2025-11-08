import { CheckIcon } from "@heroicons/react/24/outline";

export const ProgressSteps = ({ step }) => {
  return (
    <div className="flex justify-center my-5 gap-1 md:gap-10">
      {[
        { num: 1, label: "Contest Details" },
        { num: 2, label: "Add Problems" },
        { num: 3, label: "Preview & Submit" },
      ].map((s, idx) => (
        <div key={s.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= s.num
                  ? "bg-purple-600 text-white"
                  : "bg-slate-700 text-gray-400"
              }`}
            >
              {step > s.num ? <CheckIcon className="w-5 h-5" /> : s.num}
            </div>
            <span
              className={`text-xs mt-2 text-center ${
                step >= s.num ? "text-purple-400" : "text-gray-500"
              }`}
            >
              {s.label}
            </span>
          </div>
          {idx < 2 && (
            <div
              className={`h-1 w-16 mx-2 transition-all ${
                step > s.num ? "bg-purple-600" : "bg-slate-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
