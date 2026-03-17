import { useEffect, useState } from "react";
import Header from "./Header";
import SidebarAdmin from "./SidebarAdmin";
import { PieChart } from '@mui/x-charts';
import { fetchAllcourses, FetchInstructors, FetchStudents } from "../../utils/Axios/api";
import { Course } from "../../utils/types";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const HomeAdmin = () => {
  const [approvedCourses, setApprovedCourses] = useState<Course[]>([]);
  const [categoryData, setCategoryData] = useState<{ id: string; label: string; value: number; }[]>([]);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [instructorCount, setInstructorCount] = useState<number>(0);

  useEffect(() => {
    const RequestedCourse = async () => {
      try {
     
        const studentsResponse = await FetchStudents();
        const instructorsResponse = await FetchInstructors();
        const coursesResponse = await fetchAllcourses();

        setStudentCount(studentsResponse.data.length);
        setInstructorCount(instructorsResponse.data.length);

        const MyCourse = coursesResponse.data;
        const approved = MyCourse.filter((course: { isApproved: string; }) => course.isApproved === "approved");
        setApprovedCourses(approved);

   
        const categoryCounts: { [key: string]: number } = {};
        approved.forEach((course: { category: any; }) => {
          const category = course.category;
          if (categoryCounts[category]) {
            categoryCounts[category]++;
          } else {
            categoryCounts[category] = 1;
          }
        });

      
        const formattedCategoryData = Object.keys(categoryCounts)
          .map(key => ({
            id: key,
            label: key,
            value: categoryCounts[key],
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCategoryData(formattedCategoryData);
      } catch (error: any) {
        console.error(error.message);
        toast.error("Something went wrong");
      }
    };

    RequestedCourse();
  }, []);

  return (
    <>
      <Header />
      <div className="flex">
        <SidebarAdmin />
        <div className="flex flex-col flex-grow p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white shadow-md rounded-lg p-6" >
              <Link to={"/admin/courses"}>
              <h2 className="text-xl font-bold mb-4">Courses</h2>
              <p>Total Approved Courses: {approvedCourses.length}</p>
              </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
            <Link to={"/admin/students"}>
              <h2 className="text-xl font-bold mb-4">Students</h2>
              <p>Total Students: {studentCount}</p>
              </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
            <Link to={"/admin/instructors"}>
              <h2 className="text-xl font-bold mb-4">Instructors</h2>
              <p>Total Instructors: {instructorCount}</p>
              </Link>
            </div>
          </div>
          <div >
          <p className="text-xl font-semibold mt-1 text-center">
            Categories
          </p>
          </div>
         
          <div className="flex justify-center items-center mt-10 w-full ">
            <div style={{ width: '500px', height: '300px' }}>
            
              <PieChart
                series={[
                  {
                    data: categoryData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                height={300}
                width={500}
                tooltip={{ trigger: 'item' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeAdmin;
