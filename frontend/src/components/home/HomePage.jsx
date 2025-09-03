import React, { useState } from "react";
import Features from "./Features";
import CallToAction from "./CallToAction";
import { Link } from "react-router-dom";
import 'boxicons/css/boxicons.min.css';






const HomePage = () => {
  return (
    // <section className="overflow-hidden pb-24">
    //   <p>Hello</p>
      
    // </section>
 <div>
      <div className="bg-[url('assets/background.png')] bg-cover bg-center">


        {/* Hero Section */}
        <div className="max-w-2xl py-32 mx-auto sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-700">Welcome To</h2>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-6xl font-semibold text-gray-900 tracking-tigh">Edu Nexus</h1>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">C.W.W.Kannangara Central College</h1>

            <p className="mt-8 text-lg font-medium text-gray-550 text-pretty sm:text-xl/8">
              Welcome to the C.W.W.Kannangara Central College Management System
            </p>
            <div className="flex items-center justify-center mt-10 gap-x-6">
              <a 
                href="#"
                className="rounded-md bg-[#39cc2e] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#269c1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Student Profile
              </a>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-white">
        <div className="py-24 mx-auto max-w-7xl sm:px-6 sm:py-32 lg:px-8">
          <div className="relative px-6 pt-16 overflow-hidden shadow-2xl bg-[#39cc2e] isolate sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg 
              viewBox="0 0 1024 1024"
              className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#ffdb1b" />
                  <stop offset="1" stopColor="#ffdb1b" />
                </radialGradient>
              </defs>
            </svg>
            <div className="max-w-md mx-auto text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-white text-balance sm:text-4xl">
                Visit Our School Website For More Information.
              </h2>
              <p className="mt-6 text-gray-300 text-lg/8 text-pretty">
                At C.W.W. Kannangara Central College, we empower young minds through knowledge, discipline, and innovation. Inspired by Dr. C.W.W. Kannangara, the father of free education in Sri Lanka, we continue his vision of accessible learning. Located in Mathugama, our college nurtures academic excellence, holistic growth, and community spirit while shaping future leaders through tradition, transformation, and technology.
              </p>
              <div className="flex items-center justify-center mt-10 gap-x-6 lg:justify-start">
                <a 
                  href="https://cwwkcc.lk/"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  cwwkcc.lk
                </a>
                <a href="#" className="font-semibold text-white text-sm/6 hover:text-gray-100">
                  Learn more
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <img 
                className="absolute top-0 left-0 rounded-md w-180 max-w-none bg-white/5 ring-1 ring-white/10"
                src="/background.png" 
                alt="App screenshot" 
                width="1824" 
                height="1080" 
              />
            </div>
          </div>
        </div>
      </div>


   {/* About Us */}
      <div>
      <section className="mt-14">
        <div className="container px-6 py-12 mx-auto">
          <div className="text-center">
            <h1 className="px-5 text-6xl font-medium text-black-500 dark:text-black-400">About Us</h1>
          </div>
        </div>
      </section>

      <div className="mb-16">
        <div className="w-full px-10 pt-10">
          <div className="container mx-auto">
            <div 
              role="list" 
              aria-label="Behind the scenes People"
              className="flex-wrap items-center lg:flex md:flex sm:flex xl:justify-between md:justify-around sm:justify-around lg:justify-around"
            >
              {/* Team Member 1 - Pasindu Surath */}
              <div role="listitem" className="relative mt-16 mb-32 xl:w-1/3 sm:w-3/4 md:w-2/5 sm:mb-24 xl:max-w-sm lg:w-2/5">
                <div className="overflow-hidden bg-white rounded shadow-md">
                  <div className="absolute flex justify-center w-full -mt-20">
                    <div className="w-32 h-32">
                      <img 
                        src="/pasindu.png"
                        alt="Display Picture of Pasindu Surath" 
                        className="object-cover w-full h-full rounded-full shadow-md" 
                      />
                    </div>
                  </div>
                  <div className="px-6 mt-16">
                    <h1 className="mb-1 text-3xl font-bold text-center">Pasindu Surath</h1>
                    <p className="text-sm text-center text-gray-800">Frontend Developer</p>
                    <p className="pt-3 text-base font-normal text-center text-gray-600">
                     Passionate about creating modern, responsive, and user-friendly interfaces. Skilled in Tailwind CSS and shadcn/ui, bringing clean design systems to life with smooth interactions. Focused on building web applications that are not only functional but also visually engaging.
                    </p>
                    <div className="flex justify-center w-full pt-5 pb-5">
                      <a href="#" className="mx-5" onClick={(e) => e.preventDefault()}>
                        <div aria-label="Github" role="img">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-github">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                          </svg>
                        </div>
                      </a>
                      <a href="#" className="mx-5" onClick={(e) => e.preventDefault()}>
                        <div aria-label="Twitter" role="img">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-twitter">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                          </svg>
                        </div>
                      </a>
                      <a href="#" className="mx-5" onClick={(e) => e.preventDefault()}>
                        <div aria-label="Instagram" role="img">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-instagram">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Member 2 - Dulina Chandul */}
              <div role="listitem" className="relative mt-16 mb-32 xl:w-1/3 lg:mx-3 sm:w-3/4 md:w-2/5 sm:mb-24 xl:max-w-sm lg:w-2/5">
                <div className="overflow-hidden bg-white rounded shadow-md">
                  <div className="absolute flex justify-center w-full -mt-20">
                    <div className="w-32 h-32">
                      <img 
                        src="/dulina.jpg"
                        alt="Display Picture of Dulina Chandul" 
                        className="object-cover w-full h-full rounded-full shadow-md" 
                      />
                    </div>
                  </div>
                  <div className="px-6 mt-16">
                    <h1 className="mb-1 text-3xl font-bold text-center">Dulina Chandul</h1>
                    <p className="text-sm text-center text-gray-800">Backend Developer</p>
                    <p className="pt-3 text-base font-normal text-center text-gray-600">
                     Specialized in building scalable and efficient backends using React and MongoDB. Experienced in designing APIs, managing databases, and ensuring seamless communication between frontend and backend. Dedicated to delivering fast and secure application performance.
                    </p>
                    <div className="flex justify-center w-full pt-5 pb-5">
                      <a href="#" className="mx-5" onClick={(e) => e.preventDefault()}>
                        <div aria-label="Github" role="img">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-github">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                          </svg>
                        </div>
                      </a>
                      <a href="#" className="mx-5" onClick={(e) => e.preventDefault()}>
                        <div aria-label="Twitter" role="img">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-twitter">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                          </svg>
                        </div>
                      </a>
                      <a href="#" className="mx-5" onClick={(e) => e.preventDefault()}>
                        <div aria-label="Instagram" role="img">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-instagram">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Member 3 - Chamila Roshana */}
              <div role="listitem" className="relative mt-16 mb-32 xl:w-1/3 sm:w-3/4 md:w-2/5 sm:mb-24 xl:max-w-sm lg:w-2/5">
                <div className="overflow-hidden bg-white rounded shadow-md">
                  <div className="absolute flex justify-center w-full -mt-20">
                    <div className="w-32 h-32">
                      <img 
                        src="https://cdn.tuk.dev/assets/photo-1566753323558-f4e0952af115.jfif"
                        alt="Display Picture of Chamila Roshana" 
                        className="object-cover w-full h-full rounded-full shadow-md" 
                      />
                    </div>
                  </div>
                  <div className="px-6 mt-16">
                    <h1 className="mb-1 text-3xl font-bold text-center">Chamila Roshana</h1>
                    <p className="text-sm text-center text-gray-800">UI Designer</p>
                    <p className="pt-3 text-base font-normal text-center text-gray-600">
                      Creative designer with a sharp eye for detail and user experience. Skilled at transforming ideas into intuitive and appealing interfaces. Focused on usability, accessibility, and design consistency to craft interfaces that users love to interact with.
                    </p>
                    <div className="flex justify-center w-full pt-5 pb-5">
                      <a href="#" className="mx-5" onClick={(e) => e.preventDefault()}>
                        <div aria-label="Github" role="img">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-github">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                          </svg>
                        </div>
                      </a>
                      <a href="#" className="mx-5" onClick={(e) => e.preventDefault()}>
                        <div aria-label="Twitter" role="img">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-twitter">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                          </svg>
                        </div>
                      </a>
                      <a href="#" className="mx-5" onClick={(e) => e.preventDefault()}>
                        <div aria-label="Instagram" role="img">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-instagram">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Footer */}
      <footer>
        <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-16 md:p-8 lg:p-10">
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="text-center">
            <img className=" mx-auto h-56 " src="/logo.png" alt="" />
            
            <div className="flex items-center justify-center mb-3 text-2xl font-semibold">
              <h1 className="text-[#39cc2e]">C.W.W.Kannangara Central College</h1>
            </div>

            <div className="flex items-center justify-center mb-5 text-2xl font-semibold">
              <h1 className="text-[#39cc2e]">Mathugama</h1>
            </div>

            <span className="block text-sm text-center text-gray-500 dark:text-gray-400">
              © 2025 cwwkcc™ All Rights Reserved.
            </span>
            
            <ul className="flex justify-center mt-5">
              <li className="mr-5">
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-[#14b8a6] dark:text-gray-400">
                  <i className='bx bxl-facebook-circle bx-sm'></i>
                </a>
              </li>
              <li className="mr-5">
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-[#14b8a6] dark:text-gray-400">
                  <i className='bx bxl-instagram-alt bx-sm'></i>
                </a>
              </li>
              <li className="mr-5">
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-[#14b8a6] dark:text-gray-400">
                  <i className='bx bxl-youtube bx-sm'></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-[#14b8a6] dark:text-gray-400">
                  <i className='bx bxl-whatsapp bx-sm'></i>
                </a>
              </li>
            </ul>

            <div className="md:flex md:items-center md:justify-center md:gap-5">
              <a 
                aria-current="page"
                className="inline-block px-3 mt-2 text-sm font-medium font-semibold text-gray-900 transition-transform duration-200 rounded-lg hover:text-gray-900 hover:scale-105"
                href="contact.html"
              >
                Contact
              </a>
              <a 
                className="inline-block px-3 mt-2 text-sm font-medium font-semibold text-gray-900 transition-transform duration-200 rounded-lg hover:text-gray-900 hover:scale-105"
                href="#"
              >
                Courses
              </a>
              <a 
                className="inline-block px-3 mt-2 text-sm font-medium font-semibold text-gray-900 transition-transform duration-200 rounded-lg py- hover:text-gray-900 hover:scale-105"
                href="#team"
              >
                About Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    


  );
};

export default HomePage;
