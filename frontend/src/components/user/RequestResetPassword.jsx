import { useMutation } from "@tanstack/react-query";
import React from "react";
import * as Yup from "yup";
import { AiOutlineMail } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
// import { forgotPasswordAPI } from "../../APIServices/users/usersAPI";
import { useFormik } from "formik";
import AlertMessage from "../alerts/AlertMessage";
import { forgotPasswordAPI } from "../../APIservices/users/userAPI";

const RequestResetPassword = () => {
  const navigate = useNavigate();

  //* User Mutation
  const userMutation = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: forgotPasswordAPI,
  });

  //* Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      userMutation
        .mutateAsync(values.email)
        .then(() => {})
        .catch((error) => {
          console.error("Error during registration:", error);
        });
    },
  });

  console.log("User Mutation:", userMutation);

  return (
    <div className="flex items-center justify-center h-screen bg-orange-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Reset Your Password
        </h2>
        {/* show alert */}
        {userMutation.isPending && (
          <AlertMessage type="loading" message="Sending email..." />
        )}

        {userMutation.isSuccess && (
          <AlertMessage
            type="success"
            message={userMutation.data.message || "Email sent successfully!"}
          />
        )}

        {userMutation.isError && (
          <AlertMessage
            type="error"
            message={userMutation.error.response.data.message || "Error"}
          />
        )}

        <form className="mt-4" onSubmit={formik.handleSubmit}>
          <label htmlFor="email" className="block text-gray-700">
            Email:
          </label>
          <div className="flex items-center border rounded-md focus:outline-none focus:ring focus:border-orange-300">
            <AiOutlineMail className="mx-2 text-orange-500" />
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className="w-full px-3 py-2 mt-2 border-0 rounded-md"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          )}
          <button
            type="submit"
            className="w-full px-3 py-2 mt-4 text-white bg-orange-600 rounded-md focus:bg-orange-700 focus:outline-none"
          >
            Send Reset Password Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestResetPassword;
