import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { deletePostAPI, getAllPostsAPI } from "../../APIservices/posts/postAPI";
import { Link } from "react-router-dom";
import "./postStyle.css";
import NoDataFound from "../alerts/NoDataFound";
import AlertMessage from "../alerts/AlertMessage";
import { getAllCategoriesAPI } from "../../APIservices/category/categoryAPI";
import PostCategory from "../category/PostCategory";
const PostsList = () => {
  const {
    isError,
    isFetching,
    data: postsData,
    error,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["list-posts"],
    queryFn: getAllPostsAPI,
  });

  const postMutation = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: deletePostAPI,
  });

  //* Get all the categories from the database

  const { data: categoriesData } = useQuery({
    queryKey: ["category-list"],
    queryFn: getAllCategoriesAPI,
  });

  //* Delete Post Handler
  const deletePostHandler = async (postId) => {
    postMutation
      .mutateAsync(postId)
      .then(() => {
        refetch();
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  //* Handle loading, error, and success states

  //* Check if data is still being fetched
  if (isFetching)
    return <AlertMessage type="loading" message="Loading posts..." />;

  //* Check if there was an error fetching the data
  if (isError) return <AlertMessage type="error" message={error.message} />;

  //* No posts found
  if (postsData?.posts?.length <= 0) {
    return <NoDataFound text="No posts found" />;
  }

  console.log("Posts Data:", postsData);

  return (
    <section className="overflow-hidden">
      {isSuccess && (
        <AlertMessage type="success" message="Posts loaded successfully!" />
      )}
      <div className="container px-4 mx-auto">
        <h1 className="text-4xl lg:text-6xl font-bold font-heading mb-6 mt-16">
          Blog
        </h1>

        {/* featured post */}
        {/* <FeaturedPost post={featuredPost} /> */}
        <h2 className="text-4xl font-bold font-heading mb-10">
          Latest articles
        </h2>
        {/* Post category */}
        <PostCategory
          categories={categoriesData}
          // onCategorySelect={handleCategoryFilter}
        />
        <div className="flex flex-wrap mb-32 -mx-4">
          {/* Posts */}
          {postsData?.posts?.map((post) => (
            <div key={post._id} className="w-full md:w-1/2 lg:w-1/3 p-4">
              <Link to={`/post/${post._id}`}>
                <div className="bg-white border border-gray-100 hover:border-orange-500 transition duration-200 rounded-2xl h-full p-3">
                  <div className="relative" style={{ height: 240 }}>
                    <div className="absolute top-0 left-0 z-10"></div>
                    <div className="absolute bottom-0 right-0 z-10"></div>
                    <img
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                      src={post?.image?.path}
                      //TODO : Add Alt Text to the image
                      // alt
                    />
                  </div>
                  <div className="pt-6 pb-3 px-4">
                    <div
                      className="rendered-html-content mb-2"
                      dangerouslySetInnerHTML={{
                        __html: post?.description,
                      }}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-gray-500 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={4}
                        height={4}
                        viewBox="0 0 4 4"
                        fill="none"
                      >
                        <circle cx={2} cy={2} r={2} fill="#B8B8B8" />
                      </svg>
                      <div className="py-1 px-2 rounded-md border border-gray-100 text-xs font-medium text-gray-700 inline-block">
                        {post?.category?.categoryName}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center items-center my-8 space-x-4">
        {isPreviousButtonVisible && (
          <button
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            Previous
          </button>
        )}

        <span className="text-sm font-semibold">
          Page {page} of {postsData?.totalPages}
        </span>

        {isNextButtonVisible && (
          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            Next
          </button>
        )}
      </div> */}
    </section>
  );
};

export default PostsList;
