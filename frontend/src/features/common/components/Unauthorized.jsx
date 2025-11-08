import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
      <h1 className="font-bold text-red-500 text-4xl mb-6">403 Unauthorized</h1>

      <button
        onClick={() => navigate(-1)}
        className="text-5xl hover:scale-110 transition-transform cursor-pointer"
        title="Go back"
      >
        🏃‍♂️
      </button>
    </div>
  );
};
