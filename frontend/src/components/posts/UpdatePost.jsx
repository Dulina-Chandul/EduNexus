import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import {
  getSinglePostAPI,
  updatePostAPI,
} from "../../APIservices/posts/postAPI";
import { useFormik } from "formik";
import * as Yup from "yup";

const UpdatePost = () => {
  //! When the form is first time rendering, it shows the previous post data
  //! So, we need to use enableReinitialize: true in the formik config

  //* Get the postId from the URL params
  const { postId } = useParams();

  const { data: postData } = useQuery({
    queryKey: ["get-post"],
    queryFn: () => getSinglePostAPI(postId),
  });

  const postMutation = useMutation({
    mutationKey: ["update-post"],
    mutationFn: ({ postId, postData }) => updatePostAPI(postId, postData),
  });

  const formik = useFormik({
    initialValues: {
      title: postData?.post.title || "",
      description: postData?.post.description || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      const postData = {
        title: values.title,
        description: values.description,
      };
      postMutation.mutate({ postId, postData });
    },
  });

  //* Get Loading State
  const isLoading = postMutation.isPending;

  //* Get Error State
  const isError = postMutation.isError;

  //* Get Success State
  const isSuccess = postMutation.isSuccess;

  //* Error
  const error = postMutation.error;

  //* Error message
  const errorMessage = postMutation?.error?.response?.data?.message;

  return (
    <div>
      <h2>You are editing: {postData?.post.title}</h2>

      {isLoading && <h1>Updating Post...</h1>}
      {isError && <h1 style={{ color: "red" }}>Error: {errorMessage}</h1>}
      {isSuccess && (
        <h1 style={{ color: "green" }}>Post Updated Successfully!</h1>
      )}

      <form action="" onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Enter the Title"
          {...formik.getFieldProps("title")}
        />
        <input
          type="text"
          name="description"
          placeholder="Enter the Description"
          {...formik.getFieldProps("description")}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdatePost;
