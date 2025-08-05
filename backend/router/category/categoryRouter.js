import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import categoryController from "../../controllers/categories/categoryController.js";

//* Instance of express router
const categoryRouter = express.Router();

//* Create Category
categoryRouter.post(
  "/create",
  isAuthenticated,
  categoryController.createCategory
);

//* List All Categories
categoryRouter.get("/", categoryController.listAllCategories);

//* Update Category
categoryRouter.put(
  "/:categoryId",
  isAuthenticated,
  categoryController.updateCategory
);

//* Get Category
categoryRouter.get("/:categoryId", categoryController.getCategory);

//* Delete Category
categoryRouter.delete(
  "/:categoryId",
  isAuthenticated,
  categoryController.deleteCategory
);

export default categoryRouter;
