import { useState } from "react";
import { Link } from "react-router-dom";
import { GradientButton } from "../../common/components/gradientButton";
import { Input } from "./Input";

export const AuthForm = ({
  header,
  question,
  link,
  buttonText,
  onSubmit,
  fields,
  disabled,
}) => {
  console.log(fields);
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      className="flex flex-col gap-6 items-center w-full md:w-80"
      onSubmit={submitHandler}
    >
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">
        {header}
      </h1>

      {fields.map((field) => (
        <Input
          key={field}
          label={field
            .replace(/([A-Z])/g, " $1") // turn camelCase to words
            .replace(/^./, (str) => str.toUpperCase())}
          type={
            field.toLowerCase().includes("password")
              ? "password"
              : field.toLowerCase().includes("email")
              ? "email"
              : "text"
          }
          value={formData[field]}
          onChange={(val) => handleChange(field, val)}
        />
      ))}

      <GradientButton className="px-6 py-3">{buttonText}</GradientButton>

      <p className="flex gap-2 text-sm">
        {question}
        <Link
          to={link === "Sign up" ? "/register" : "/login"}
          className="text-purple-400 hover:text-pink-400 underline"
        >
          {link}
        </Link>
      </p>
    </form>
  );
};
