import { useQuery } from "@tanstack/react-query";
import React from "react";
import { IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import { fetchNotificationsAPI } from "../../APIservices/notifications/notificationAPI";
// import { fetchNotificationsAPI } from "../../APIServices/notifications/nofitificationsAPI";
const NotificationCounts = () => {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationsAPI,
  });

  //   console.log(data);

  //filter unread notifications
  const unreadNotifications = data?.notifications?.filter(
    (notification) => notification?.isRead === false
  );

  console.log(unreadNotifications);

  return (
    <Link to="/dashboard/notifications">
      <div className="relative inline-block">
        <IoMdNotifications className="text-2xl text-gray-700" />{" "}
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full -translate-y-1/3 translate-x-1/3">
          {unreadNotifications?.length || 0}
        </span>
      </div>
    </Link>
  );
};

export default NotificationCounts;
