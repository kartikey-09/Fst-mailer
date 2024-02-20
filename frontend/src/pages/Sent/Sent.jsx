import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ParticlesBackground from "../Home/ParticlesBackground";
import { useEffect } from "react";
import { useState } from "react";
import { url } from "../../api";
import axios from "axios";
import Loader from "./../../components/Loader/Loader";
import Message from "./Message";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { toast } from "react-hot-toast";

const Sent = () => {
  // for pagination
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(); // no of data in database
  const [resultCount, setResultCount] = useState(); // no of data coming from server from any request
  const [lastPageNo, setLastPageNo] = useState(1);

  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!admin._id) {
      navigate("/login");
    }
  }, [navigate, admin]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [data, setData] = useState([]);
  const [copyOfOriginalData, setCopyofOriginalData] = React.useState([]);
  // eslint-disable-next-line
  const [total, setTotal] = useState(0); // no. of data come from server

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${url}/api/mails/get-mails/${admin._id}?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: admin.token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setData(res.data.data);
        // console.log(res.data.data);
        setCopyofOriginalData(res.data.data);
        setTotal(res.data.data.length);
        setTotalCount(res.data.totalCount);
        setResultCount(res.data.resultCount);
        setLastPageNo(Math.ceil(res.data.totalCount / pageSize));
      }
    } catch (err) {
      // console.log(err);
      if (err?.response?.data?.message) {
        // console.log(err?.response?.data?.message);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [admin, pageNo, pageSize]);

  const deletebtn = async (id) => {
    try {
      const res = await axios.delete(`${url}/api/mails/delete-mail/${id}`, {
        headers: {
          Authorization: admin.token,
          "Content-Type": "application/json",
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        getData();
      }
    } catch (err) {
      toast.error(err.response.data.message);
      // console.log(err);
    }
  };

  const handleAllDelete = async () => {
    try {
      const res = await axios.delete(
        `${url}/api/mails/delete-mail/delete-all-mails`,
        {
          headers: {
            Authorization: admin.token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        getData();
      }
    } catch (err) {
      toast.error(err.response.data.message);
      // console.log(err);
    }
  };

  // //! pagination button function
  const paginationButtonFunction = async (buttonType) => {
    if (buttonType === "prev") {
      if (pageNo === 1) return;
      setPageNo(pageNo - 1);
    } else if (buttonType === "next") {
      if (pageNo === lastPageNo) return;
      setPageNo(pageNo + 1);
    }
    // data automatically fetch by useEffect
  };

  // //! handle search
  const [text, setText] = React.useState("");
  // eslint-disable-next-line
  const handleTextChange = (e)=>{
    setText(e.target.value);
  }
  // eslint-disable-next-line
  const handleSearch = () => {
    if (!text.length) {
      return;
    }
    const filteredData =
      copyOfOriginalData &&
      copyOfOriginalData.filter(
        (item) =>
          (item.subject &&
            item.subject
              .toString()
              .toLowerCase()
              .includes(text.toLowerCase())) ||
          (item.content &&
            item.content.toLowerCase().includes(text.toLowerCase())) ||
          (item.createdAt &&
            item.createdAt.toLowerCase().includes(text.toLowerCase())) ||
          (item.senderId.name &&
            item.senderId.name
              .toString()
              .toLowerCase()
              .includes(text.toLowerCase()))
      );
    // console.log("filteredData", filteredData);
    setData(filteredData);
  };
  useEffect(() => {
    if (!text) {
      setData(copyOfOriginalData);
    }
  }, [text, copyOfOriginalData]);

  return (
    <div>
      <ParticlesBackground />
      <Navbar />

      {/* ḥeader component */}
      <div
        className="relative overflow-hidden bg-transparent"
        style={{ height: "200px" }}
      ></div>

      {loading ? (
        <div className="fixed top-0 h-screen w-screen bg-transparent grid place-items-center">
          <Loader h={60} w={60} color="blue" />
        </div>
      ) : (
        <>
          <div
            className="border-2 bg-white border-gray-400 my-4 mx-4  md:px-3 py-2 md:py-4 rounded-md"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            <div className="flex justify-between items-center mx-4 md:mx-8">
              <p className="text-md font-[Poppins] text-blue-700 md:text-xl font-medium">
                Total: {data?.length}
              </p>

              <div className="flex flex-wrap justify-center items-center">
                {/* <div className="text-black mr-3">
                  <input
                    type="text"
                    placeholder="Enter any text"
                    value={text}
                    onChange={handleTextChange}
                    className="rounded-md py-1"
                  />
                </div>

                <div className="mr-3">
                  <Button
                    colorScheme="blue"
                    size="sm"
                    type="button"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div> */}

                {data?.length > 0 && admin.role === "Admin" && (
                  <div className="mr-3" onClick={handleAllDelete}>
                    <Button colorScheme="red" size="sm">
                      Delete All
                    </Button>
                  </div>
                )}

                <div
                  onClick={getData}
                  className="max-w-max rounded-md px-3.5 py-1 flex justify-center items-center m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-blue-700 text-indigo-600 hover:text-white"
                >
                  <span className="absolute w-64 h-0 transition-all duration-500 origin-center rotate-45 -translate-x-20 bg-blue-700 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                  <span className="relative text-blue-700 transition duration-300 group-hover:text-white ease">
                    Refresh
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-6 lg:mt-8">
              <TableContainer>
                <Table variant="striped" colorScheme="blue">
                  <Thead>
                    <Tr>
                      <Th>S.No</Th>
                      <Th>Date</Th>
                      <Th>Time</Th>
                      <Th>From</Th>
                      <Th>Receivers</Th>
                      {admin.role === "Admin" && <Th>Action</Th>}
                      <Th>Mail</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.length > 0 ? (
                      data?.map((item, index) => {
                        return (
                          <Message
                            item={item}
                            key={index}
                            index={index}
                            deletebtn={deletebtn}
                          />
                        );
                      })
                    ) : (
                      <Tr>
                        <Th>No Data found</Th>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>

              {/* pagination handling */}
              <div className="pagination-section">
                <div className="text-gray-600">
                  Showing {(pageNo - 1) * pageSize + 1} to{" "}
                  {(pageNo - 1) * pageSize + resultCount} of {totalCount}{" "}
                  Results
                </div>

                <div className="text-gray-600">
                  <span>
                    Page no : {pageNo} of {Math.ceil(lastPageNo)}
                  </span>{" "}
                  <span>Page Size : {pageSize}</span>
                </div>

                <div className="pagination-handle-section">
                  <button
                    type="button"
                    className="prev-button"
                    onClick={(e) => paginationButtonFunction("prev")}
                    disabled={pageNo === 1}
                  >
                    Prev
                  </button>
                  <select
                    id=""
                    name="pageSize"
                    className="ml-1 mr-1 text-white bg-gray-400"
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="250">250</option>
                    <option value="500">500</option>
                  </select>
                  <button
                    type="button"
                    className="next-button"
                    onClick={(e) => paginationButtonFunction("next")}
                    disabled={pageNo >= lastPageNo}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sent;
