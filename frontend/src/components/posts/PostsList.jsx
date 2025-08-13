import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { deletePostAPI, getAllPostsAPI } from "../../APIservices/posts/postAPI";
import { Link } from "react-router-dom";
import "./postStyle.css";
import NoDataFound from "../alerts/NoDataFound";
import AlertMessage from "../alerts/AlertMessage";
import { getAllCategoriesAPI } from "../../APIservices/category/categoryAPI";
import PostCategory from "../category/PostCategory";
import { FaSearch } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import truncateString from "../../utils/truncateString";

const PostsList = () => {
  //* Filtering
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const {
    isError,
    isFetching,
    data: postsData,
    error,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["list-posts", { ...filters, page }],
    queryFn: () =>
      getAllPostsAPI({ ...filters, title: searchQuery, page, limit: 10 }),
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

  //* Category hilter handler
  const handleCategoryFilter = (categoryId) => {
    setFilters({ ...filters, category: categoryId });
    setPage(1);
    refetch();
  };
  //* Search handler
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  //* Submit search handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...filters, title: searchQuery });
    setPage(1);
    refetch();
  };
  //* Page change handler
  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  };
  //* Clear filters handler
  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setPage(1);
    refetch();
  };

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

  console.log("Posts Data:", postsData);

  return (
    <section className="overflow-hidden">
      <div className="container px-4 mx-auto">
        <h1 className="text-4xl lg:text-6xl font-bold font-heading mb-6 mt-16">
          Blog
        </h1>
        {/* Searching */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-center gap-2 mb-4"
        >
          <div className="flex-grow flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-grow p-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 text-white bg-orange-500 hover:bg-blue-600 rounded-r-lg"
            >
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={clearFilters}
            className="p-2 text-sm text-orange-500 border border-blue-500 rounded-lg hover:bg-blue-100 flex items-center gap-1"
          >
            <MdClear className="h-4 w-4" />
            Clear Filters
          </button>
        </form>
        {/* Show No data found */}
        {postsData?.posts?.length <= 0 && <NoDataFound text="No posts found" />}
        {/* Show error message if any */}
        {isError && <AlertMessage type="error" message={error.message} />}
        {/* Show Loading message */}
        {isFetching && (
          <AlertMessage type="loading" message="Loading posts..." />
        )}
        {isSuccess && !isFetching && (
          <AlertMessage type="success" message="Posts loaded successfully!" />
        )}
        {/* featured post */}
        {/* <FeaturedPost post={featuredPost} /> */}
        <h2 className="text-4xl font-bold font-heading mb-10">
          Latest articles
        </h2>
        {/* Post category */}
        <PostCategory
          categories={categoriesData}
          onCategorySelect={handleCategoryFilter}
          onClearFilters={clearFilters}
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
                        __html: truncateString(post?.description, 200),
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
      <div className="flex justify-center items-center my-8 space-x-4">
        {page > 1 && (
          <button
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            Previous
          </button>
        )}

        <span className="text-sm font-semibold">
          Page {page} of {postsData?.totalPages}
        </span>

        {page < postsData?.totalPages && (
          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            Next
          </button>
        )}
      </div>
    </section>
  );
};

export default PostsList;
