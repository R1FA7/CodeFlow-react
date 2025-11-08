import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateUser } from "../../../api/auth";
import { AuthForm } from "../components/AuthForm";

export const SettingsPage = () => {
  const queryClient = useQueryClient();
  const { mutate: mutateUpdate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
      toast.success(data.message);
      console.log(data);
    },
    onError: (error) => {
      if (error.errors?.length) {
        error.errors.forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.message);
      }
    },
  });
  const handleUpdate = async (t) => {
    console.log("Update", t);
    mutateUpdate(t);
  };
  return (
    <div className="flex justify-center items-center ml-3 p-4 md:p-6">
      <div className="bg-slate-800/70 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-2xl border border-purple-700/30 w-full max-w-md md:max-w-lg xl:max-w-2xl flex justify-center items-center">
        <AuthForm
          header="Update Profile"
          type="Sign up"
          buttonText="Update"
          fields={["name", "email", "username", "password", "confirmPassword"]}
          onSubmit={(t) => handleUpdate(t)}
          disabled={isPending}
          isLoading={isPending}
        />
      </div>
    </div>
  );
};
