import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { FaBlog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/slices/themeSlices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PublicNavbar() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Latest Posts", href: "/posts" },
    { name: "About", href: "/about" },
  ];

  return (
    <Disclosure
      as="nav"
      className="bg-bg dark:bg-bg-dark border-b border-primary/10 dark:border-primary-dark/10 backdrop-blur-sm sticky top-0 z-50 shadow-sm dark:shadow-primary-dark/5"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Logo and Brand */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="flex items-center space-x-2 group">
                    {/* <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                      <FaBlog className="h-4 w-4 text-bg dark:text-bg-dark" />
                    </div> */}
                    <span className="text-text dark:text-text-dark font-bold text-xl hidden sm:block group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-300">
                      Edu Nexus
                    </span>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:ml-8 md:flex md:space-x-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="px-4 py-2 text-sm font-medium text-text dark:text-text-dark hover:text-primary dark:hover:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded-lg transition-all duration-200 relative group"
                    >
                      {item.name}
                      <div className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-transparent via-primary dark:via-primary-dark to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-3">
                {/* Theme Toggle */}
                <Button
                  onClick={() => dispatch(toggleTheme())}
                  variant="ghost"
                  size="sm"
                  className="text-text dark:text-text-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 hover:text-primary dark:hover:text-primary-dark transition-all duration-200 rounded-lg p-2"
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </Button>

                {/* Action Buttons - Desktop */}
                <div className="hidden sm:flex sm:items-center sm:space-x-3">
                  <Link to="/login">
                    <Button className="bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-bg dark:text-bg-dark hover:from-primary/90 hover:to-secondary/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>

                  <Link to="/register">
                    <Button
                      variant="outline"
                      className="border-primary dark:border-primary-dark text-primary dark:text-primary-dark hover:bg-primary dark:hover:bg-primary-dark hover:text-bg dark:hover:text-bg-dark transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Register
                    </Button>
                  </Link>
                </div>

                {/* Mobile menu button */}
                <div className="sm:hidden">
                  <Disclosure.Button className="p-2 text-text dark:text-text-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 hover:text-primary dark:hover:text-primary-dark rounded-lg transition-all duration-200">
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
          <Disclosure.Panel className="sm:hidden bg-bg dark:bg-bg-dark border-t border-primary/10 dark:border-primary-dark/10">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-3 text-base font-medium text-text dark:text-text-dark hover:text-primary dark:hover:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 rounded-lg transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Action Buttons */}
              <div className="pt-4 border-t border-primary/10 dark:border-primary-dark/10 space-y-3">
                <Link to="/register" className="block">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-bg dark:text-bg-dark hover:from-primary/90 hover:to-secondary/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 shadow-lg transition-all duration-300">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </Link>

                <Link to="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-primary dark:border-primary-dark text-primary dark:text-primary-dark hover:bg-primary dark:hover:bg-primary-dark hover:text-bg dark:hover:text-bg-dark transition-all duration-200"
                  >
                    Login
                  </Button>
                </Link>
              </div>

              {/* Mobile Brand Info */}
              <div className="pt-4 border-t border-primary/10 dark:border-primary-dark/10">
                <div className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5 rounded-xl p-4 border border-primary/20 dark:border-primary-dark/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/20 dark:bg-primary-dark/20 rounded-lg">
                      <FaBlog className="h-5 w-5 text-primary dark:text-primary-dark" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text dark:text-text-dark">
                        Edu Nexus
                      </div>
                      <div className="text-xs text-text/70 dark:text-text-dark/70">
                        Empowering Education
                      </div>
                    </div>
                    <Badge className="ml-auto bg-accent/20 dark:bg-accent-dark/20 text-accent dark:text-accent-dark border-accent/30 dark:border-accent-dark/30">
                      Guest
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
