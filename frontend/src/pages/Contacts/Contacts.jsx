import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ParticlesBackground from "../Home/ParticlesBackground";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-hot-toast";
import axios from "axios";
import { url } from "../../api";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import User from "./User";
import CSV from "./CSV";

const Employees = () => {
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (!admin._id ) {
      navigate("/login");
    }
  }, [navigate, admin]);

  const handleSelectChange = (e) => {
    e.preventDefault();
    setSelectedValue(e.target.value);
    getContacts(e.target.value);
  };

  const getContacts = async (selectedValue) => {
    setLoading(true);
    if (selectedValue === "") {
      setData2([]);
    }
    try {
      const res = await axios.get(
        `${url}/api/contacts/get-contacts/?id=${admin._id}&groupName=${selectedValue}`,
        {
          headers: {
            Authorization: admin.token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setData2(res.data.contacts);
        console.log(data2);
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        console.log(err?.response?.data?.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${url}/api/contacts/get-contacts/?id=${admin._id}`,
          {
            headers: {
              Authorization: admin.token,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.data.success) {
          setData(res.data.contacts);
          
        }
      } catch (err) {
        if (err?.response?.data?.message) {
          console.log(err?.response?.data?.message);
        }
      }
      setLoading(false);
    };
    getData();
  }, [admin]);

  const deletebtn = async (id) => {
    try {
      const res = await axios.delete(
        `${url}/api/contacts/delete-contact/${id}`,
        {
          headers: {
            Authorization: admin.token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        getContacts(selectedValue);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
      // console.log(err);
    }
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

      <div className="flex justify-center items-center w-full"></div>

      {/* All Users */}
      {loading ? (
        <div className="fixed top-0 h-screen w-screen bg-transparent grid place-items-center">
          <Loader h={60} w={60} color="blue" />
        </div>
      ) : (
        <>
          <div
            className="border-2 bg-white border-gray-400 mb-4 mt-6 md:mt-12 mx-4  md:px-3 py-2 md:py-4 rounded-md"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            <div className="flex justify-between flex-col md:flex-row items-center mx-4 md:mx-8">
              <p className="text-md font-[Poppins] text-blue-700 md:text-xl font-medium">
                Total: {data2?.length}
              </p>

              <div className="w-[60%]">
                <select
                  value={selectedValue}
                  onChange={handleSelectChange}
                  className="bg-gray-50 border border-gray-300 text-gray-600  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 font-medium font-[Roboto]"
                >
                  <option value="">Select an option</option>
                  {Array.from(new Set(data.map((gr) => gr.groupName))).map((groupName, index) => (
                    <option value={groupName} key={index}>
                      {groupName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap justify-center items-center">
                <div className="mr-3">
                  <CSV admin={admin} />
                </div>

                <div
                  onClick={() => getContacts(selectedValue)}
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
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data2?.length > 0 ? (
                      data2?.map((item, index) => {
                        return (
                          <User
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Employees;
