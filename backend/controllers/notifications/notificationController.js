import expressAsyncHandler from "express-async-handler";
import Notification from "../../models/Notification/Notification.model.js";
import mongoose from "mongoose";

const notificationController = {
  //* List All Notifications
  listAllNotifications: expressAsyncHandler(async (req, res) => {
    const notifications = await Notification.find();

    res.status(200).json({
      status: "success",
      message: "Notifications retrieved successfully",
      notifications,
    });
  }),

  //* Read Notification
  readNotification: expressAsyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(notificationId);
    if (!isValidId) {
      throw new Error("Invalid notification ID");
    }
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      throw new Error("Notification not found");
    }
    res.status(200).json({
      status: "success",
      message: "Notification read successfully",
      notification,
    });
  }),
};

export default notificationController;
