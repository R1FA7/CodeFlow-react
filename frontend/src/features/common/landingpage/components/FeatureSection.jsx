import {
  ChartBarIcon,
  CodeBracketIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { FeatureCard } from "./FeatureCard";
const features = [
  {
    icon: CodeBracketIcon,
    title: "Extensive Problem Set",
    description:
      "Access 5000+ curated problems across various difficulty levels and topics",
    color: "indigo",
  },
  {
    icon: TrophyIcon,
    title: "Regular Contests",
    description:
      "Compete in weekly contests and improve your ranking on the global leaderboard",
    color: "purple",
  },
  {
    icon: ChartBarIcon,
    title: "Performance Analytics",
    description:
      "Track your progress with detailed statistics and performance insights",
    color: "pink",
  },
  {
    icon: UserGroupIcon,
    title: "Vibrant Community",
    description:
      "Learn from discussions, editorials, and solutions shared by top coders",
    color: "cyan",
  },
];

export const FeaturesSection = () => (
  <section className="flex flex-col space-y-12 px-6 lg:px-20 py-16 lg:py-24">
    <div className="text-center space-y-4">
      <h2 className="text-4xl md:text-5xl font-extrabold">
        Why Choose{" "}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-500">
          CodeFlow
        </span>
      </h2>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        Experience the ultimate platform designed for competitive programmers
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {features.map((feature, idx) => (
        <FeatureCard key={idx} {...feature} />
      ))}
    </div>
  </section>
);
