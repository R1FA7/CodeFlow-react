import { GradientButton } from "../../common/components/gradientButton";

export const AdminModal = ({
  type, // "schedule" or "reject"
  selectedContest,
  scheduleData,
  setScheduleData,
  onCancel,
  onConfirm,
  isLoading,
}) => {
  const isSchedule = type === "schedule";
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 md:p-8 max-w-md w-full border border-slate-700">
        <div className="flex flex-col justify-center items-center mb-6">
          <h3 className="text-xl font-bold text-gray-100">
            {isSchedule ? "Schedule Contest" : "Reject Contest"}
          </h3>
          <p className="text-sm text-gray-400">
            {isSchedule
              ? "Set the date and time for this contest"
              : "This action cannot be undone"}
          </p>
        </div>

        {isSchedule ? (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contest Name
              </label>
              <div className="bg-slate-700 rounded-lg px-4 py-3 text-gray-400">
                {selectedContest?.contestName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contest Date & Time *
              </label>
              <input
                type="datetime-local"
                value={scheduleData.date}
                onChange={(e) => setScheduleData({ date: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>
        ) : (
          <div className="bg-red-600 rounded-lg p-4 mb-6">
            <p className="font-semibold text-gray-100 text-center">
              {selectedContest?.contestName}
            </p>
            <p className="text-xs text-gray-300 mt-2 text-center">
              This will permanently delete the contest and all associated
              problems.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <GradientButton onClick={onCancel} className="px-4 py-3 flex-1">
            Cancel
          </GradientButton>
          <GradientButton
            onClick={onConfirm}
            disabled={isSchedule && !scheduleData.date}
            className="flex-1 px-4 py-3"
            loading={isLoading}
          >
            {isSchedule ? "Confirm Schedule" : "Confirm Reject"}
          </GradientButton>
        </div>
      </div>
    </div>
  );
};
