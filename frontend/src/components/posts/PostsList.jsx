import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { deletePostAPI, getAllPostsAPI } from "../../APIservices/posts/postAPI";
import { Link } from "react-router-dom";
import "./postStyle.css";
import NoDataFound from "../alerts/NoDataFound";
import AlertMessage from "../alerts/AlertMessage";
import { getAllCategoriesAPI } from "../../APIservices/category/categoryAPI";
import PostCategory from "../category/PostCategory";
import { FaSearch, FaEye, FaHeart, FaComment } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import truncateString from "../../utils/truncateString";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Calendar,
  User,
  TrendingUp,
  BookOpen,
  Sparkles,
  Filter,
  Grid,
} from "lucide-react";

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

  // Loading skeleton component
  const PostSkeleton = () => (
    <Card className="bg-bg dark:bg-bg-dark border border-primary/10 dark:border-primary-dark/10 overflow-hidden animate-pulse">
      <CardHeader className="p-0">
        <div className="h-48 sm:h-56 bg-primary/10 dark:bg-primary-dark/10 animate-pulse"></div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-primary/20 dark:bg-primary-dark/20 rounded animate-pulse"></div>
          <div className="h-4 bg-primary/20 dark:bg-primary-dark/20 rounded w-3/4 animate-pulse"></div>
          <div className="flex justify-between items-center">
            <div className="h-3 bg-primary/15 dark:bg-primary-dark/15 rounded w-24 animate-pulse"></div>
            <div className="h-6 bg-primary/15 dark:bg-primary-dark/15 rounded-full w-16 animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-bg via-bg to-primary/5 dark:from-bg-dark dark:via-bg-dark dark:to-primary-dark/5">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="relative pt-16 pb-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5 rounded-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary-dark/20 dark:to-secondary-dark/20 rounded-2xl">
                <BookOpen className="h-8 w-8 text-primary dark:text-primary-dark" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading mb-4 bg-gradient-to-r from-primary via-secondary to-accent dark:from-primary-dark dark:via-secondary-dark dark:to-accent-dark bg-clip-text text-transparent">
              Discover Articles
            </h1>
            <p className="text-lg text-text/70 dark:text-text-dark/70 max-w-2xl mx-auto">
              Explore insightful articles and stay updated with the latest
              knowledge from our community
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <Card className="bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-sm border border-primary/20 dark:border-primary-dark/20 shadow-lg">
            <CardContent className="p-6">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row items-center gap-4 mb-6"
              >
                <div className="relative flex-grow w-full">
                  <Input
                    type="text"
                    placeholder="Search for articles, topics, or authors..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-12 pr-4 py-3 text-sm bg-bg dark:bg-bg-dark text-text dark:text-text-dark border border-primary/30 dark:border-primary-dark/30 rounded-xl focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 transition-all duration-300"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60 dark:text-primary-dark/60" />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark hover:from-primary/90 hover:to-secondary/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 text-bg dark:text-bg-dark rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaSearch className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full sm:w-auto text-primary dark:text-primary-dark border-primary/30 dark:border-primary-dark/30 hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                  <MdClear className="h-4 w-4" />
                  Clear Filters
                </Button>
              </form>

              {/* Categories */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary dark:text-primary-dark" />
                  <span className="text-sm font-medium text-text dark:text-text-dark">
                    Categories:
                  </span>
                </div>
              </div>
              <PostCategory
                categories={categoriesData}
                onCategorySelect={handleCategoryFilter}
                onClearFilters={clearFilters}
              />
            </CardContent>
          </Card>
        </div>

        {/* Status Messages */}
        {isError && (
          <div className="mb-6">
            <AlertMessage
              type="error"
              message={error.message}
              bg-primary
              text-text
            />
          </div>
        )}

        {isFetching && (
          <div className="mb-6">
            <AlertMessage
              type="loading"
              message="Loading articles..."
              bg-primary
              text-text
            />
          </div>
        )}

        {isSuccess && !isFetching && postsData?.posts?.length > 0 && (
          <div className="mb-6">
            <AlertMessage
              type="success"
              message="Articles loaded successfully!"
              bg-primary
              text-text
            />
          </div>
        )}

        {/* No Data Found */}
        {postsData?.posts?.length <= 0 && !isFetching && (
          <div className="text-center py-16">
            <NoDataFound text="No articles found" />
          </div>
        )}

        {/* Posts Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Grid className="h-5 w-5 text-primary dark:text-primary-dark" />
              <h2 className="text-2xl sm:text-3xl font-bold text-text dark:text-text-dark">
                Latest Articles
              </h2>
              {postsData?.totalPosts && (
                <Badge className="bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark border-primary/30 dark:border-primary-dark/30">
                  {postsData.totalPosts} articles
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-text/60 dark:text-text-dark/60">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Trending</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {isFetching
              ? Array.from({ length: 6 }).map((_, index) => (
                  <PostSkeleton key={index} />
                ))
              : postsData?.posts?.map((post) => (
                  <Card
                    key={post._id}
                    className="group bg-bg/90 dark:bg-bg-dark/90 backdrop-blur-sm border border-primary/10 dark:border-primary-dark/10 hover:border-primary/30 dark:hover:border-primary-dark/30 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1"
                  >
                    <CardHeader className="p-0 relative">
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <img
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src={post?.image?.path}
                          alt={post?.title || "Article image"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-bg/90 dark:bg-bg-dark/90 backdrop-blur-sm text-text dark:text-text-dark border-primary/20 dark:border-primary-dark/20">
                            {post?.category?.categoryName}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <div className="flex items-center gap-4 text-white text-sm">
                            <div className="flex items-center gap-1">
                              <FaEye className="h-4 w-4" />
                              <span>{post?.viewers?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaHeart className="h-4 w-4" />
                              <span>{post?.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaComment className="h-4 w-4" />
                              <span>{post?.comments?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <Link to={`/post/${post._id}`} className="block">
                        <div className="space-y-4">
                          {/* Author Info */}
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={post?.author?.profilePicture} />
                              <AvatarFallback className="bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark text-sm">
                                {post?.author?.username
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-text dark:text-text-dark">
                                {post?.author?.username}
                              </p>
                              <p className="text-xs text-text/60 dark:text-text-dark/60">
                                Author
                              </p>
                            </div>
                          </div>

                          <Separator className="bg-primary/10 dark:bg-primary-dark/10" />

                          {/* Content */}
                          <div
                            className="rendered-html-content text-text dark:text-text-dark line-clamp-3 group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-300"
                            dangerouslySetInnerHTML={{
                              __html: truncateString(post?.description, 120),
                            }}
                          />

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 text-xs text-text/60 dark:text-text-dark/60">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-text/60 dark:text-text-dark/60">
                              <div className="flex items-center gap-1">
                                <FaEye className="h-3 w-3" />
                                <span>{post?.viewers?.length || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaHeart className="h-3 w-3" />
                                <span>{post?.likes?.length || 0}</span>
                              </div>
                            </div>
                          </div>

                          {/* Read More Indicator */}
                          <div className="flex items-center justify-end mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="text-sm text-primary dark:text-primary-dark font-medium flex items-center gap-1">
                              Read more
                              <Sparkles className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>

        {/* Pagination */}
        {postsData?.totalPages > 1 && (
          <div className="flex justify-center py-8">
            <div className="bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-sm rounded-2xl p-4 border border-primary/20 dark:border-primary-dark/20 shadow-lg">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                        className="text-primary dark:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded-xl"
                      />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      isActive
                      className="bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-bg dark:text-bg-dark rounded-xl"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                  {page < postsData?.totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(page + 1)}
                        className="text-primary dark:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded-xl"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PostsList;
