import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { logOutAPI } from "../../APIservices/users/userAPI";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlices";
import NotificationCounts from "../notifications/NotificationCounts";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function PrivateNavbar() {
  const dispatch = useDispatch();
  const logOutMutation = useMutation({
    mutationKey: ["logout-user"],
    mutationFn: logOutAPI,
  });
  const logoutHandler = async () => {
    logOutMutation
      .mutateAsync()
      .then(() => {
        dispatch(logoutUser(null));
      })
      .catch((error) => console.log(error));
  };
  return (
    <Disclosure as="nav" className="bg-bg dark:bg-bg-dark">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-start items-center">
              <div className="flex justify-center flex-row w-full">
                <div className="-ml-2 mr-2 flex items-left md:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary-dark">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    to="/posts"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-text dark:text-text-dark hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Latest Posts
                  </Link>
                  {/* Similar for other links */}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Button
                    onClick={logoutHandler}
                    variant="destructive"
                    className="relative m-2 inline-flex items-center gap-x-1.5 rounded-md bg-primary dark:bg-primary-dark px-3 py-2 text-sm font-semibold text-text dark:text-text-dark shadow-sm hover:bg-accent dark:hover:bg-accent-dark"
                  >
                    <IoLogOutOutline className="h-5 w-5" aria-hidden="true" />
                  </Button>
                  <Link to="/dashboard">
                    <Button className="relative mr-1 inline-flex items-center gap-x-1.5 rounded-md bg-secondary dark:bg-secondary-dark px-3 py-2 text-sm font-semibold text-text dark:text-text-dark shadow-sm hover:bg-accent dark:hover:bg-accent-dark">
                      <MdOutlineDashboard />
                      Dashboard
                    </Button>
                  </Link>
                  <NotificationCounts />
                </div>
                <div className="hidden md:ml-1 md:flex md:flex-shrink-0 md:items-center">
                  <Menu as="div" className="relative ml-1">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-bg dark:bg-bg-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <Avatar>
                          <AvatarImage src="profile-pic-url" />
                          <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-bg dark:bg-bg-dark py-1 shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard/settings"
                              className={classNames(
                                active ? "bg-gray-100 dark:bg-gray-700" : "",
                                "block px-4 py-2 text-sm text-text dark:text-text-dark"
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logoutHandler}
                              className={classNames(
                                active ? "bg-gray-100 dark:bg-gray-700" : "",
                                "block px-4 py-2 text-sm text-text dark:text-text-dark"
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="md:hidden bg-bg dark:bg-bg-dark">
            {/* Mobile panel content */}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
