import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaComment,
} from "react-icons/fa";
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

const PostDetails = () => {
  const [comment, setComment] = useState("");

  //* Get the postId from the URL params
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

  //* Get the profile details

  const { data: profileData, refetch } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userProfileAPI(),
  });

  //* Get the user data from the profile
  const userID = profileData?.user?._id;

  // console.log("Post Data:", postData);

  const userToFollowUnfollow = postData?.post?.author;

  // console.log("User to Follow:", userToFollowUnfollow, "User ID:", userID);

  //* Check if the user is already following the author
  const isFollowing = profileData?.user?.following?.find(
    (user) => user?.toString() === userToFollowUnfollow?.toString()
  );

  console.log("Is Following:", isFollowing);

  //* Follow and Unfollow mutations
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

  //* Like and Dislike mutations
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

  // console.log("Post : ", postData?.post);
  // console.log("Post Dislikes : ", postData?.post?.dislikes?.length);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-5">
        <img
          src={postData?.post?.image?.path}
          //TODO : Add Alt Text to the image
          // alt
          // alt={postData?._id}
          className="w-full h-full object-cover rounded-lg mb-4"
        />
        {/* Show messages */}

        <div className="flex gap-4 items-center mb-4">
          {/* like icon */}
          <span
            className="flex items-center gap-1 cursor-pointer"
            onClick={likePostHandle}
          >
            <FaThumbsUp />
            {postData?.post?.likes?.length || 0}
          </span>

          {/* Dislike icon */}
          <span
            className="flex items-center gap-1 cursor-pointer"
            onClick={dislikePostHandle}
          >
            <FaThumbsDown />

            {postData?.post?.dislikes?.length || 0}
          </span>
          {/* views icon */}
          <span className="flex items-center gap-1">
            <FaEye />
            {postData?.post?.viewsCount || 0}
          </span>
        </div>
        {/* follow icon */}

        {isFollowing ? (
          <button
            onClick={unFollowUserHandle}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <RiUserUnfollowFill className="mr-2" />
            Unfollow
          </button>
        ) : (
          <button
            onClick={followUserHandle}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Follow
            <RiUserFollowLine className="ml-2" />
          </button>
        )}

        {/* author */}
        <span className="ml-2">{/* {postData?.author?.username} */}</span>

        {/* post details */}
        <div className="flex justify-between items-center mb-3">
          <div
            className="rendered-html-content mb-2"
            dangerouslySetInnerHTML={{ __html: postData?.post?.description }}
          />

          {/* Edit delete icon */}
          <div className="flex gap-2">
            <FaEdit className="text-blue-500 cursor-pointer" />
            <FaTrashAlt className="text-red-500 cursor-pointer" />
          </div>
        </div>

        {/* Comment Form */}
        <form>
          <textarea
            className="w-full border border-gray-300 p-2 rounded-lg mb-2"
            rows="3"
            placeholder="Add a comment..."
            value={comment}
            // onChange={(e) => setComment(e.target.value)}
            // {...formik.getFieldProps("content")}
          ></textarea>
          {/* comment error */}
          {/* {formik.touched.content && formik.errors.content && (
            <div className="text-red-500 mb-4 mt-1">
              {formik.errors.content}
            </div>
          )} */}
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            <FaComment className="inline mr-1" /> Comment
          </button>
        </form>
        {/* Comments List */}
        <div>
          <h2 className="text-xl font-bold mb-2">Comments:</h2>
          {/* {postData?.comments?.map((comment, index) => (
            <div key={index} className="border-b border-gray-300 mb-2 pb-2">
              <p className="text-gray-800">{comment.content}</p>
              <span className="text-gray-600 text-sm">
                - {comment.author?.username}
              </span>
              <small className="text-gray-600 text-sm ml-2">
                {new Date(comment.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
