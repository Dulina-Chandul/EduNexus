import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { FaBlog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/slices/themeSlices";
import { Button } from "@/components/ui/button";

export default function PublicNavbar() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  return (
    <Disclosure as="nav" className="bg-bg dark:bg-bg-dark shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
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
                <div className="flex flex-shrink-0 items-center">
                  <FaBlog className="h-8 w-auto text-primary dark:text-primary-dark" />
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center border-b-2 border-primary dark:border-primary-dark px-1 pt-1 text-sm font-medium text-text dark:text-text-dark"
                  >
                    Home
                  </Link>
                  <Link
                    to="/posts"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-text dark:text-text-dark hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Latest Posts
                  </Link>
                </div>
              </div>
              <div className="flex items-center ">
                <div className="flex-shrink-0">
                  <Link
                    to="/register"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-primary dark:bg-primary-dark px-3 py-2 text-sm font-semibold text-text dark:text-text-dark shadow-sm hover:bg-accent dark:hover:bg-accent-dark focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary dark:focus-visible:outline-primary-dark "
                  >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Create Post
                  </Link>
                  <Link
                    to="/login"
                    className="relative inline-flex items-center gap-x-1.5 rounded-sm bg-secondary dark:bg-secondary-dark px-3 py-2 text-sm font-semibold text-text dark:text-text-dark bottom-1.5"
                  >
                    Login
                  </Link>
                  <Button
                    onClick={() => dispatch(toggleTheme())}
                    variant="ghost"
                    className="p-2 rounded-full ml-4 text-text dark:text-text-dark"
                  >
                    {theme === "dark" ? "☀️" : "🌙"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2 bg-bg dark:bg-bg-dark">
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-text dark:text-text-dark hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 sm:pl-5 sm:pr-6"
              >
                Home
              </Disclosure.Button>
              {/* Similar for other mobile links */}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
