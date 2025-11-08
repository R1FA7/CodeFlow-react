import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { GradientButton } from "../../common/components/gradientButton";

export const ConfirmModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-filter flex items-center justify-center z-50 p-4">
      <div className="bg-linear-to-br from-slate-600 via-emerald-700 to-emerald-800 rounded-xl p-8 max-w-md w-full border border-emerald-500/40 text-center text-white shadow-md">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-100 mb-2">
          Contest Submitted!
        </h3>
        <p className="text-gray-300">
          Your contest has been successfully submitted and will be available for
          participants when admin schedule it.
        </p>
        <GradientButton
          className="px-6 py-2 mt-2 float-right"
          onClick={onClose}
        >
          OK
        </GradientButton>
      </div>
    </div>
  );
};
