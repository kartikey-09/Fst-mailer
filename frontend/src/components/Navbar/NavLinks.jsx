import React, { useState } from "react";
import { Link } from "react-router-dom";
import { links } from "./Mylinks";


const NavLinks = ({ navbar }) => {
    const [heading, setHeading] = useState("");
    return (
        <>
            {links.map((link) => (
                <div key={link.name} >
                    <div className="px-3 text-left md:cursor-pointer group normal-case">
                        <h1
                            className={` text-gray-900  py-7 flex justify-between items-center md:pr-0 pr-5 group hover:text-orange-500 font-semibold`}
                            onClick={() => {
                                heading !== link.name ? setHeading(link.name) : setHeading("");
                            }}
                        >
                            {link.name}
                            <span className="text-xl md:hidden inline">
                                <ion-icon
                                    name={`${heading === link.name ? "chevron-up" : "chevron-down"
                                        }`}
                                ></ion-icon>
                            </span>
                            <span className="text-xl md:mt-1 md:ml-2  md:block hidden group-hover:rotate-180 group-hover:-mt-2">
                                <ion-icon name="chevron-down"></ion-icon>
                            </span>
                        </h1>
                        {link.submenu && (
                            <div>
                                <div className="absolute top-14 hidden group-hover:md:block hover:md:block">
                                    <div className="py-3">
                                    </div>
                                    <div className="p-2 bg-gray-100 rounded-xl">
                                        {link.sublinks.map((mysublinks) => (
                                            <div key={mysublinks.Head}>
                                                {mysublinks.sublink.map((slink) => (
                                                    <Link
                                                        to={slink.link}
                                                        className=""
                                                        key={slink.name}
                                                    >
                                                        <li className="text-sm text-white mb-2 p-2 rounded-2xl px-4 bg-orange-500 hover:text-orange-500 border-2 border-white hover:border-orange-500 hover:bg-white transition-all duration-300 ease-in-out" >
                                                            {slink.name}
                                                        </li>
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Mobile menus */}
                    <div
                        className={`
            ${heading === link.name ? "md:hidden" : "hidden"}
          `}
                    >

                        {/* sublinks */}
                        {link.sublinks.map((slinks) => (
                            <div key={slinks.Head}>
                                <div>
                                    <div>
                                        {slinks.sublink.map((slink) => (
                                            <li className="py-3 pl-4" key={slink.name}>
                                                <Link to={slink.link} className="text-gray-900" >{slink.name}</Link>
                                            </li>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
};

export default NavLinks