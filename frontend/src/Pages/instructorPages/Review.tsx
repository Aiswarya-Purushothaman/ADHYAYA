import { useEffect, useState } from "react";
import { reviewProps, Reviews } from "../../utils/types";
import { useError } from "../../Pages/instructorPages/InstErrorBoundary";
import { FetchAllReviews, FetchAllReviewsInst, reviewReply, submitcourseReviews } from "../../utils/Axios/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Paginate } from "../../helpers/paginate";
import { Pagination, Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const Review: React.FC<reviewProps> = (course) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);
  const throwError = useError();
  const [reviewCount, setReviewCount] = useState(0);
  const [newreview, setReview] = useState(false);
  const [errors, setErrors] = useState<{
    comment: string;

    rating: number | string;
  }>({ comment: "", rating: 0 });
  const [averageRating, setAverageRating] = useState(0);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const coursesPerPage = 6;
  const [visibleReplies, setVisibleReplies] = useState<{ [key: string]: boolean }>({});
  
  const handleToggleReply = (reviewId: string) => {
    setVisibleReplies(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const navigate = useNavigate();
  const handleReview = async () => {
    try {
      const courseId = course?.course?._id;
      if (!comment.trim()) {
        errors.comment = "Enter a comment to submit";
        return;
      }
      if (rating === 0) {
        errors.rating = "Select a rating for the course";
        return;
      }
      errors.comment = "";
      errors.rating = 0;
      console.log(comment, rating);

      const res = await submitcourseReviews({
        courseId: courseId,
        comment: comment,
        rating: rating,
      });

      if (res.data) {
        setComment("");
        setRating(1);
        setReview((prev) => !prev);
        toast.success("Review Submitted");
      }
    } catch (error: any) {
      const message = error?.data?.message;
      console.log(error);
      throwError(message);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await FetchAllReviewsInst();
        console.log(response?.data, "responseresponse");

        if (response?.data) {
          const filtered = response.data.filter(
            (review: { courseId: { _id: { toString: () => any } } }) =>
              review.courseId._id.toString() === course?.course?._id.toString()
          );

          const { totalPages, currentCourses } = Paginate(
            filtered,
            currentPage,
            coursesPerPage
          );
          setPages(totalPages);
          setFilteredReviews(currentCourses);
          setReviewCount(filtered?.length);

          const totalRating = filtered.reduce(
            (sum: number, review: Reviews) => sum + review.rating,
            0
          );
          const average = totalRating / filtered.length || 0;
          setAverageRating(parseFloat(average.toFixed(2)));
        }
      } catch (error: any) {
        const message = error?.response?.data?.message;
        console.log(error, "erorrorororr in hrere");
        throwError(message);
      }
    };
    fetchReviews();
  }, [course, newreview, currentPage,selectedReviewId]);

  const { userInfo } = useSelector((state: any) => state.userAuth);

  const handleReply = async (reviewId: string) => {
    try {
      const response=await reviewReply({reviewId,reply})
      setSelectedReviewId(null)

    } catch (error) {
      
    }
  };
  console.log(filteredReviews, "filtered");

  return (
    <>
      <div className="px-16 pb-16 p-6 bg-white shadow-md rounded-lg ">
        <h1 className="text-2xl font-semibold mb-4 text-center text-zinc-700">
          Review & Comments
        </h1>
        <div className="flex  justify-center   items-center mb-4">
          <div className=" flex flex-col items-center rounded-full ">
            <h2 className="text-4xl font-bold">{averageRating}</h2>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`text-3xl ${
                    index < averageRating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <p>
              {reviewCount}
              {"  Reviews"}
            </p>
          </div>
        </div>

        {filteredReviews.length > 0 ? (
          filteredReviews.map((review: Reviews) => (
            <div
              key={review._id}
              className="mb-5 p-2   bg-gray-50 rounded-md shadow-sm border-2"
            >
              <div className="flex items-center mb-2">
                <img
                  src={review.studentId.profileImage}
                  alt={`${review.studentId.name}'s profile`}
                  className="mr-2 bg-gray-300 w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-semibold">{review.studentId.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p>{review.comment}</p>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((star, index) => (
                  <span
                    key={index}
                    className={`text-xl ${
                      index < review.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <div className="flex items-center mt-2">
              {review.reply && (
                <button 
                  onClick={() => handleToggleReply(review._id)} 
                  className="text-gray-500 hover:underline flex items-center"
                >
                  <FontAwesomeIcon 
                    icon={visibleReplies[review._id] ? faChevronUp : faChevronDown} 
                    className="mr-2"
                  />
                </button>
              )}
            </div>
            {visibleReplies[review._id] && review.reply && (
              <div className="mt-2 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <p className="font-semibold text-blue-900">Replied:</p>
                <p>{review.reply}</p>
              </div>
            )}
            

              <div className="mt-2">
                {selectedReviewId === review._id ? (
                  <div>
                    <textarea
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write your reply here..."
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => handleReply(review._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => setSelectedReviewId(null)}
                      className="text-gray-500 px-4 py-2 rounded mt-2 ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                 !review.reply &&(
                  <button
                  onClick={() => setSelectedReviewId(review._id)}
                  className="bg-green-500 text-white px-4 text-sm p-1  rounded mt-2"
                >
                  Reply
                </button>
                 )
                  
                )}
                
              </div>
            </div>
          ))
        ) : (
          <p>No reviews for this course.</p>
        )}
        <div></div>
        <div className="flex justify-center items-center  pb-10 ">
          {pages > 1 && (
            <div className="flex justify-center items-center mb-20">
              <Stack spacing={2}>
                <Pagination
                  count={pages}
                  page={currentPage}
                  onChange={(_event, value) => setCurrentPage(value)}
                />
              </Stack>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Review;
