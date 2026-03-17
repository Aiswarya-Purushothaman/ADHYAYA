import React, { useEffect, useState } from "react";
import Header from "./Header";
import SidebarAdmin from "./SidebarAdmin";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ChangeBlock, FetchStudents } from "../../utils/Axios/api";
import { User } from "../../utils/types";
import ConfirmModal from "./ConfirmModal";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Search,} from "../../helpers/search";
import {  Paginate } from "../../helpers/paginate";

const Students = () => {
  const [student, setStudent] = useState<User[] | any>([]);
  const [filteredStudents, setFilteredData] = useState<User[] | any>([]);
  const [paginatedStudents, setPaginatedStudents] = useState<User[] | any>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [blockStatus, setBlockStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const studentsPerPage = 4;

  const handleBlock = (student: any, status: boolean) => {
    setSelectedStudent(student);
    setBlockStatus(status);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleConfirm = async () => {
    if (selectedStudent) {
      console.log(selectedStudent, "selectedStudent");
      const changeBlock = await ChangeBlock({
        id: selectedStudent,
        status: blockStatus,
      });
      if (changeBlock) {
        // setStudent(changeBlock.data);
        setShowModal(false);
        setSelectedStudent(null);
      }
      console.log(changeBlock, "changeBlock");
    }
  };

  const searchStudent = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchData = async () => {
      const student = await FetchStudents();
      console.log(student.data[0], "student.datgaaaaaaa");

      setStudent(student.data);
      setFilteredData(student.data);
    };
    fetchData();
  }, [showModal,setStudent]);

  useEffect(() => {
    console.log(student,'in search')
    const filteredData = Search(student, searchQuery, "name", "email");
    setFilteredData(filteredData);
    setCurrentPage(1); 
  }, [searchQuery, student]);

  useEffect(() => {
    const { totalPages, currentCourses } = Paginate(filteredStudents, currentPage, studentsPerPage);
    setPaginatedStudents(currentCourses);
    setPages(totalPages);
  }, [filteredStudents, currentPage]);

  return (
    <>
      <Header />
      <div className="flex h-full">
        <SidebarAdmin />
        <div className="flex-1 p-2 flex flex-col items-center h-full">
          <div className="flex items-center mb-4 w-full max-w-md relative">
            <input
              type="text"
              placeholder="Search students..."
              className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none pl-10"
              onChange={(e) => searchStudent(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
          <div className="w-full p-4 bg-white rounded-lg shadow-lg h-full">
            {paginatedStudents.map((student: any) => (
              <div
                key={student.id}
                className="flex items-center mb-4 bg-white p-4 rounded shadow-md w-full max-w-2xl mx-auto"
              >
                <img
                  src={
                    student.profileImage
                      ? student.profileImage
                      : "https://via.placeholder.com/50"
                  }
                  alt={`${student.name}'s profile`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                </div>
                <div className="flex space-x-2">
                  {student.isBlocked === false ? (
                    <button
                      onClick={() => handleBlock(student._id, true)}
                      className="bg-green-700  font-semibold h-8  w-16 text-sm text-white rounded-lg  transition-transform duration-300 hover:scale-110"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(student._id, false)}
                      className="bg-red-700 font-semibold h-8  w-16 text-sm  text-white rounded-lg  transition-transform duration-300 hover:scale-110"
                    >
                      UnBlock
                    </button>
                  )}
                  <button
                   
                    className="bg-cyan-700 font-semibold h-8  w-20 text-sm  text-white rounded-lg  transition-transform duration-300 hover:scale-110"
                  >
                    <Link  to={`/admin/students/studentDetails/${student._id}`}>
                    Details
                    </Link>
                  </button>
                </div>
              </div>
            ))}
             <div className="flex justify-center items-center mb-20 ">
              {pages >= 1 && (
                <div className="flex justify-center items-center mb-10">
                  <Stack spacing={2}>
                    <Pagination
                      count={pages}
                      page={currentPage}
                      onChange={(event, value) => setCurrentPage(value)}
                    />
                  </Stack>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        message={
          blockStatus
            ? "Are you sure you want to block this student?"
            : "Are you sure you want to unblock this student?"
        }
      />
    </>
  );
};

export default Students;
