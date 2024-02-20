import React from "react";
import {
  Tr,
  Td,
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
import Receivers from "./Receivers";
import { useSelector } from "react-redux";
// import { url } from "../../api";
// import { createObjectCsvWriter } from "csv-writer";
// import { saveAs } from "file-saver";

const Message = ({ item, index, deletebtn }) => {
  console.log(item);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const admin = useSelector((state) => state.admin);

  const btnRef = React.useRef(null);

  const formatCreatedAtDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  function getTimeFromCreatedAt(createdAt) {
    const date = new Date(createdAt);
    const options = { hour: "numeric", minute: "numeric", second: "numeric" };
    return date.toLocaleTimeString("en-US", options);
  }

  // download csv result
  // const downloadCSVResult = async (_id) => {
  //   try {
  //     // Fetch data from your API
  //     const response = await fetch(`http://localhost:5000/api/mails/downloadCSV/${_id}`);
  //     const data = await response.json();

  //     if (!data.success) {
  //       console.error("Error fetching data:", data.message);
  //       return;
  //     }

  //     // Generate the CSV content
  //     const csvWriter = createObjectCsvWriter({
  //       header: [
  //         { id: "receivers", title: "Receivers" },
  //         { id: "acceptedMailIds", title: "Accepted Mails" },
  //         { id: "rejectedMailIds", title: "Rejected Mails" },
  //       ],
  //     });

  //     const records = [
  //       {
  //         receivers: data.data.receivers.join(", "),
  //         acceptedMailIds: data.data.acceptedMailIds.join(", "),
  //         rejectedMailIds: data.data.rejectedMailIds.join(", "),
  //       },
  //     ];

  //     csvWriter.writeRecords(records).then(async (csvContent) => {
  //       // Create a Blob from the CSV content
  //       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

  //       // Initiate the download using FileSaver.js
  //       saveAs(blob, "data.csv");
  //     });
  //   } catch (error) {
  //     console.error("Error downloading CSV:", error);
  //   }
  // };

  return (
    <>
      <Tr className="text-sm font-[Roboto] font-medium">
        <Td>{index + 1}</Td>
        <Td>{formatCreatedAtDate(item.createdAt)}</Td>
        <Td>{getTimeFromCreatedAt(item.createdAt)}</Td>
        <Td>{item.senderId.name}</Td>

        <Td>
          <Receivers receivers={item.receivers} />
        </Td>
        {/* <Td>
          <button onClick={() => downloadCSVResult(item._id)}>Result</button>
        </Td> */}

        {admin.role === "Admin" && (
          <Td onClick={() => deletebtn(item._id)} className="cursor-pointer">
            <Button colorScheme="red" size="xs">
              Delete
            </Button>
          </Td>
        )}
        <Td>
          <Button
            colorScheme="facebook"
            size="xs"
            ref={btnRef}
            onClick={onOpen}
          >
            View Mail
          </Button>
        </Td>
      </Tr>
      <Modal
        onClose={onClose}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        scrollBehavior="outside"
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <p className="font-[Poppins] text-center text-sm border-b border-gray-400 pb-1 px-4">
              Subject: {item.subject}
            </p>{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div
              className="content_div font-[Poppins]"
              style={{ overflowX: "scroll" }}
              dangerouslySetInnerHTML={{ __html: item?.content }}
            ></div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" size="sm" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Message;
