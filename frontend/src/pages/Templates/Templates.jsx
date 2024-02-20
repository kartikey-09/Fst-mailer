import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Content from "./Content";
import ParticlesBackground from "../Home/ParticlesBackground";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "./../../components/Loader/Loader";
import { useSelector } from "react-redux";
import { url } from "./../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


const TemplatePage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);

  useEffect(() => {
    if (!admin._id) {
      navigate("/login");
    }
  }, [navigate, admin]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${url}/api/templates/get-templates`);
        console.log(response.data);
        setTemplateList(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  const onSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setSelectedTemplateId(template._id);
  };

  const onUseTemplate = () => {
    if (selectedTemplate) {
      // Navigate to the "/_compose" page with selected subject and content
      navigate("/_compose", {
        state: {
          subject1: selectedTemplate.subject,
          content1: selectedTemplate.content,
        },
      });
    }
  };
  const  onDeleteTemplate = async () => {
    if (!selectedTemplate) {
      // No template selected, return or show an error message
      return;
    }

    try {
      const response = await axios.delete(
        `${url}/api/templates/delete-template/${selectedTemplate._id}`,
        {
          headers: {
            Authorization: admin.token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Template Deleted ");
        setTemplateList((prevTemplates) =>
          prevTemplates.filter((template) => template._id !== selectedTemplate._id)
        );

        setSelectedTemplate(null);
        setSelectedTemplateId(null);

        console.log(response.data.message);
      } else {
        toast.error(response.data.message || "Error Deleteing template.");
        console.error(response.data.message);
      }
    } catch (error) {
      toast.error( "Error Deleteing template.");
      console.error("Error deleting template:", error);
    }
  };

  return (
    <div className="overflow-hidden">
      <ParticlesBackground />
      <Navbar />
      <div
        className="relative overflow-hidden bg-transparent"
        style={{ height: "100px" }}
      ></div>
      {loading ? (
        <div className="fixed top-0 h-screen w-screen bg-transparent grid place-items-center">
          <Loader h={60} w={60} color="blue" />
        </div>
      ) : (
        <>
          <div className="border-2 bg-white border-gray-400 mx-2 md:px-3 md:py-4 rounded-md animate-zoom-in overflow-hidden">
            <div className="flex justify-between items-center">
              <Sidebar
                templates={templateList}
                onSelectTemplate={onSelectTemplate}
                selectedTemplateId={selectedTemplateId}
              />
              <Content
                selectedTemplate={selectedTemplate}
                onUseTemplate={onUseTemplate}
                onDeleteTemplate={onDeleteTemplate}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplatePage;
