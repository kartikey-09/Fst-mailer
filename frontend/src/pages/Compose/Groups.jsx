import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import axios from "axios";
import { url } from "../../api";

function Groups({ setReceivers }) {
  const [data, setData] = useState([]);
  const admin = useSelector((state) => state.admin);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleSelectChange = (e) => {
    e.preventDefault();
    setSelectedValue(e.target.value);
    console.log(e.target.value);
    getContacts(e.target.value);
  };

  const getContacts = async (selectedValue) => {
    setLoading(true);

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
        let contacts = res?.data?.contacts;
        let arr = [];
        console.log("contactsnew", contacts);
        contacts?.map((contact, index) => {
          arr.push(contact.emailId);
        });
        console.log("arr", arr);
        setReceivers(arr);
        console.log("obj", res.data.contacts);
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

  return (
    <>
      {loading ? (
        <div className="fixed top-0 h-screen w-screen bg-transparent grid place-items-center">
          <Loader h={60} w={60} color="blue" />
        </div>
      ) : (
        <div className="w-[200%]">
          <select
            value={selectedValue}
            onChange={handleSelectChange}
            className="bg-gray-50 border border-gray-300 text-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 font-medium font-[Roboto]"
          >
            <option value="">Select Group</option>
            {Array.from(new Set(data?.map((gr) => gr.groupName)))?.map(
              (groupName2, index) => {
                return (
                  <option value={groupName2} key={index}>
                    {groupName2}
                  </option>
                );
              }
            )}
          </select>
        </div>
      )}
    </>
  );
}

export default Groups;
