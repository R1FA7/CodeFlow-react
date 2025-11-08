import { useQuery } from "@tanstack/react-query";
import { getAllSubmissions } from "../../api/submission";
import { LoadingSpinner } from "../common/components/LoadingSpinner";
import { ReusableTable } from "../common/components/Table";

export const SubmissionsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["submissions"],
    queryFn: getAllSubmissions,
  });

  console.log(data?.data[0]);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <p>Error occurred</p>;

  const columns = [
    {
      header: "problem",
      key: "problem",
      //render: (problem) => `${problem?.round}${problem?.id}`,
      render: (item) => item.problem?.title || "N/A",
      cellClassName: "whitespace-nowrap font-medium text-purple-400",
    },
    {
      header: "Time",
      key: "submittedAt",
      render: (item) => item?.submittedAt.split("T")[0],
      cellClassName: "font-medium text-gray-200",
    },
    {
      header: "Language",
      key: "language",
      cellClassName: "whitespace-nowrap font-semibold text-gray-200",
    },
    {
      header: "Status",
      key: "message",
      cellClassName: "whitespace-nowrap text-gray-300",
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
        Submissions
      </h1>
      <ReusableTable
        columns={columns}
        data={data?.data}
        // onRowClick={handleRowClick}
        keyExtractor={(item, index) => `${item?._id}-${index}`}
        scale={0.6}
      />
    </div>
  );
};
