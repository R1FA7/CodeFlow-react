import { ClockIcon, NumberedListIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  acceptContest,
  getUnpublishedContests,
  rejectContest,
} from "../../../api/admin";
import { LoadingSpinner } from "../../common/components/LoadingSpinner";
import { StatCard } from "../../overview/components/StatCard";
import { AdminModal } from "../components/AdminModal";
import { ContestCard } from "../components/ContestCard";

export const AdminPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin"],
    queryFn: getUnpublishedContests,
  });

  const contests = data?.data || [];

  // UI state
  const [expandedContest, setExpandedContest] = useState(null);
  const [selectedContest, setSelectedContest] = useState(null);
  const [scheduleData, setScheduleData] = useState({ date: "" });
  const [modalType, setModalType] = useState(null); // "schedule" or "reject"
  console.log(contests);

  // Mutations
  const { mutate: mutateAcceptContest, isPending: isAcceptLoading } =
    useMutation({
      mutationFn: ({ id, date }) => acceptContest(id, date),
      onSuccess: () => {
        queryClient.invalidateQueries(["admin"]);
        closeModal();
      },
    });

  const { mutate: mutateRejectContest, isPending: isRejectLoading } =
    useMutation({
      mutationFn: (id) => rejectContest(id),
      onSuccess: () => {
        queryClient.invalidateQueries(["admin"]);
        closeModal();
      },
    });

  const closeModal = () => {
    setModalType(null);
    setSelectedContest(null);
    setScheduleData({ date: "" });
  };

  const handleAccept = (contest) => {
    setSelectedContest(contest);
    setModalType("schedule");
  };

  const handleReject = (contest) => {
    setSelectedContest(contest);
    setModalType("reject");
  };

  const confirmAction = () => {
    if (modalType === "schedule") {
      if (!scheduleData.date) {
        alert("Please select a date and time");
        return;
      }
      const localTime = new Date(scheduleData.date);
      const utcTime = localTime.toISOString();
      mutateAcceptContest({
        id: selectedContest.contestId,
        date: utcTime,
      });
    } else if (modalType === "reject") {
      mutateRejectContest(selectedContest.contestId);
    }
  };

  const toggleExpand = (contestId) => {
    setExpandedContest(expandedContest === contestId ? null : contestId);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error loading contests</p>;

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-4 md:p-6 ml-3">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
          Pending Contest Approvals
        </h1>
        <div className="grid grid-cols-1 xl:grid-cols-2 mt-5 gap-2 mb-5">
          <StatCard
            title="Pending"
            value={contests?.length}
            icon={ClockIcon}
            gradient="from-purple-900/80 to-slate-800/80"
          />
          <StatCard
            title="Total Problems"
            value={contests.reduce(
              (acc, c) => acc + (c.problems?.length || 0),
              0
            )}
            icon={NumberedListIcon}
            gradient="from-purple-900/80 to-slate-800/80"
          />
        </div>
        {contests.length === 0 ? (
          <p className="text-gray-300 text-center">All Caught Up!</p>
        ) : (
          <div className="space-y-4">
            {contests.map((contest) => (
              <ContestCard
                key={contest.contestId}
                contest={contest}
                expanded={expandedContest === contest.contestId}
                onToggle={() => toggleExpand(contest.contestId)}
                onAccept={() => handleAccept(contest)}
                onReject={() => handleReject(contest)}
              />
            ))}
          </div>
        )}

        {modalType && selectedContest && (
          <AdminModal
            type={modalType}
            selectedContest={selectedContest}
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
            onCancel={closeModal}
            onConfirm={confirmAction}
            isLoading={
              modalType === "schedule" ? isAcceptLoading : isRejectLoading
            }
          />
        )}
      </div>
    </div>
  );
};
