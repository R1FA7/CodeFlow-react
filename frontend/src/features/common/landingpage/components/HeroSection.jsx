import { useNavigate } from "react-router-dom";
import lpIllustration from "../../../../assets/lp_illustration.svg";
import { GradientButton } from "../../components/gradientButton";
export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-xl space-y-6 z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
          Code.{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-500">
            Compete.
          </span>{" "}
          Conquer.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          Join thousands of programmers solving challenging problems, competing
          in contests, and climbing the leaderboard.
        </p>
        <GradientButton
          className="px-4 py-6"
          onClick={() => navigate("/register")}
        >
          Start solving now
        </GradientButton>
      </div>

      <div className="relative mt-10 md:mt-0">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/50 to-indigo-400/20 rounded-full blur-3xl" />
        <img
          src={lpIllustration}
          alt="Coding Platform"
          className="relative w-[350px] md:w-[500px] lg:w-[550px] drop-shadow-[0_0_35px_rgba(99,102,241,0.5)] animate-float"
        />
      </div>
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
