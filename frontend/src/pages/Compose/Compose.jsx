import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Compose.css";
import ParticlesBackground from "./../Home/ParticlesBackground";
import Navbar from "./../../components/Navbar/Navbar";
import Loader from "./../../components/Loader/Loader";
import JoditEditor from "jodit-react";
import { AiOutlineSend } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { VscPreview } from "react-icons/vsc";
import { toast } from "react-hot-toast";
import axios from "axios";
import { url } from "../../api";
// import CSV from "./CSV";
import Groups from "./Groups";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import SearchResultsList from "./SearchResultsList";

const Compose = () => {
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);
  const location = useLocation();
  const { subject1, content1 } = location.state || {};

  const editor = useRef(null);
  const [content, setContent] = useState(content1 || "");
  const [receivers, setReceivers] = useState([]);
  const [subject, setSubject] = useState(subject1 || "");
  const [loading, setLoading] = useState(false);

  const [templateList, setTemplateList] = useState([]);
  const [results, setResults] = useState([]);
  const [isTemplateSaved, setIsTemplateSaved] = useState(false);

  const [cc, setCC] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);

  useEffect(() => {
    if (!admin._id) {
      navigate("/login");
    }
  }, [navigate, admin]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${url}/api/templates/get-templates`);
        // console.log("temp", response.data);
        setTemplateList(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    const handleTemplateChange = () => {
      if (subject1 && content1) {
        setIsTemplateSaved(true);
      }
      if (subject !== subject1 || content !== content1) {
        setIsTemplateSaved(false);
      }
    };

    // Listen for changes in subject and content
    handleTemplateChange();
  }, [subject, content, subject1, content1]);

  // Function to suggest templates based on subject keywords
  const suggestTemplates = async (value) => {
    try {
      const results = templateList.filter((user) => {
        return (
          value &&
          user &&
          user.subject &&
          user.subject.toLowerCase().includes(value)
        );
      });
      setResults(results);
    } catch (error) {
      console.error("Error suggesting templates:", error);
    }
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();

    if (!subject || !content) {
      toast.error(
        "Please enter both subject and content before saving the template."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/templates/create-template`,
        {
          createrId: admin._id,
          subject,
          content,
        },
        {
          headers: {
            Authorization: admin.token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setIsTemplateSaved(true);
        toast.success("Template Saved Successfully");
      } else {
        toast.error(response.data.message || "Error saving template.");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Error saving template. Please try again.");
    }
  };

  const handleReceiverChange = (newArray) => {
    setReceivers(newArray);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleCcClick = (event) => {
    event.preventDefault(); // Prevent form submission
    setCCValue();
  };

  const setCCValue = () => {
    setCC((prev) => !prev);
  };

  const clearAllData = (e) => {
    e.preventDefault();
    setReceivers([]);
  };

  // handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      receivers.length === 0 ||
      subject.length === 0 ||
      content.length === 0
    ) {
      toast.error("Please enter all details");
      setLoading(false);
      return;
    }

    try {
      // receivers.map(async (mail) => {
      //     try {
      //         await axios.post(`${url}/api/mails/create-mail`, {
      //             senderId: admin._id,
      //             receivers: [mail],
      //             content,
      //             subject,
      //         }, {
      //             headers: {
      //                 Authorization: admin.token,
      //                 'Content-Type': 'application/json',
      //             }
      //         })
      //     }
      //     catch (err) {
      //         toast.error("Error : " + err?.response?.data?.message);
      //         toast.error("Mail Failed : " + mail);
      //     }
      // })

      try {
        await axios.post(
          `${url}/api/mails/create-mail`,
          {
            senderId: admin._id,
            receivers: receivers,
            content,
            subject,
            withCC: false,
          },
          {
            headers: {
              Authorization: admin.token,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        toast.error("Error : " + err?.response?.data?.message);
        // toast.error("Mail Failed : " + mail);
      }

      toast.success("Mail Sended to all valid mails");
    } catch (err) {
      toast.error("Server not available, try after some time.");
    }

    setLoading(false);
  };

  // handle submit function
  const handleSubmitCC = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      receivers.length === 0 ||
      subject.length === 0 ||
      content.length === 0
    ) {
      toast.error("Please enter all details");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${url}/api/mails/create-mail`,
        {
          receivers,
          content,
          subject,
          senderId: admin._id,
          withCC: true,
        },
        {
          headers: {
            Authorization: admin.token,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Mail Sended to all valid mails");
    } catch (err) {
      toast.error("Server not available, try after some time.");
    }

    setLoading(false);
  };

  return (
    <div>
      <ParticlesBackground />
      <Navbar />

      {/* ḥeader component */}
      <div
        className="relative overflow-hidden bg-transparent"
        style={{ height: "200px" }}
      ></div>

      {/* main form */}
      <div className="bg-white relative  border-2 border-gray-600 rounded-md overflow-auto mx-2 md:mx-12 mb-4">
        <form onSubmit={cc ? handleSubmitCC : handleSubmit}>
          <h3 className="font-[Roboto] bg-blue-700 text-white text-lg font-base text-center mb-4 py-1">
            Create a new mail
          </h3>

          <ArrayInput value={receivers} onChange={handleReceiverChange} />

          <div className="mx-2 md:mx-4 my-2 flex justify-between items-center flex-col md:flex-row">
            <div className="flex justify-center items-center flex-wrap mb-3 md:mb-0">
              <button
                style={{
                  backgroundColor: cc ? "blue" : "",
                  color: cc ? "white" : "",
                }}
                className="text-blue-700 py-1 px-2  font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out mr-1"
                onClick={handleCcClick}
              >
                {/* {cc ? <p>With CC</p> : <>Without CC</>} */}
                CC
              </button>
              <button
                style={{
                  backgroundColor: !cc ? "blue" : "",
                  color: !cc ? "white" : "",
                }}
                className={`text-blue-700 py-1 px-2  font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out mr-1`}
                onClick={handleCcClick}
              >
                BCC
              </button>
              <span className="ml-4 text-xs md:text-sm text-red-600 font-medium font-[Roboto]">
                {cc
                  ? "( Recipients can see all other mail Id. )"
                  : "( Recipients can not see any other mail Id. )"}
              </span>
              {receivers.length > 0 && (
                <span className="ml-2 text-xs md:text-sm text-blue-600 font-medium font-[Roboto]">
                  Total Recipients : {receivers.length}
                </span>
              )}
            </div>

            <div className="flex justify-start items-center">
              {receivers.length > 0 && (
                <div className="mr-3">
                  <Button colorScheme="red" size="sm" onClick={clearAllData}>
                    Clear All Data
                  </Button>
                </div>
              )}
              {/* <CSV setReceivers={setReceivers} />   &nbsp;  */}
              <Groups setReceivers={setReceivers} />
            </div>
          </div>

          <div className="relative mx-2 md:mx-4 my-2 flex items-center ">
            <span className="mr-1 md:mr-2 font-[Ubuntu]">Subject</span>
            <input
              type="text"
              value={subject}
              required={true}
              className="bg-indigo-50 appearance-none border-2 border-indigo-100 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-blue-700"
              onChange={(e) => {
                setSubject(e.target.value);
                suggestTemplates(e.target.value);
              }}
              onKeyDown={handleInputKeyDown}
            />
            {results && results.length > 0 && (
              <SearchResultsList
                results={results}
                setContent={setContent}
                templateList={templateList}
                setSubject={setSubject}
                setResults={setResults}
              />
            )}
            {/* <label>Template:</label>
            <select
              value={template}
              onChange={(e) => handleTemplateSelection(e.target.value)}
            >
              <option value="">Select Template</option>
              {templateList.map((template) => (
                <option key={template.subject} value={template.subject}>
                  {template.subject}
                </option>
              ))}
            </select> */}
          </div>
          <div className="mx-2 md:mx-4 mt-3 mb-1">
            <JoditEditor
              ref={editor}
              value={content}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>

          <div className="mx-2 md:mx-4 my-4 flex justify-between items-center flex-wrap">
            <button
              disabled={loading}
              className="text-blue-700 py-1 px-2 font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out"
              type="submit"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <AiOutlineSend className="mr-1" />
                  Send
                </>
              )}
            </button>
            <div className="flex items-center space-x-4">
              {!isTemplateSaved && (
                <button
                  className="bg-gray-300 hover:bg-gray-400 transition duration-300 ease-in-out text-gray-700 font-semibold py-1 px-2 rounded inline-flex items-center"
                  onClick={handleSaveTemplate}
                >
                  <svg
                    className="fill-current w-4 h-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                  </svg>
                  <span>Save Template</span>
                </button>
              )}

              <Button
                isDisabled={content.length > 0 ? false : true}
                colorScheme="messenger"
                size="sm"
                ref={btnRef}
                onClick={onOpen}
              >
                <VscPreview className="mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Preview  */}
      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="outside"
        size="full"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <p className="font-[Poppins] text-center text-sm border-b border-gray-400 pb-1 px-4">
              Preview
            </p>{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div
              className="content_div p-4 border-2 border-gray-400"
              style={{ overflowX: "scroll" }}
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" size="sm" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default Compose;

function ArrayInput({ value, onChange }) {
  const [inputValue, setInputValue] = useState("");
  const [show, setShow] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddItem = () => {
    if (inputValue.trim() !== "") {
      onChange([...value, inputValue.toLowerCase()]);
      setInputValue("");
    }
  };

  const handleAddButtonClick = (event) => {
    event.preventDefault(); // Prevent form submission
    handleAddItem();
  };

  const handleRemoveButtonClick = (event, index) => {
    event.preventDefault(); // Prevent form submission
    handleRemoveItem(index);
  };

  const handleRemoveItem = (index) => {
    const updatedArray = value.filter((_, i) => i !== index);
    onChange(updatedArray);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleAddItem();
    }
  };

  const handleShowBtn = (e) => {
    e.preventDefault();
    setShow((prev) => !prev);
  };

  return (
    <div>
      {show ? (
        <ul className="mx-2 md:mx-4 my-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          {value.map((item, index) => (
            <li
              key={index}
              className="border-2 border-blue-600 rounded-xl p-1 flex items-center"
            >
              <span className="text-xs md:text-sm font-medium font-[Roboto] text-blue-600">
                {item}
              </span>
              <button
                onClick={(event) => handleRemoveButtonClick(event, index)}
              >
                <ImCross className="ml-2 text-red-600" size={12} />
              </button>
            </li>
          ))}

          {value.length > 3 && (
            <Button colorScheme="gray" size="xs" onClick={handleShowBtn}>
              show less
            </Button>
          )}
        </ul>
      ) : (
        <div className="mx-2 md:mx-4 my-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          {value.slice(0, 3).map((item, index) => (
            <li
              key={index}
              className="border-2 border-blue-600 rounded-xl p-1 flex items-center"
            >
              <span className="text-xs md:text-sm font-medium font-[Roboto] text-blue-600">
                {item}
              </span>
              <button
                onClick={(event) => handleRemoveButtonClick(event, index)}
              >
                <ImCross className="ml-2 text-red-600" size={12} />
              </button>
            </li>
          ))}

          {value.length > 3 && (
            <Button colorScheme="gray" size="xs" onClick={handleShowBtn}>
              show more
            </Button>
          )}
        </div>
      )}
      <div className="mx-2 md:mx-4 my-2 flex items-center">
        <span className="mr-1 md:mr-2 font-[Ubuntu]">To</span>
        <input
          type="email"
          value={inputValue}
          className="
                bg-indigo-50 appearance-none border-2 border-indigo-100  rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-blue-700
                "
          onChange={handleInputChange}
          placeholder="Recipients"
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="mx-2 md:mx-4 my-2 flex items-center">
        <button
          className="
                text-blue-700 py-1 px-2 font-semibold flex justify-center items-center border 
                        border-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out
                "
          onClick={handleAddButtonClick}
        >
          Add
        </button>
      </div>
    </div>
  );
}
