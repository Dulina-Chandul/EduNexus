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
import { Badge } from "@/components/ui/badge";
import AlertMessage from "../alerts/AlertMessage";
import {
  Heart,
  MessageCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Send,
  Calendar,
  User,
  Sparkles,
  ArrowLeft,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

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

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-primary/5 dark:from-bg-dark dark:via-bg-dark dark:to-primary-dark/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="h-96 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 rounded-3xl"></div>

          {/* Content Skeleton */}
          <Card className="bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-sm border border-primary/20 dark:border-primary-dark/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-primary/20 dark:bg-primary-dark/20 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-primary/20 dark:bg-primary-dark/20 rounded w-32"></div>
                      <div className="h-3 bg-primary/15 dark:bg-primary-dark/15 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-primary/20 dark:bg-primary-dark/20 rounded-xl w-24"></div>
                </div>

                <div className="space-y-4">
                  <div className="h-4 bg-primary/20 dark:bg-primary-dark/20 rounded"></div>
                  <div className="h-4 bg-primary/20 dark:bg-primary-dark/20 rounded w-5/6"></div>
                  <div className="h-4 bg-primary/20 dark:bg-primary-dark/20 rounded w-4/6"></div>
                </div>

                <div className="flex space-x-4">
                  <div className="h-10 bg-primary/15 dark:bg-primary-dark/15 rounded-xl w-20"></div>
                  <div className="h-10 bg-primary/15 dark:bg-primary-dark/15 rounded-xl w-20"></div>
                  <div className="h-10 bg-primary/15 dark:bg-primary-dark/15 rounded-xl w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  if (isFetching) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-primary/5 dark:from-bg-dark dark:via-bg-dark dark:to-primary-dark/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Messages */}
        <div className="mb-6 space-y-4">
          {isError && (
            <AlertMessage
              type="error"
              message={error.message}
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
        </div>

        {/* Main Content */}
        {postData?.post && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 shadow-2xl">
              <div className="aspect-video md:aspect-[21/9] relative">
                <img
                  src={postData.post.image?.path}
                  alt="Post cover"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Floating Action Buttons */}
                <div className="absolute top-6 right-6 flex space-x-3">
                  <Button
                    size="icon"
                    className="h-12 w-12 bg-bg/20 dark:bg-bg-dark/20 backdrop-blur-md border border-white/20 hover:bg-bg/30 dark:hover:bg-bg-dark/30 rounded-2xl transition-all duration-300 hover:scale-110"
                  >
                    <Share2 className="h-5 w-5 text-white" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-12 w-12 bg-bg/20 dark:bg-bg-dark/20 backdrop-blur-md border border-white/20 hover:bg-bg/30 dark:hover:bg-bg-dark/30 rounded-2xl transition-all duration-300 hover:scale-110"
                  >
                    <Bookmark className="h-5 w-5 text-white" />
                  </Button>
                </div>

                {/* Post Stats Overlay */}
                <div className="absolute bottom-6 left-6 flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-bg/20 dark:bg-bg-dark/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                    <Eye className="h-4 w-4 text-white" />
                    <span className="text-white font-medium text-sm">
                      {postData.post.viewers?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-bg/20 dark:bg-bg-dark/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                    <Heart className="h-4 w-4 text-white" />
                    <span className="text-white font-medium text-sm">
                      {postData.post.likes?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-bg/20 dark:bg-bg-dark/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                    <MessageCircle className="h-4 w-4 text-white" />
                    <span className="text-white font-medium text-sm">
                      {postData.post.comments?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <Card className="bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-sm border border-primary/20 dark:border-primary-dark/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-6 md:p-8">
                {/* Author Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-4 ring-primary/20 dark:ring-primary-dark/20 shadow-xl">
                        <AvatarImage
                          src={postData.post.author?.profilePicture}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-bg dark:text-bg-dark font-bold text-xl">
                          {postData.post.author?.username
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent dark:bg-accent-dark rounded-full border-3 border-bg dark:border-bg-dark flex items-center justify-center">
                        <div className="w-2 h-2 bg-bg dark:bg-bg-dark rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text dark:text-text-dark">
                        {postData.post.author?.username}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark border-primary/30 dark:border-primary-dark/30 text-xs">
                          Author
                        </Badge>
                        <div className="flex items-center text-text/60 dark:text-text-dark/60 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(
                            postData.post.createdAt
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {isFollowing ? (
                      <Button
                        onClick={unFollowUserHandle}
                        variant="outline"
                        className="bg-primary/10 dark:bg-primary-dark/10 border-primary/30 dark:border-primary-dark/30 text-primary dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/20 rounded-xl transition-all duration-300"
                        disabled={unFollowUserMutation.isPending}
                      >
                        <RiUserUnfollowFill className="mr-2 h-4 w-4" />
                        {unFollowUserMutation.isPending
                          ? "Unfollowing..."
                          : "Following"}
                      </Button>
                    ) : (
                      <Button
                        onClick={followUserHandle}
                        className="bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark hover:from-primary/90 hover:to-secondary/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 text-bg dark:text-bg-dark rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        disabled={followUserMutation.isPending}
                      >
                        <RiUserFollowLine className="mr-2 h-4 w-4" />
                        {followUserMutation.isPending
                          ? "Following..."
                          : "Follow"}
                      </Button>
                    )}
                  </div>
                </div>

                <Separator className="mb-8 bg-gradient-to-r from-transparent via-primary/20 dark:via-primary-dark/20 to-transparent" />

                {/* Post Content */}
                <div className="prose prose-lg max-w-none mb-8">
                  <div
                    className="rendered-html-content text-text dark:text-text-dark leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: postData.post.description,
                    }}
                  />
                </div>

                {/* Interaction Buttons */}
                <div className="flex flex-wrap items-center gap-4 mb-8 p-6 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5 rounded-2xl border border-primary/10 dark:border-primary-dark/10">
                  <Button
                    variant="ghost"
                    onClick={likePostHandle}
                    disabled={likePostMutation.isPending}
                    className="group flex items-center space-x-2 px-6 py-3 bg-primary/10 dark:bg-primary-dark/10 hover:bg-primary/20 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <ThumbsUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      {postData.post.likes?.length || 0}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={dislikePostHandle}
                    disabled={dislikePostMutation.isPending}
                    className="group flex items-center space-x-2 px-6 py-3 bg-secondary/10 dark:bg-secondary-dark/10 hover:bg-secondary/20 dark:hover:bg-secondary-dark/20 text-secondary dark:text-secondary-dark rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <ThumbsDown className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      {postData.post.dislikes?.length || 0}
                    </span>
                  </Button>

                  <div className="flex items-center space-x-2 px-6 py-3 bg-accent/10 dark:bg-accent-dark/10 text-accent dark:text-accent-dark rounded-xl">
                    <Eye className="h-5 w-5" />
                    <span className="font-medium">
                      {postData.post.viewers?.length || 0}
                    </span>
                  </div>
                </div>

                <Separator className="mb-8 bg-gradient-to-r from-transparent via-primary/20 dark:via-primary-dark/20 to-transparent" />

                {/* Comments Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary/10 dark:bg-primary-dark/10 rounded-2xl">
                      <MessageCircle className="h-6 w-6 text-primary dark:text-primary-dark" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-text dark:text-text-dark">
                      Comments ({postData.post.comments?.length || 0})
                    </CardTitle>
                  </div>

                  {/* Add Comment Form */}
                  <Card className="bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5 border border-primary/20 dark:border-primary-dark/20 rounded-2xl">
                    <CardContent className="p-6">
                      <form
                        onSubmit={formik.handleSubmit}
                        className="space-y-4"
                      >
                        <Textarea
                          placeholder="Share your thoughts..."
                          rows={4}
                          className="w-full bg-bg dark:bg-bg-dark border border-primary/30 dark:border-primary-dark/30 text-text dark:text-text-dark rounded-xl focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 transition-all duration-300 resize-none"
                          {...formik.getFieldProps("comment")}
                        />
                        {formik.touched.comment && formik.errors.comment && (
                          <div className="text-secondary dark:text-secondary-dark text-sm font-medium">
                            {formik.errors.comment}
                          </div>
                        )}
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={commentMutation.isPending}
                            className="bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark hover:from-primary/90 hover:to-secondary/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 text-bg dark:text-bg-dark rounded-xl px-8 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            {commentMutation.isPending ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-bg/30 dark:border-bg-dark/30 border-t-bg dark:border-t-bg-dark mr-2"></div>
                                Posting...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Post Comment
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {postData.post.comments?.length > 0 ? (
                      postData.post.comments.map((comment, index) => (
                        <Card
                          key={index}
                          className="bg-bg/50 dark:bg-bg-dark/50 backdrop-blur-sm border border-primary/10 dark:border-primary-dark/10 rounded-2xl hover:bg-bg/70 dark:hover:bg-bg-dark/70 transition-all duration-300"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-12 w-12 ring-2 ring-primary/20 dark:ring-primary-dark/20">
                                <AvatarImage
                                  src={comment.author?.profilePicture}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 text-text dark:text-text-dark font-semibold">
                                  {comment.author?.username
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-text dark:text-text-dark">
                                    {comment.author?.username}
                                  </span>
                                  <div className="flex items-center text-text/60 dark:text-text-dark/60 text-xs">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                                <p className="text-text dark:text-text-dark leading-relaxed">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="p-6 bg-primary/5 dark:bg-primary-dark/5 rounded-2xl border border-primary/10 dark:border-primary-dark/10 max-w-md mx-auto">
                          <MessageCircle className="h-12 w-12 text-primary/40 dark:text-primary-dark/40 mx-auto mb-4" />
                          <p className="text-text/60 dark:text-text-dark/60 text-lg font-medium">
                            No comments yet
                          </p>
                          <p className="text-text/50 dark:text-text-dark/50 text-sm mt-2">
                            Be the first to share your thoughts!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
