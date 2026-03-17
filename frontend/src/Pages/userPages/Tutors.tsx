import  { useEffect, useState } from "react";
import Header from "./Header";
import { FetchInstructors } from "../../utils/Axios/api";
import { Instructor } from "../../utils/types";
import { MdLocationSearching } from "react-icons/md";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import LoadingSpinner from "../../helpers/Loader";

const Tutors = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
     
      try {
        setIsLoading(true)
        const instructorData = await FetchInstructors();
        setInstructors(instructorData.data);
        setFilteredInstructors(instructorData.data);
        setIsLoading(false)
      } catch (error) {
        console.log("Error fetching instructors:", error);
      }
    };

    fetchData();    
  }, []);

  useEffect(() => {
    const filtered = instructors.filter((instructor) =>
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInstructors(filtered);
  }, [searchQuery, instructors]);

  // if (instructors.length === 0) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Header />
      <div className="p-10 h-full overflow-auto">
        <div className="bg-gradient-to-br from-red-600 to-pink-500 flex justify-center gap-5 shadow-2xl w-full h-auto rounded-xl">
          <div className="w-full p-3 ml-10 flex flex-col items-center">
            <p className="text-4xl font-bold text-white mt-12 text-center">
              Instructors Not Only Teach
            </p>
            <p className="text-2xl mt-1 font-bold text-white text-center">
              They Create Professionals.
            </p>
            <p className="text-sm p-4 ml-10 mt-4 text-center max-w-lg text-white">
              Use this website for a brighter career and unlock new
              opportunities for growth and success. ADHYAYA is the most used
              e-learning platform worldwide. It also provides certifications for
              students, helping them validate their skills and knowledge.
              ADHYAYA instructors are highly skilled professionals with proven
              expertise in their respective fields. Learn from the best to
              become the best.
            </p>
          </div>
          <div className="w-full flex justify-center">
            <img
              src="https://img.freepik.com/premium-photo/teacher-teachers-day-modern-vector-illustration_954807-774.jpg"
              alt="Woman working on a laptop"
              className="h-80 mt-5 mb-5 ml-5 mx-10 rounded-3xl"
            />
          </div>
        </div>
        <div className="p-10 px-32">
          <div className="search-box w-96 mt-5 mx-72 shadow-xl rounded-md mb-10 border items-center">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isLoading ? (
            
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {filteredInstructors.length === 0 ? (
              <div className="text-center text-gray-600 mt-10">
                No instructors found.
              </div>
            ) : (
              filteredInstructors.map((instructor) => (
                <div className="bg-white shadow-lg rounded-lg w-72 overflow-hidden transform transition-transform hover:scale-105">
                  <div className="relative h-48 sm:h-56">
                    {instructor.profileImage ? (
                      <img
                        src={instructor.profileImage}
                        alt={instructor.name}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-200">
                        <CgProfile className="text-pink-950 text-sm h-full w-full p-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h2 className="text-lg font-bold text-gray-800 text-center mt-2">
                      {instructor.name}
                    </h2>
                  </div>
                  <div className="absolute bottom-0 right-0 mb-3 mr-3">
                    <Link to={`/tutors/instructorDetails/${instructor._id}`}>
                      <button className="text-white hover:text-black bg-gradient-to-br from-red-600 to-pink-500 rounded-full p-2">
                        <MdLocationSearching size={20} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          )}
          
        </div>
      </div>
    </>
  );
};

export default Tutors;
