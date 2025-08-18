import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { FaThumbsUp, FaThumbsDown, FaEye, FaComment } from "react-icons/fa";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  dislikePostAPI,
  getSinglePostAPI,
  likePostAPI,
} from "../../APIservices/posts/postAPI";
import { RiUserFollowLine, RiUserUnfollowFill } from "react-icons/ri";
import {
  followUserAPI,
  unfollowUserAPI,
  userProfileAPI,
} from "../../APIservices/users/userAPI";
import { createCommentAPI } from "../../APIservices/comments/commentsAPI";
import { useFormik } from "formik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AlertMessage from "../alerts/AlertMessage";

const PostDetails = () => {
  const { postId } = useParams();
  const {
    isError,
    isFetching,
    data: postData,
    error,
    isSuccess,
    refetch: refetchPostData,
  } = useQuery({
    queryKey: ["get-post"],
    queryFn: () => getSinglePostAPI(postId),
  });
  const { data: profileData, refetch } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userProfileAPI(),
  });
  const userID = profileData?.user?._id;
  const userToFollowUnfollow = postData?.post?.author;
  const isFollowing = profileData?.user?.following?.find(
    (user) => user?._id?.toString() === userToFollowUnfollow?.toString()
  );
  const followUserMutation = useMutation({
    mutationKey: ["follow-user"],
    mutationFn: followUserAPI,
  });
  const unFollowUserMutation = useMutation({
    mutationKey: ["unfollow-user"],
    mutationFn: unfollowUserAPI,
  });
  const followUserHandle = async () => {
    followUserMutation
      .mutateAsync(userToFollowUnfollow)
      .then(() => refetch())
      .catch((error) => console.log("Error following user:", error));
  };
  const unFollowUserHandle = async () => {
    unFollowUserMutation
      .mutateAsync(userToFollowUnfollow)
      .then(() => refetch())
      .catch((error) => console.log("Error unfollowing user:", error));
  };
  const likePostMutation = useMutation({
    mutationKey: ["like-post"],
    mutationFn: likePostAPI,
  });
  const dislikePostMutation = useMutation({
    mutationKey: ["dislike-post"],
    mutationFn: dislikePostAPI,
  });
  const likePostHandle = async () => {
    likePostMutation
      .mutateAsync(postId)
      .then(() => refetchPostData())
      .catch((error) => console.log("Error following user:", error));
  };
  const dislikePostHandle = async () => {
    dislikePostMutation
      .mutateAsync(postId)
      .then(() => refetchPostData())
      .catch((error) => console.log("Error unfollowing user:", error));
  };
  const commentMutation = useMutation({
    mutationKey: ["create-comment"],
    mutationFn: createCommentAPI,
  });
  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema: Yup.object({
      comment: Yup.string().required("Comment is required"),
    }),
    onSubmit: (values) => {
      const data = {
        comment: values.comment,
        postId: postId,
      };
      commentMutation
        .mutateAsync(data)
        .then(() => {
          refetchPostData();
          formik.resetForm();
        })
        .catch((error) => {
          console.error("Error creating comment:", error);
        });
    },
  });
  return (
    <div className="container mx-auto p-4">
      {isError && (
        <AlertMessage
          type="error"
          message={error.message}
          bg-primary
          text-text
        />
      )}
      {isFetching && (
        <AlertMessage
          type="loading"
          message="Loading post..."
          bg-primary
          text-text
        />
      )}
      {isSuccess && !isFetching && (
        <AlertMessage
          type="success"
          message="Post loaded successfully!"
          bg-primary
          text-text
        />
      )}
      <Card className="bg-bg dark:bg-bg-dark border-none shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="p-0">
          <img
            src={postData?.post?.image?.path}
            className="w-full h-96 object-cover"
          />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <Button
                variant="ghost"
                onClick={likePostHandle}
                className="text-primary dark:text-primary-dark hover:bg-accent dark:hover:bg-accent-dark"
              >
                <FaThumbsUp className="mr-2" />
                {postData?.post?.likes?.length || 0}
              </Button>
              <Button
                variant="ghost"
                onClick={dislikePostHandle}
                className="text-primary dark:text-primary-dark hover:bg-accent dark:hover:bg-accent-dark"
              >
                <FaThumbsDown className="mr-2" />
                {postData?.post?.dislikes?.length || 0}
              </Button>
              <span className="flex items-center text-text dark:text-text-dark gap-1">
                <FaEye />
                {postData?.post?.viewers?.length || 0}
              </span>
            </div>
            {isFollowing ? (
              <Button
                onClick={unFollowUserHandle}
                variant="destructive"
                className="bg-primary dark:bg-primary-dark text-text dark:text-text-dark hover:bg-accent dark:hover:bg-accent-dark"
              >
                <RiUserUnfollowFill className="mr-2" />
                Unfollow
              </Button>
            ) : (
              <Button
                onClick={followUserHandle}
                className="bg-secondary dark:bg-secondary-dark text-text dark:text-text-dark hover:bg-accent dark:hover:bg-accent-dark"
              >
                Follow
                <RiUserFollowLine className="ml-2" />
              </Button>
            )}
          </div>
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={postData?.post?.author?.profilePicture} />
              <AvatarFallback>
                {postData?.post?.author?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="ml-3 text-text dark:text-text-dark font-medium">
              {postData?.post?.author?.username}
            </span>
          </div>
          <div
            className="rendered-html-content mb-6 text-text dark:text-text-dark"
            dangerouslySetInnerHTML={{ __html: postData?.post?.description }}
          />
          <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
          <CardTitle className="text-2xl font-bold mb-4 text-text dark:text-text-dark">
            Comments
          </CardTitle>
          <form onSubmit={formik.handleSubmit} className="mb-6">
            <Textarea
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg mb-2 bg-bg dark:bg-bg-dark text-text dark:text-text-dark"
              rows="3"
              placeholder="Add a comment..."
              {...formik.getFieldProps("comment")}
            />
            {formik.touched.comment && formik.errors.comment && (
              <div className="text-red-500 mb-2">{formik.errors.comment}</div>
            )}
            <Button
              type="submit"
              className="bg-primary dark:bg-primary-dark text-text dark:text-text-dark hover:bg-accent dark:hover:bg-accent-dark"
            >
              <FaComment className="mr-2" /> Comment
            </Button>
          </form>
          <div className="space-y-4">
            {postData?.post?.comments?.map((comment, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author?.profilePicture} />
                    <AvatarFallback>
                      {comment.author?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-text dark:text-text-dark font-medium">
                      {comment.author?.username}
                    </p>
                    <p className="text-text dark:text-text-dark">
                      {comment.content}
                    </p>
                    <small className="text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default PostDetails;
