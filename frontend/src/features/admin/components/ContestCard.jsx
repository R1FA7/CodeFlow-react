import {
  CheckCircleIcon,
  ChevronDownIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
export const ContestCard = ({
  contest,
  expanded,
  onToggle,
  onAccept,
  onReject,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start mb-4 flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-gray-100">
            {contest.contestName}
          </h3>
        </div>

        <div className="mb-4">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-300 ${
                expanded ? "rotate-180" : "rotate-0"
              }`}
            />
            {expanded ? "Hide Problems" : "View Problems"}
          </button>

          {expanded && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
              {contest.problems.map((problem) => (
                <div
                  key={problem.problemId}
                  className="bg-slate-700 rounded-lg p-3 border border-slate-600 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => navigate(`/problems/${problem?.problemId}`)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                      {problem.charId}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 truncate">
                        {problem.problemTitle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={onAccept}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-green-500/50"
          >
            <CheckCircleIcon className="w-4 h-4" />
            Accept & Schedule
          </button>
          <button
            onClick={onReject}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-red-500/50"
          >
            <XCircleIcon className="w-4 h-4" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};
