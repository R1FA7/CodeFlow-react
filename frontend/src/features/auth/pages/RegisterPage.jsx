import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../../api/auth.js";
import RegisterIllustrator from "../../../assets/Register.svg";
import { AuthForm } from "../components/AuthForm";

export const RegisterPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: mutateRegister, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
      console.log("DATA", data);
      toast.success(data.message);
      navigate("/overview");
    },
    onError: (error) => {
      if (error.errors?.length) {
        error.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleRegister = (t) => {
    console.log("REGISTER", t);
    mutateRegister(t);
  };

  return (
    <div className="w-full flex min-h-screen font-sans text-gray-100">
      {/* Right Side – Auth Form */}
      <div className="w-full md:w-2/3 bg-linear-to-br from-slate-900 via-slate-800 to-purple-950 flex justify-center items-center">
        <div className="bg-slate-800/70 backdrop-blur-lg p-12 rounded-2xl shadow-2xl border border-purple-700/30">
          <AuthForm
            header="Sign up"
            type="Sign up"
            question="Have an account?"
            link="Sign in"
            buttonText="Sign up"
            fields={["name", "email", "username", "password"]}
            onSubmit={(t) => handleRegister(t)}
            disabled={isPending}
            isLoading={isPending}
          />
        </div>
      </div>

      {/* Left Side – Welcome Banner */}
      <div className="hidden md:w-1/3 relative overflow-hidden md:flex flex-col justify-center items-center text-center px-10 py-16 bg-linear-to-br from-slate-900 via-purple-900 to-indigo-800 border-r border-slate-700/40 shadow-2xl">
        <img
          src={RegisterIllustrator}
          alt="Coding Platform"
          className="relative w-[350px] md:w-[500px] lg:w-[550px] drop-shadow-[0_0_35px_rgba(99,102,241,0.5)] animate-float"
        />
        <h1 className="relative text-5xl font-extrabold mb-4 text-white drop-shadow-lg z-10">
          Join Us Today
        </h1>
        <p className="relative text-slate-300 leading-relaxed max-w-xs z-10">
          Start your journey with us create an account and unlock all the
          features.
        </p>
      </div>
    </div>
  );
};
