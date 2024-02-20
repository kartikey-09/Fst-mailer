import "./Navbar.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
// import NavLinks from "./NavLinks";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsFillSendFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import { BiCopyAlt } from "react-icons/bi";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const admin = useSelector((state) => state.admin);
  const [navbar, setNavbar] = useState(false);
  const changeBackground = () => {
    // console.log(window.scrollY)
    if (window.scrollY >= 50) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    changeBackground();
    // adding the event when scroll change background
    window.addEventListener("scroll", changeBackground);
  });

  return (
    <nav
      className={`${
        navbar ? "bg-white" : ""
      } fixed w-full z-10 transition-all ease-in-out duration-75 `}
    >
      <div className="flex items-center font-medium justify-between md:px-12">
        <div className="z-50 p-5 md:w-auto w-full flex justify-between h-full">
          <Link to="/_mailer">
            <img
              src="https://res.cloudinary.com/dztkzhtla/image/upload/v1692620524/html%20mailer/Fst_Mailer_wpqpda.png"
              alt="logo"
              className="md:cursor-pointer w-40 md:w-48"
            />
          </Link>
          <div className="text-3xl md:hidden" onClick={() => setOpen(!open)}>
            <ion-icon name={`${open ? "close" : "menu"}`}></ion-icon>
          </div>
        </div>
        <ul className="md:flex hidden items-center gap-8 font-[Signika+Negative] z-20">
          {admin.role === "TL" && (
            <li>
              <Link
                to="/_users"
                className={`text-blue-700 py-1 px-2 font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out `}
              >
                <BiSolidUser className="mr-1" />
                Members
              </Link>
            </li>
          )}
          {admin.role === "Admin" && (
            <li>
              <Link
                to="/_create_teams"
                className={`text-blue-700 py-1 px-2 font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out `}
              >
                <BiSolidUser className="mr-1" />
                Create TL
              </Link>
            </li>
          )}
          {admin.role === "Admin" && (
            <li>
              <Link
                to="/_employees_"
                className={`text-blue-700 py-1 px-2 font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out `}
              >
                <BiSolidUser className="mr-1" />
                Employees
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/_contacts"
              className={`text-blue-700 py-1 px-2 font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out `}
            >
              <BiSolidUser className="mr-1" />
              Manage contacts
            </Link>
          </li>

          <li>
            <Link
              to="/_compose"
              className={`text-blue-700 py-1 px-2 font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out `}
            >
              <HiOutlinePencilAlt className="mr-1" />
              Compose
            </Link>
          </li>
          <li>
            <Link
              to="/_sent"
              className={`text-blue-700 py-1 px-2 font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out `}
            >
              <BsFillSendFill className="mr-1" />
              Sent
            </Link>
          </li>
          
          <li>
            <Link
              to="/_templates"
              className={`text-blue-700 py-1 px-2 font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out `}
            >
              <BiCopyAlt className="mr-1" />
              Use Templates
            </Link>
          </li>

          {/* <NavLinks navbar={navbar} /> */}
          {/* <li>
                        <Link to="/partner" className={`text-gray-900 py-7 px-3 inline-block font-semibold orange-link hover:text-orange-500`}>
                            Partner with us
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className={`text-gray-900 py-7 px-3 inline-block font-semibold orange-link hover:text-orange-500`}>
                            Contact us
                        </Link>
                    </li> */}
        </ul>
        <div className="md:block hidden">
          <Button />
        </div>
        {/* Mobile nav */}
        <ul
          className={`
        md:hidden  fixed w-4/5 bg-gray-100 top-0 overflow-y-auto bottom-0 py-24 pl-4
        duration-500 ${open ? "left-0" : "left-[-100%]"}
        `}
        >
          {admin.role === "TL" && (
            <li>
              <Link to="/_users" className="py-7 px-3 flex  items-center">
                <BiSolidUser className="mr-1" />
                Members
              </Link>
            </li>
          )}
          {admin.role === "Admin" && (
            <li>
              <Link to="/_employees_" className="py-7 px-3 flex  items-center">
                <BiSolidUser className="mr-1" />
                Employees
              </Link>
            </li>
          )}
          {admin.role === "Admin" && (
            <li>
              <Link
                to="/_create_teams"
                className="py-7 px-3 flex  items-center"
              >
                <BiSolidUser className="mr-1" />
                Create TL
              </Link>
            </li>
          )}
          <li>
            <Link to="/_compose" className="py-7 px-3 flex  items-center">
              <HiOutlinePencilAlt className="mr-1" />
              Compose
            </Link>
          </li>
          <li>
            <Link to="/_sent" className="py-7 px-3 flex  items-center">
              <BsFillSendFill className="mr-1" />
              Sent
            </Link>
          </li>

          {/* <NavLinks />
                    <li>
                        <Link to="/partner" className="py-7 px-3 inline-block">
                            Partner with us
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="py-7 px-3 inline-block">
                            Contact us
                        </Link>
                    </li> */}
          <div className="py-5">
            <Button />
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
