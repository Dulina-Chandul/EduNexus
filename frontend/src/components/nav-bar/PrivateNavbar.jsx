import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { logOutAPI } from "../../APIservices/users/userAPI";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlices";
import { toggleTheme } from "../../redux/slices/themeSlices";
import NotificationCounts from "../notifications/NotificationCounts";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PrivateNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.mode);
  const userAuth = useSelector((state) => state.auth.userAuth);

  const logOutMutation = useMutation({
    mutationKey: ["logout-user"],
    mutationFn: logOutAPI,
  });

  const logoutHandler = async () => {
    logOutMutation
      .mutateAsync()
      .then(() => {
        dispatch(logoutUser(null));
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const navigation = [
    { name: "Latest Posts", href: "/posts" },
    { name: "About", href: "/about" },
    { name: "Contact US", href: "/contact" },
  ];

  return (
    <Disclosure
      as="nav"
      className="bg-bg dark:bg-bg-dark border-b border-primary/10 dark:border-primary-dark/10 backdrop-blur-lg sticky top-0 z-50"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Logo and Navigation */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="flex items-center space-x-2">


                    <img className="h-46 w-auto mt-3" src="/logo.png" alt="" />

                    {/* <span className="text-text dark:text-text-dark font-bold text-lg hidden sm:block">
                      Edu Nexus
                    </span> */}
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:ml-8 md:flex md:space-x-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="px-4 py-2 text-sm font-medium text-text dark:text-text-dark hover:text-primary dark:hover:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded-lg transition-all duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right side items */}
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleThemeToggle}
                  className="text-text dark:text-text-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10"
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </Button>

                {/* Notifications */}
                <NotificationCounts />

                {/* Dashboard Button */}
                <Link
                  to={
                    userAuth?.role === "student"
                      ? "/student-dashboard"
                      : "/dashboard"
                  }
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary dark:border-primary-dark text-primary dark:text-primary-dark hover:bg-primary dark:hover:bg-primary-dark hover:text-bg dark:hover:text-bg-dark transition-all duration-200"
                  >
                    <MdOutlineDashboard className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>

                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 p-1 rounded-full hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all duration-200">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAuth?.profilePicture} />
                      <AvatarFallback className="bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark text-xs">
                        {userAuth?.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-text dark:text-text-dark">
                        {userAuth?.username || "User"}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-secondary/20 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark"
                      >
                        {userAuth?.role || "Student"}
                      </Badge>
                    </div>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-bg dark:bg-bg-dark border border-primary/20 dark:border-primary-dark/20 shadow-lg ring-1 ring-black/5 dark:ring-white/5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard/settings"
                              className={classNames(
                                active
                                  ? "bg-primary/10 dark:bg-primary-dark/10"
                                  : "",
                                "block px-4 py-2 text-sm text-text dark:text-text-dark"
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active
                                  ? "bg-primary/10 dark:bg-primary-dark/10"
                                  : "",
                                "block px-4 py-2 text-sm text-text dark:text-text-dark"
                              )}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <div className="border-t border-primary/10 dark:border-primary-dark/10 my-1"></div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logoutHandler}
                              className={classNames(
                                active
                                  ? "bg-secondary/10 dark:bg-secondary-dark/10"
                                  : "",
                                "block w-full text-left px-4 py-2 text-sm text-secondary dark:text-secondary-dark"
                              )}
                            >
                              <IoLogOutOutline className="inline h-4 w-4 mr-2" />
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Disclosure.Button className="p-2 text-text dark:text-text-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded-lg transition-all duration-200">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <Disclosure.Panel className="md:hidden bg-bg dark:bg-bg-dark border-t border-primary/10 dark:border-primary-dark/10">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-text dark:text-text-dark hover:text-primary dark:hover:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded-lg transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
