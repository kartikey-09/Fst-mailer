import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ParticlesBackground from "../Home/ParticlesBackground";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../../components/Loader/Loader";
import { AiOutlineUserAdd } from "react-icons/ai";
import { toast } from "react-hot-toast";
import axios from "axios";
import { url } from "../../api";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import User from "./User";

const ManageTL = () => {
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState([]);
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if (!admin._id || admin.role !== 'Admin') {
          navigate('/login')
      }
  }, [navigate, admin])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${url}/api/users/create-user`,
        {
          name,
          emailId,
          password,
          role: "TL",
          creator: admin._id,
          teamName,
        },
        {
          headers: {
            Authorization: admin.token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setName("");
        setEmailId("");
        setPassword("");
        setTeamName("");
        getData();
      }
    } catch (err) {
      if (err?.response?.data?.message);
      toast.error(err?.response?.data?.message);
      // console.log(err)
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const [data, setData] = useState([]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${url}/api/users/get-users/?id=${admin._id}`,
        {
          headers: {
            Authorization: admin.token,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setData(res.data.users);
        // console.log(res);
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
          `${url}/api/users/get-users/?id=${admin._id}`,
          {
            headers: {
              Authorization: admin.token,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.data.success) {
          setData(res.data.users);
          // console.log(res);
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
      <div className="bg-white w-11/12  md:w-3/5 relative  border-2 border-gray-600 rounded-md overflow-auto mx-auto  mb-4">
        <form onSubmit={handleSubmit} className="w-full">
          <h3 className="font-[Roboto] bg-blue-700 text-white text-lg font-base text-center mb-4 py-1">
            Create a New TL
          </h3>

          <div className="mx-2 md:mx-4 my-2 flex items-center">
            <span className="mr-1 md:mr-2 font-[Ubuntu] max-w-max">
              TeamName
            </span>
            <input
              type="text"
              value={teamName}
              required={true}
              className="bg-indigo-50 appearance-none border-2 border-indigo-100 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-blue-700"
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div className="mx-2 md:mx-4 my-2 flex items-center">
            <span className="mr-1 md:mr-2 font-[Ubuntu]">TLName</span>
            <input
              type="text"
              value={name}
              required={true}
              className="bg-indigo-50 appearance-none border-2 border-indigo-100 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-blue-700"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mx-2 md:mx-4 my-2 flex items-center">
            <span className="mr-1 md:mr-2 font-[Ubuntu]">Email</span>
            <input
              type="email"
              value={emailId}
              required={true}
              className="bg-indigo-50 appearance-none border-2 border-indigo-100 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-blue-700"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          <div className="mx-2 md:mx-4 my-2 flex items-center">
            <span className="mr-1 md:mr-2 font-[Ubuntu]">Password</span>
            <input
              type="text"
              value={password}
              required={true}
              className="bg-indigo-50 appearance-none border-2 border-indigo-100 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-blue-700"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mx-2 md:mx-4 my-3 flex items-center text-wrap flex-col md:flex-row">
            <span className="ml-4 text-xs md:text-sm underline text-gray-600 font-medium font-[Roboto]">
              NOTE -
            </span>
            <span className="ml-4 text-xs md:text-sm italic text-red-600 font-medium font-[Roboto]">
              Make sure you enter the correct password of Email Id otherwise it
              will not work properly.
            </span>
          </div>

          <div className="mx-2 md:mx-4 my-4 flex justify-center items-center">
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
                  <AiOutlineUserAdd className="mr-1" />
                  Create
                </>
              )}
            </button>
          </div>
        </form>
      </div>

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
            <div className="flex justify-between items-center mx-4 md:mx-8">
              <p className="text-md font-[Poppins] text-blue-700 md:text-xl font-medium">
                Total: {data?.length}
              </p>

              <div className="flex flex-wrap justify-center items-center">
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
                      <Th>Team Name</Th>
                      <Th>TL Name</Th>
                      <Th>Email</Th>
                      <Th>Password</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.length > 0 ? (
                      data?.map((item, index) => {
                        return <User item={item} key={index} index={index} />;
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

export default ManageTL;
