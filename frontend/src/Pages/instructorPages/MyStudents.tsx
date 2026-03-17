import React, { useEffect, useState } from 'react'
import { fetchMyStudents } from '../../utils/Axios/api';
import InstSideBar from './InstSideBar';
import InstHeader from './instHeader';
import { User } from '../../utils/types';
import { Paginate } from '../../helpers/paginate';
import {  Pagination, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const MyStudents = () => {
  const [paginatedStudents, setPaginatedStudents] = useState<User[] | any>([]);
  const [filteredStudents, setFilteredData] = useState<User[] | any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const studentsPerPage = 4;

  useEffect(()=>{

    const fetchstudents=async()=>{
      const students = await fetchMyStudents();
      setFilteredData(students.data);
    }
    fetchstudents()
  },[])
  
  useEffect(() => {
    const { totalPages, currentCourses } = Paginate(filteredStudents, currentPage, studentsPerPage);
    setPaginatedStudents(currentCourses);
    setPages(totalPages);
  }, [filteredStudents, currentPage]);


  return (
   <>
   <InstHeader/>
    <div className='flex overflow-y-hidden  '>
    <InstSideBar/>
    <div className="flex-1 p-2 flex flex-col items-center h-full">
         
          <div className="w-full h-full p-4 bg-white rounded-lg shadow-lg">
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
                
                  <button
                   
                    className="bg-cyan-700 font-semibold h-8  w-20 text-sm  text-white rounded-lg  transition-transform duration-300 hover:scale-110"
                  >
                    <Link  to={`/instructor/students/studentDetails/${student._id}`}>
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
                      onChange={(_event: any, value: React.SetStateAction<number>) => setCurrentPage(value)}
                    />
                  </Stack>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>

   </>
  )
}

export default MyStudents

