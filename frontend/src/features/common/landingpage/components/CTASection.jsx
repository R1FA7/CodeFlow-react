import { GradientButton } from "../../components/gradientButton";

export const CTASection = () => (
  <section className="relative px-6 lg:px-20 py-16 lg:py-24 overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl" />
    <div className="relative max-w-4xl mx-auto text-center space-y-8">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
        Ready to Start Your <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
          Coding Journey?
        </span>
      </h2>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Join our community of passionate programmers and take your skills to the
        next level
      </p>
      <div className="flex justify-center">
        <GradientButton className="px-10 py-5">Sign Up Free</GradientButton>
      </div>
    </div>
  </section>
);
