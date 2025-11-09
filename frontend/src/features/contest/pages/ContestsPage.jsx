import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import {
  getCurrentContest,
  getPastContests,
  getUpcomingContests,
} from "../../../api/contest";
import { LoadingSpinner } from "../../common/components/LoadingSpinner";
import { ReusableTable } from "../../common/components/Table";
import { LiveContestPage } from "./LiveContestPage";
export const ContestsPage = () => {
  const allContests = useQueries({
    queries: [
      { queryKey: ["pastContests"], queryFn: getPastContests },
      { queryKey: ["currentContest"], queryFn: getCurrentContest },
      { queryKey: ["upcomingContests"], queryFn: getUpcomingContests },
    ],
  });
  const [past, live, upcoming] = allContests;

  const [activeTab, setActiveTab] = useState(
    live?.data?.length ? "Live" : "Upcoming"
  );
  const tabData =
    activeTab === "Upcoming"
      ? upcoming?.data
      : activeTab === "Live"
      ? live?.data
      : past?.data;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Dhaka",
    });
  };
  const columns = [
    {
      header: "Name",
      key: "contestName",
      //render: (problem) => `${problem?.round}${problem?.id}`,
      // render: (item) => item.problem?.title || "N/A",
      cellClassName: "whitespace-nowrap font-medium text-purple-400",
    },
    {
      header: "Time",
      key: "date",
      render: (item) => formatDateTime(item?.date), //item?.date.split("T")[0],
      cellClassName: "font-medium text-gray-200",
    },
    {
      header: "Setter",
      key: "setter",
      render: (item) => item.setter?.name,
      cellClassName: "whitespace-nowrap font-semibold text-gray-200",
    },
  ];
  const handleRowClick = (contest, navigate) => {
    console.log(contest);
    navigate(`${contest.id}`);
  };
  if (allContests.some((r) => r.isLoading)) return <LoadingSpinner />;
  if (allContests.some((r) => r.isError)) return <p>Error loading contests</p>;
  console.log(past?.data);
  console.log("live", live?.data);
  console.log(upcoming?.data);
  return (
    <div>
      <div className="ml-6 flex gap-5 border-b-2 pb-3 border-gray-700">
        {["Upcoming", "Live", "Past"].map((type) => (
          <div
            key={type}
            onClick={() => setActiveTab(type)}
            className={`font-medium cursor-pointer relative transition-colors ${
              type === activeTab
                ? "text-fuchsia-600 font-bold after:absolute after:left-0 after:-bottom-3.5 after:w-full after:h-0.5 after:bg-fuchsia-600"
                : "text-gray-300"
            }`}
          >
            {type}
          </div>
        ))}
      </div>
      <h1 className="text-2xl font-bold text-center mb-5 ml-4 md:ml-0 text-fuchsia-600 mt-5">
        {activeTab} Contests
      </h1>
      {activeTab === "Live" ? (
        tabData.length ? (
          <LiveContestPage liveContests={tabData} />
        ) : (
          <p className="text-center text-gray-400 mt-4">
            Currently no Live contest is available.
          </p>
        )
      ) : tabData?.length > 0 ? (
        <ReusableTable
          columns={columns}
          scale={0.7}
          keyExtractor={(item, index) => `${item?._id}-${index}`}
          data={tabData}
          onRowClick={activeTab !== "Upcoming" ? handleRowClick : undefined}
        />
      ) : (
        <p className="text-center text-gray-400 mt-4">
          Currently no {activeTab} contest is available.
        </p>
      )}
    </div>
  );
};
