import stepsIllustration from "../../../../assets/steps_illustration.svg";
import { StepCard } from "./StepCard";

const steps = [
  {
    number: 1,
    title: "Sign Up & Setup",
    description: "Create your account in seconds and customize your profile.",
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    number: 2,
    title: "Solve Problems",
    description: "Browse through 5000+ curated problems & practice DSA & algo.",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    number: 3,
    title: "Compete & Grow",
    description:
      "Participate in contests, earn ratings, and climb the leaderboard.",
    gradient: "from-pink-600 to-cyan-600",
  },
];

export const HowItWorksSection = () => (
  <section className="px-6 lg:px-20 py-16 lg:py-24 bg-linear-to-br from-slate-800/50 to-slate-800/50">
    <div className="max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold">
          Kickstart Your Journey in{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-500">
            3 Simple Steps
          </span>
        </h2>
        <p className="text-gray-400 text-lg">
          From beginner to expert, we've got you covered
        </p>
      </div>

      <div className="flex md:justify-evenly justify-center items-center flex-col md:flex-row gap-8">
        <img
          src={stepsIllustration}
          alt="Steps Illustration"
          className="w-[300px] md:w-[300px] lg:w-[480px] drop-shadow-[0_0_35px_rgba(99,102,241,0.5)]"
        />
        <div className="max-w-3xl space-y-2">
          {steps.map((step, idx) => (
            <>
              <StepCard key={step.number} {...step} />
              {idx < steps.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-0.5 h-12 border-l-2 border-dashed border-white" />
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  </section>
);
