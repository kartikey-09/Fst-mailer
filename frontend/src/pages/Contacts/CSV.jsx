import React, { useState } from "react";
import Papa from "papaparse";
import { toast } from "react-hot-toast";
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
import axios from "axios";
import { url } from "./../../api";

function CSV({ admin }) {
  const [error, setError] = useState(null);
  const [contacts, setContacts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  const [groupName, setGroupName] = useState("");

  // Expected header names
  const expectedHeaders = ["name", "email", "phone"];

  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      parseCSV(file);
    }
  };

  // Function to parse the CSV file
  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        if (validateHeaders(result.meta.fields)) {
          extractEmails(result.data);
          setError(null);
        } else {
          setError("CSV file headers are incorrect.");
          toast.error("CSV file headers are incorrect.");
          setContacts([]);
          clearFileInput();
        }
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  // Function to validate headers
  const validateHeaders = (headers) => {
    return expectedHeaders.every((expectedHeader) =>
      headers.includes(expectedHeader)
    );
  };

  // Function to extract emails and store in emailArray
  const extractEmails = (data) => {
    const limit = 10000;
    const contactsArray = data.slice(0, limit).map((row) => {
      return {
        emailId: row.email,
        name: row.name,
        phone: row.phone,
      };
    });

    setContacts(contactsArray);
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };
  // Function to clear the file input
  const clearFileInput = () => {
    const inputElement = document.querySelector('input[type="file"]');
    if (inputElement) {
      inputElement.value = "";
    }
    setContacts([]);
  };

  const handleCreate = async () => {
    try {
      // Make a POST request using axios
      const response = await axios.post(
        `${url}/api/contacts/create-contact`,
        {
          contacts,
          groupName,
        },
        {
          headers: {
            Authorization: admin.token,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response from the server (you can show a success message or handle errors)
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        console.log("e", response.data.message);
        toast.error(response.data.message);
      }

      onClose();
    } catch (error) {
      console.error("Error creating contacts:", error);
      toast.error("Error creating contacts. Please try again.");
    }
  };

  return (
    <>
      <Button colorScheme="messenger" size="sm" ref={btnRef} onClick={onOpen}>
        Add Contacts
      </Button>

      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="outside"
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <p className="font-[Poppins] text-center text-sm border-b border-gray-400 pb-1 px-4">
              Upload Data from CSV File
            </p>{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <label
                className="block mb-2 font-[Poppins] text-sm font-medium text-gray-900"
                htmlFor="file_input"
              >
                Enter Group Name
              </label>
              <input
                className="p-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none font-[Roboto]"
                placeholder="Enter Group Name"
                value={groupName}
                onChange={handleGroupNameChange}
                mt={4}
              />{" "}
              <br />
              <label
                className="block mb-2 font-[Poppins] text-sm font-medium text-gray-900"
                htmlFor="file_input"
              >
                Upload file
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none font-[Roboto]"
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              {/* <p
                className="mt-1 font-[Roboto] text-sm text-gray-500"
                id="file_input_help"
              >
                Only .csv file accepted.
              </p> */}
              <p className="text-xs md:text-sm text-red-600 font-medium font-[Roboto] mr-3">
                (Max Recipients : 10000)
              </p>
              {error && (
                <p className="my-2 text-center font-[Poppins] font-semibold text-sm text-red-600">
                  Error: {error}
                </p>
              )}
              <div className="mt-4 flex items-center justify-around">
                <a
                  href="/Sample CSV File Format.csv"
                  download="Sample CSV File Format.csv"
                >
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={clearFileInput}
                  >
                    Download CSV File Format
                  </Button>
                </a>
                <Button colorScheme="blue" size="md" onClick={handleCreate}>
                  Create
                </Button>
                <Button colorScheme="red" size="sm" onClick={clearFileInput}>
                  Clear All Data
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CSV;
