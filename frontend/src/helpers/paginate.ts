

export function Paginate (filteredCourses:[],currentPage:number,itemsperPage:number){
  const indexOfLastCourse = currentPage * itemsperPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsperPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / itemsperPage);

return {totalPages,currentCourses}
}