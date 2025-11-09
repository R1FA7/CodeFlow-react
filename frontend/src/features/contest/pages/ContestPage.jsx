import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getContest } from "../../../api/contest";
import { LoadingSpinner } from "../../common/components/LoadingSpinner";
import { ReusableTable } from "../../common/components/Table";
export const ContestPage = () => {
  const { contestId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["contest", contestId],
    queryFn: () => getContest(contestId),
    enabled: !!contestId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error loading contest</p>;
  console.log(data);

  const columns = [
    {
      header: "#",
      render: (item) => item?.id,
      cellClassName: "whitespace-nowrap font-medium text-purple-400",
    },
    {
      header: "Problem",
      render: (item) => item?.title,
      cellClassName: "font-medium text-gray-200",
    },
    {
      header: "",
      text: "submit",
      cellClassName: "font-xs underline text-gray-200",
    },
  ];
  const handleRowClick = (problem, navigate) => {
    console.log("hi", problem);
    navigate(`problems/${problem._id}`);
  };
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
        {data?.contestName}
      </h1>
      <ReusableTable
        columns={columns}
        scale={0.8}
        keyExtractor={(item, index) => `${item?._id}-${index}`}
        data={data?.problems}
        onRowClick={(problem, navigate) => handleRowClick(problem, navigate)}
      />
    </div>
  );
};
