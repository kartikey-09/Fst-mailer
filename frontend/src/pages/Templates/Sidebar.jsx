import React from "react";
import { useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import Loader from "./../../components/Loader/Loader";

const Sidebar = ({
  templates,
  onSelectTemplate,
  selectedTemplateId,
  loading,
}) => {
  //   const navigate = useNavigate();
  //   const admin = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");


  return (
    <div className="overflow-y-scroll h-screen flex-shrink-0 w-1/4 bg-blue-800 p-4 rounded-md ">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
       
        <div className="relative w-full mb-3">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
              />
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search templates..."
            required
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      {loading ? (
        <Loader /> // Show loader while loading
      ) : (
        <ul>
          {templates
            ?.filter((template) => {
              return search.toLowerCase() == ""
                ? template
                : template.subject.toLowerCase()?.includes(search);
            })
            ?.map((template) => (
              <a key={template._id} onClick={() => onSelectTemplate(template)}>
                <li
                  className={`cursor-pointer mb-3 p-3 rounded ${
                    selectedTemplateId === template._id
                      ? "bg-blue-900 text-white"
                      : "hover:bg-blue-900 text-white"
                  }`}
                >
                  {template.subject}
                </li>
              </a>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
