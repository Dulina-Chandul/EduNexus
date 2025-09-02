import { useMutation } from "@tanstack/react-query";
import React from "react";
import * as Yup from "yup";
import { createCategoryAPI } from "../../APIservices/category/categoryAPI";
import { useFormik } from "formik";
import AlertMessage from "../alerts/AlertMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Tag, Sparkles } from "lucide-react";

const AddCategory = () => {
  //* Category Mutation
  const categoryMutation = useMutation({
    mutationKey: ["create-category"],
    mutationFn: createCategoryAPI,
  });

  const formik = useFormik({
    initialValues: {
      categoryName: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required("Category Name is required"),
    }),
    onSubmit: (values) => {
      categoryMutation.mutate(values);
    },
  });

  //* Get Loading State
  const isLoading = categoryMutation.isPending;

  //* Get Error State
  const isError = categoryMutation.isError;

  //* Get Success State
  const isSuccess = categoryMutation.isSuccess;

  //* Error
  const error = categoryMutation.error;

  //* Error message
  const errorMessage = categoryMutation?.error?.response?.data?.message;

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 dark:from-primary-dark/20 dark:via-primary-dark/10 dark:to-secondary-dark/20 p-8 border border-primary/20 dark:border-primary-dark/20">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 dark:from-primary-dark/20 dark:via-primary-dark/10 dark:to-secondary-dark/20"></div>
        <div className="relative">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary/20 dark:bg-primary-dark/20 rounded-xl">
              <Tag className="h-8 w-8 text-primary dark:text-primary-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text dark:text-text-dark">
                Add New Category
                <Sparkles className="inline h-6 w-6 ml-2 text-accent dark:text-accent-dark" />
              </h1>
              <p className="text-text/70 dark:text-text-dark/70 mt-1">
                Create a new category to organize your content
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="bg-bg dark:bg-bg-dark border-primary/10 dark:border-primary-dark/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-text dark:text-text-dark flex items-center">
            <Plus className="h-6 w-6 mr-2 text-primary dark:text-primary-dark" />
            Category Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Alert Messages */}
            {isLoading && (
              <div className="p-4 bg-accent/10 dark:bg-accent-dark/10 border border-accent/20 dark:border-accent-dark/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent dark:border-accent-dark"></div>
                  <span className="text-accent dark:text-accent-dark font-medium">
                    Creating Category...
                  </span>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-green-700 dark:text-green-400 font-medium">
                    Category created successfully!
                  </span>
                </div>
              </div>
            )}

            {isError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span className="text-red-700 dark:text-red-400 font-medium">
                    {errorMessage}
                  </span>
                </div>
              </div>
            )}

            {/* Category Name Input */}
            <div className="space-y-3">
              <Label
                htmlFor="categoryName"
                className="text-text dark:text-text-dark font-medium text-sm"
              >
                Category Name
              </Label>
              <div className="relative">
                <Input
                  id="categoryName"
                  type="text"
                  {...formik.getFieldProps("categoryName")}
                  className={`w-full h-14 px-6 text-base bg-bg dark:bg-bg-dark border-2 transition-all duration-300 rounded-xl focus:ring-4 focus:ring-primary/20 dark:focus:ring-primary-dark/20 ${
                    formik.touched.categoryName && formik.errors.categoryName
                      ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
                      : "border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark hover:border-primary/40 dark:hover:border-primary-dark/40"
                  }`}
                  placeholder="Enter category name (e.g., Technology, Education, Sports)"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                  <Tag className="h-5 w-5 text-text/40 dark:text-text-dark/40" />
                </div>
              </div>
              {formik.touched.categoryName && formik.errors.categoryName && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm mt-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span>{formik.errors.categoryName}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary via-primary to-secondary dark:from-primary-dark dark:via-primary-dark dark:to-secondary-dark hover:from-primary/90 hover:via-primary/90 hover:to-secondary/90 dark:hover:from-primary-dark/90 dark:hover:via-primary-dark/90 dark:hover:to-secondary-dark/90 text-bg dark:text-bg-dark border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-bg dark:border-bg-dark"></div>
                  <span>Creating Category...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Category</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-accent/5 via-transparent to-primary/5 dark:from-accent-dark/5 dark:to-primary-dark/5 border-accent/20 dark:border-accent-dark/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-accent/20 dark:bg-accent-dark/20 rounded-lg flex-shrink-0">
              <Sparkles className="h-5 w-5 text-accent dark:text-accent-dark" />
            </div>
            <div>
              <h3 className="font-semibold text-text dark:text-text-dark mb-2">
                💡 Tips for Creating Categories
              </h3>
              <ul className="text-sm text-text/70 dark:text-text-dark/70 space-y-1">
                <li>
                  • Choose clear, descriptive names that are easy to understand
                </li>
                <li>• Keep category names concise but specific</li>
                <li>• Consider how users will search for and filter content</li>
                <li>• Use consistent naming conventions across categories</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
