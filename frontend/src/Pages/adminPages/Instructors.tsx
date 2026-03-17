import { useEffect, useState } from "react";
import Header from "./Header";
import SidebarAdmin from "./SidebarAdmin";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ChangeBlockInstructor, FetchInstructors } from "../../utils/Axios/api";
import { Instructor } from "../../utils/types";
import ConfirmModal from "./ConfirmModal";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Search,} from "../../helpers/search";
import {  Paginate } from "../../helpers/paginate";


const Instructors = () => {
  const [instructor, setInstructor] = useState<Instructor[] | any>([]);
  const [filteredInstructor, setFilteredData] = useState<Instructor[] | any>(
    []
  );
  const [paginatedInstructors, setPaginatedInstructors] = useState<Instructor[] | any>([]);
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
      console.log(selectedStudent, blockStatus, "selectedStudent");

      const changeBlock = await ChangeBlockInstructor({
        id: selectedStudent,
        status: blockStatus,
      });
      console.log(changeBlock, "changeBlock");
      // setInstructor(changeBlock.data);
      setShowModal(false);
      setSelectedStudent(null);
    }
  };
  const searchInst = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instructor = await FetchInstructors();
        console.log(instructor.data, "instructor");

        setInstructor(instructor.data);
        setFilteredData(instructor.data);
      } catch (error) {
        console.log(error, "error in fetch");
      }
    };
    fetchData();
  }, [showModal]);

  useEffect(() => {
    const filteredData = Search(instructor, searchQuery, "name", "email");
    setFilteredData(filteredData);
    setCurrentPage(1); 
  }, [searchQuery, instructor]);

  useEffect(() => {
    const { totalPages, currentCourses } = Paginate(filteredInstructor, currentPage, studentsPerPage);
    setPaginatedInstructors(currentCourses);
    setPages(totalPages);
  }, [filteredInstructor, currentPage]);

  return (
    <>
      <Header />
      <div className="flex h-full">
        <SidebarAdmin />
        <div className="flex-1 p-2 flex flex-col items-center h-full">
          <div className="flex items-center mb-4 w-full max-w-md relative">
            <input
              type="text"
              placeholder="Search Instructors..."
              className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none pl-10"
              onChange={(e) => searchInst(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
          <div className="w-full p-4 bg-white rounded-lg shadow-lg h-full">
            {paginatedInstructors.map((instructor: any) => (
              <div
                key={instructor.id}
                className="flex items-center mb-4 bg-white p-4 rounded shadow-md w-full max-w-2xl mx-auto"
              >
                <img
                  src={
                    instructor.profileImage
                      ? instructor.profileImage
                      : "https://via.placeholder.com/50"
                  }
                  alt={`${instructor.name}'s profile`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-1">
                  <p className="font-medium">{instructor.name}</p>
                </div>
                <div className="flex space-x-2">
                  {instructor.isBlocked === false ? (
                    <button
                      onClick={() => handleBlock(instructor._id, true)}
                      className="bg-green-700  font-semibold h-8  w-16 text-sm text-white rounded-lg  transition-transform duration-300 hover:scale-110"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(instructor._id, false)}
                      className="bg-red-700 font-semibold h-8  w-16 text-sm  text-white rounded-lg  transition-transform duration-300 hover:scale-110"
                    >
                      Unblock
                    </button>
                  )}
                  <button className="bg-cyan-700 font-semibold h-8  w-20 text-sm  text-white rounded-lg  transition-transform duration-300 hover:scale-110">
                    <Link
                      to={`/admin/instructors/instructorDetails/${instructor._id}`}
                    >
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
            ? "Are you sure you want to block this instructor?"
            : "Are you sure you want to unblock this instructor?"
        }
      />
    </>
  );
};

export default Instructors;
