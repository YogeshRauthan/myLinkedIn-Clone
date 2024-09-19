import Notification from "../models/notification-model.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content image");

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getUserNotifications controller: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json(notification);
  } catch (error) {
    console.log("Error in markNotificationAsRead controller: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteNotification controller: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
