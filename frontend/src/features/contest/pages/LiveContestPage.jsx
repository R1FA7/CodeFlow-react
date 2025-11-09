import {
  ChevronRightIcon,
  ClockIcon,
  CodeBracketIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GradientButton } from "../../common/components/GradientButton";

export function LiveContestPage({ liveContests }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const navigate = useNavigate();

  // Calculate time left dynamically(ms)
  const calculateTimeLeft = (contestDate, duration) => {
    const endTime = new Date(new Date(contestDate).getTime() + duration);
    const now = new Date();
    const diff = Math.max(0, endTime - now);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  // Countdown timer
  useEffect(() => {
    if (liveContests.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(
        calculateTimeLeft(liveContests[0].contestDate, liveContests[0].duration)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [liveContests]);

  const handleEnterContest = (cId) => {
    navigate(`/contests/${cId}`);
  };
  return (
    <div className="text-gray-200 p-4 md:p-6 flex justify-center flex-col gap-2 items-center">
      {liveContests.map((contest) => (
        <div
          key={contest.round}
          className="w-full max-w-6xl bg-slate-800 rounded-tl-4xl overflow-hidden shadow-lg border border-slate-700 scale-[0.99] origin-top-left ml-5"
        >
          {/* Live Banner + Countdown */}
          <div className="bg-linear-to-r from-red-700 to-pink-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-100 rounded-full animate-pulse"></span>
                <span className="text-white font-bold text-lg">LIVE NOW</span>
              </div>
              <span className="hidden md:inline text-white/80 text-sm">
                12000 participants competing
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <ClockIcon className="w-5 h-5 text-white" />
              <div className="flex items-center gap-1 font-mono text-white font-bold text-lg">
                <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="animate-pulse">:</span>
                <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="animate-pulse">:</span>
                <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
              </div>
            </div>
          </div>

          {/* Contest Info + Problems */}
          <div className="grid md:grid-cols-2 border-t border-slate-700">
            {/* Contest Info */}
            <div className="p-6 flex flex-col justify-center items-center">
              <h1 className="text-xl xl:text-4xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                {contest.contestName}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    Started:{" "}
                    {new Date(contest.contestDate).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrophyIcon className="w-4 h-4" />
                  <span>Round {contest.round}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CodeBracketIcon className="w-4 h-4" />
                  <span>{contest.problems.length} Problems</span>
                </div>
              </div>

              <GradientButton
                className="px-6 py-3 group relative"
                onClick={() => handleEnterContest(contest.id)}
              >
                <span className="flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5" />
                  Enter Contest
                  <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </GradientButton>
            </div>

            {/* Problems Grid */}
            <div className="p-2 xl:p-6 border-l border-slate-700">
              <div className="flex flex-col gap-4">
                {contest.problems.map((problem, index) => (
                  <div
                    key={problem._id}
                    className="group bg-slate-700 rounded-lg p-1 border border-slate-600 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    <div className="flex items-center gap-4">
                      {/* Problem Number Badge */}
                      <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>

                      {/* Problem Info */}
                      <div className="flex-1">
                        <h3 className=" text-gray-100 group-hover:text-purple-400 transition-colors">
                          {problem.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
