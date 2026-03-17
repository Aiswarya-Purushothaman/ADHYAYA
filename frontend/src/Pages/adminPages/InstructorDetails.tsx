import  { useState } from "react";
import Header from "./Header";
import SidebarAdmin from "./SidebarAdmin";

import {  Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { FetchInstructors, } from "../../utils/Axios/api";
import { Instructor } from "../../utils/types";
const InstructorDetails = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState<Instructor[] | any>([]);

 

  useEffect(() => {
    const fetchData = async () => {
      const instructor = await FetchInstructors();
      console.log(instructor, "instructor in frontend");

      if (instructor.data.length) {
        instructor.data.map((item: any) => {
          if (item._id === id) {
            setInstructor(item);
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
                Instructor Profile
              </h1>
              <button className="bg-green-900 p-2 rounded-md text-white transition-transform duration-300 hover:scale-110 ">
            <Link to={"/admin/instructors"}>
            Back
            </Link>
           </button>

              <div className="relative flex flex-col items-center mb-4">
                <img
                  src={instructor.profileImage
                    ? instructor.profileImage
                    :"https://via.placeholder.com/50"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-4"
                />
              </div>
              <div className="mb-4 text-center ">
                <p className="font-medium mt-2">Name: {instructor?.name}</p>
                <p className=" font-medium mt-2">Email: {instructor?.email}</p>
                <p className=" font-medium mt-2">
                  Contact: {instructor?.contact}
                </p>
                <p className=" font-medium mt-2">
                  Description: {instructor?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorDetails;
