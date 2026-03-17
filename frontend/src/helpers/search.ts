
export function Search(items:any,searchQuery:string,firstFilter:string,secondFilter:string){
  console.log(items,'iitemsssssss')
const filteredCourses = items.filter((item:any) => {
  const firstFilterMatch = item[firstFilter].toLowerCase().includes(searchQuery.toLowerCase());
  const secondFilterMatch = item[secondFilter].toLowerCase().includes(searchQuery.toLowerCase());
  return firstFilterMatch || secondFilterMatch
});
console.log(filteredCourses,"filteredCoursesfilteredCourses");

return filteredCourses
}

