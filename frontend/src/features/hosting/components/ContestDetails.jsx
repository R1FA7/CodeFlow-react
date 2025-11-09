import { TrophyIcon } from "@heroicons/react/24/outline";
import { GradientButton } from "../../common/components/GradientButton";

export const ContestDetails = ({ formData, setStep, handleContestChange }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrophyIcon className="w-6 h-6 text-purple-400" />
        Contest Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contest Level *
          </label>
          <select
            value={formData.level}
            onChange={(e) => handleContestChange("level", e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="Expert">Expert</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Beginner">Beginner</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration (minutes) *
          </label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) =>
              handleContestChange("duration", parseInt(e.target.value))
            }
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-purple-500 transition-colors"
            min="30"
            max="300"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <GradientButton
          onClick={() => setStep(2)}
          className="px-6 py-3 float-right"
        >
          Next
        </GradientButton>
      </div>
    </div>
  );
};
