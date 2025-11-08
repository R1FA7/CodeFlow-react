import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { createContest } from "../../../api/contest";
import { ConfirmModal } from "../components/ConfirmModal";
import { ContestDetails } from "../components/ContestDetails";
import { PreviewSubmit } from "../components/PreviewSubmit";
import { ProblemCard } from "../components/ProblemCard";
import { ProgressSteps } from "../components/ProgressSteps";

export const HostContestPage = () => {
  const [formData, setFormData] = useState({
    level: "Expert",
    contestDate: "", //admin will set up
    duration: 120,
    problems: [],
  });

  const [step, setStep] = useState(1); // 1: Contest Details, 2: Add Problems, 3: Preview
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate: mutateCreateContest, isPending } = useMutation({
    mutationKey: ["contest"],
    mutationFn: (formData) => createContest(formData),
    onSuccess: () => setShowSuccess(true),
    onError: (error) => {
      if (error.errors?.length) {
        error.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleContestChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addProblem = (currentProblem) => {
    console.log(currentProblem);
    setFormData((prev) => ({
      ...prev,
      problems: [...prev.problems, { ...currentProblem }],
    }));
    console.log("hi", formData);
  };

  const handleSubmit = async () => {
    if (formData.problems.length === 0) {
      toast.error(
        "Please complete all required fields and add at least one problem"
      );
      return;
    }

    console.log("CONTEST", formData);
    mutateCreateContest({
      level: formData.level,
      problems: formData.problems.map((problem, idx) => {
        return { ...problem, id: String.fromCharCode(65 + idx) };
      }),
      contestDate: formData.contestDate,
      duration: formData.duration * 60 * 1000,
    });
  };

  return (
    <div className="min-h-0 text-gray-200 p-4 md:p-6 flex flex-col ml-3">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
          Host a Contest
        </h1>
        <ProgressSteps step={step} />

        {step === 1 && (
          <ContestDetails
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
            handleContestChange={(field, value) =>
              handleContestChange(field, value)
            }
          />
        )}

        {step === 2 && (
          <ProblemCard
            formData={formData}
            setStep={setStep}
            addProblem={(currentProblem) => addProblem(currentProblem)}
          />
        )}

        {step === 3 && (
          <PreviewSubmit
            formData={formData}
            setStep={setStep}
            handleSubmit={() => handleSubmit()}
            isLoading={isPending}
          />
        )}
        {showSuccess && (
          <ConfirmModal
            onClose={() => {
              setShowSuccess(false);
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
};
