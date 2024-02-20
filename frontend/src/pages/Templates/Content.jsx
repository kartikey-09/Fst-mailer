import React from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useSelector } from "react-redux";

const Content = ({ selectedTemplate, onDeleteTemplate, onUseTemplate }) => {
  const admin = useSelector((state) => state.admin);

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <div className="overflow-y-scroll h-screen flex-grow  p-8 border-l border-gray-300 flex flex-col relative">
      <div className="flex items-start mb-4 justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onUseTemplate}
        >
          Use Template
        </button>
        {admin.role === "Admin" && (
          <RiDeleteBin5Fill
            className="text-red-500 hover:text-red-900 cursor-pointer"
            size={40}
            onClick={onDeleteTemplate}
          />
        )}
      </div>

      <div className="flex-grow">
        {selectedTemplate ? (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">
                {selectedTemplate.subject}
              </h2>
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={createMarkup(selectedTemplate.content)}
              />
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            Select a template to view its content.
          </p>
        )}
      </div>
    </div>
  );
};

export default Content;
