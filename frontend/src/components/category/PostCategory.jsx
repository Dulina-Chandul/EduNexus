import React from "react";
import { Button } from "@/components/ui/button";

const PostCategory = ({ categories, onCategorySelect, onClearFilters }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="h-10 w-full sm:w-auto text-sm font-semibold bg-bg dark:bg-bg-dark border border-gray-200 dark:border-gray-600 text-text dark:text-text-dark hover:bg-accent dark:hover:bg-accent-dark transition duration-200 rounded-full"
      >
        All Articles
      </Button>
      {categories?.categories?.map((category) => (
        <Button
          key={category._id}
          variant="outline"
          onClick={() => onCategorySelect(category._id)}
          className="h-10 w-full sm:w-auto text-sm font-semibold bg-bg dark:bg-bg-dark border border-gray-200 dark:border-gray-600 text-text dark:text-text-dark hover:bg-accent dark:hover:bg-accent-dark transition duration-200 rounded-full"
        >
          {category.categoryName} ({category.posts?.length})
        </Button>
      ))}
    </div>
  );
};

export default PostCategory;
