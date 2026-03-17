import  { useState } from "react";
import Header from "./Header";
import SidebarAdmin from "./SidebarAdmin";

import {  Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { FetchStudents, ChangeBlock } from "../../utils/Axios/api";
import { User } from "../../utils/types";



const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<User[] | any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const student = await FetchStudents();

      if (student.data.length) {
        student.data.map((item: any) => {
          if (item._id === id) {
            setStudent(item);
          }
        });
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="flex overflow-y-hidden ">
        <SidebarAdmin />
        <div className="flex justify-center items-center w-full h-full    bg-gray-100">
          <div className="flex-1 flex justify-center items-center bg-white p-12">
            <div className="bg-white shadow-2xl rounded p-9 w-full max-w-md animate-dropIn">
              <h1 className="text-2xl font-semibold mb-6 text-center">
                Student Profile
              </h1>
           <button className="bg-green-900 p-2 rounded-md text-white transition-transform duration-300 hover:scale-110 ">
            <Link to={"/admin/students"}>
            Back
            </Link>
           </button>

              <div className="relative flex flex-col items-center mb-4">
                <img
                  src={student.profileImage?student.profileImage:"https://via.placeholder.com/50"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-4"
                />
              </div>
              <div className="mb-4 text-center ">
                <p className="font-medium mt-2">Name: {student?.name}</p>
                <p className=" font-medium mt-2">Email: {student?.email}</p>
                <p className=" font-medium mt-2">Contact: {student?.contact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetails;
