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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PostsList = () => {
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
  const { data: categoriesData } = useQuery({
    queryKey: ["category-list"],
    queryFn: getAllCategoriesAPI,
  });
  const handleCategoryFilter = (categoryId) => {
    setFilters({ ...filters, category: categoryId });
    setPage(1);
    refetch();
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...filters, title: searchQuery });
    setPage(1);
    refetch();
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  };
  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setPage(1);
    refetch();
  };
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
  return (
    <section className="overflow-hidden">
      <div className="container px-4 mx-auto">
        <h1 className="text-4xl lg:text-6xl font-bold font-heading mb-6 mt-16 text-primary dark:text-primary-dark">
          Blog
        </h1>
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-center gap-2 mb-4"
        >
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-2 text-sm bg-bg dark:bg-bg-dark text-text dark:text-text-dark border border-gray-300 dark:border-gray-600 rounded-lg"
            />
            <Button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-primary dark:bg-primary-dark hover:bg-accent dark:hover:bg-accent-dark rounded-r-lg"
            >
              <FaSearch className="h-5 w-5 text-text dark:text-text-dark" />
            </Button>
          </div>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="text-primary dark:text-primary-dark border-primary dark:border-primary-dark hover:bg-accent dark:hover:bg-accent-dark flex items-center gap-1"
          >
            <MdClear className="h-4 w-4" />
            Clear Filters
          </Button>
        </form>
        {postsData?.posts?.length <= 0 && <NoDataFound text="No posts found" />}
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
            message="Loading posts..."
            bg-primary
            text-text
          />
        )}
        {isSuccess && !isFetching && (
          <AlertMessage
            type="success"
            message="Posts loaded successfully!"
            bg-primary
            text-text
          />
        )}
        <h2 className="text-4xl font-bold font-heading mb-10 text-text dark:text-text-dark">
          Latest articles
        </h2>
        <PostCategory
          categories={categoriesData}
          onCategorySelect={handleCategoryFilter}
          onClearFilters={clearFilters}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {postsData?.posts?.map((post) => (
            <Card
              key={post._id}
              className="bg-bg dark:bg-bg-dark border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary-dark transition duration-200 rounded-2xl overflow-hidden"
            >
              <CardHeader className="p-0">
                <div className="relative h-60">
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src={post?.image?.path}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <Link to={`/post/${post._id}`}>
                  <div
                    className="rendered-html-content mb-2 text-text dark:text-text-dark"
                    dangerouslySetInnerHTML={{
                      __html: truncateString(post?.description, 200),
                    }}
                  />
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                    <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500" />
                    <span className="py-1 px-2 rounded-md border border-gray-200 dark:border-gray-600">
                      {post?.category?.categoryName}
                    </span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Pagination className="justify-center my-8">
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                className="text-primary dark:text-primary-dark hover:bg-accent dark:hover:bg-accent-dark"
              />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          {page < postsData?.totalPages && (
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                className="text-primary dark:text-primary-dark hover:bg-accent dark:hover:bg-accent-dark"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </section>
  );
};
export default PostsList;
