import { CheckIcon, StarIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getRating } from "../../../api/auth";
import { LoadingSpinner } from "../../common/components/LoadingSpinner";
import { LineChartGraph } from "../components/LineChartGraph";
import { StatCard } from "../components/StatCard";

export const OverviewPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["rating"],
    queryFn: getRating,
  });
  console.log(data);
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="ml-3 flex flex-col gap-4 p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
        Overview
      </h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <StatCard
          title="Rating"
          value={data?.data?.overview?.rating}
          icon={StarIcon}
          gradient="from-purple-900/80 to-slate-800/80"
        />
        <StatCard
          title="Contests"
          value={data?.data?.overview?.contestCount}
          icon={TrophyIcon}
          gradient="from-indigo-900/80 to-purple-800/80"
        />
        <StatCard
          title="Problems Solved"
          value={data?.data?.overview?.solvedProblemsCount}
          icon={CheckIcon}
          gradient="from-slate-900/80 to-purple-900/80"
        />
      </div>
      <div className="bg-linear-to-br from-slate-900/80 to-purple-900/80 backdrop-blur-sm border border-purple-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-800 mb-4 text-center">
          Rating Progress
        </h3>

        <LineChartGraph data={data?.data?.ratingHistory} />
      </div>
    </div>
  );
};
