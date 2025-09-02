import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { FiUserX, FiUserCheck } from "react-icons/fi";
import {
  listAllUsersAPI,
  toggleUserBlockStatusAPI,
} from "../../APIservices/users/userAPI";
import { BASE_URL } from "../../utils/baseEndPoint";

const Users = () => {
  const {
    data: users,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["list-all-users"],
    queryFn: listAllUsersAPI,
  });

  //* Toggle user mutation
  const mutation = useMutation({
    mutationKey: ["toggle-user-block"],
    mutationFn: toggleUserBlockStatusAPI,
  });

  const toggleUserBlocking = async (user) => {
    const actionURL = user.isBlocked
      ? `${BASE_URL}/users/unblock-user`
      : `${BASE_URL}/users/block-user`;

    const userId = user._id;
    const data = {
      actionURL,
      userId,
    };

    mutation
      .mutateAsync(data)
      .then(() => {
        refetch();
      })
      .catch((e) => console.log(e));
  };

  //   console.log("Users Data:", users);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Users List</h2>
      <div className="space-y-3 ">
        {users?.users?.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
          >
            <span className="font-medium">{user.username}</span>
            <button
              className={`flex items-center gap-2 p-2 rounded text-white ${
                user.isBlocked ? "bg-red-500" : "bg-green-500"
              }`}
              onClick={() => toggleUserBlocking(user)}
            >
              {user.isBlocked ? (
                <FiUserX className="text-xl" />
              ) : (
                <FiUserCheck className="text-xl" />
              )}
              {user.isBlocked ? "Unblock" : "Block"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
