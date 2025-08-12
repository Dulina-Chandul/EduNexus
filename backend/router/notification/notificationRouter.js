import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import notificationController from "../../controllers/notifications/notificationController.js";

//* Instance of express router
const notificationRouter = express.Router();

//* List All Notifications
notificationRouter.get(
  "/",
  // isAuthenticated,
  notificationController.listAllNotifications
);

//* Read Notification
notificationRouter.put(
  "/:notificationId",
  // isAuthenticated,
  notificationController.readNotification
);

export default notificationRouter;
