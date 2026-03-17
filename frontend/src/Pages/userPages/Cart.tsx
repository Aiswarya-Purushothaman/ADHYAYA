import React, { useEffect, useState } from "react";
import { Course, Cart as CartType } from "../../utils/types";
import { ObjectId } from "mongoose";
import Header from "./Header";
import { createCheckout, unCart } from "../../utils/Axios/api";
import { fetchMyitems } from "../../utils/Axios/api";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js"
import { useError } from "./ErrorBoundary";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../utils/redux/slices/userAuthSlice";
import LoadingSpinner from "../../helpers/Loader";


interface CartProps {
  courses: Course[];
}


const CartComponent: React.FC<CartProps> = ({ courses }) => {
  const [cartCourses, setCartCourses] = useState<Course[]>(courses);
  const [isLoading,setIsLoading]=useState(false)
  // const [unCarts, setUnCarts] = useState(false);
  const { userInfo } = useSelector((state: any) => state.userAuth);

const throwError=useError()
const dispatch = useDispatch();

  const removeFromCart = async (id: ObjectId) => {
    try {
    
      console.log(id, "data");
      const response = await unCart({ id });
      console.log(response.data,'removecart')
    
      if (response && response.data && response.data.cart) {

        const updatedCart = response.data.cart;
        setCartCourses(updatedCart);
        
        dispatch(setUserDetails(response.data));
console.log(userInfo,"userInfo");

        // setUnCarts(true);
      }
    } catch (error:any) {
      const message=error?.response?.data?.message
      console.log(error,"erorrorororr");
      throwError(message)
    }
   
  };

  const totalPrice = cartCourses.reduce(
    (total, course) => total + course.price,
    0
  );

  const makePament = async () => {
    try {
      const stripe = await loadStripe(
        process.env.LOAD_STRIPE_SECRET_KEY as string
      );
      const body = {
        products: cartCourses,
        Total:totalPrice
      };
      localStorage.setItem("Total",totalPrice.toString())
      console.log('called')
      const response = await createCheckout( {data:body} );
       console.log(response,"kkkkkk")
       if (response.data) {
        const session = response.data;
        const result = await stripe?.redirectToCheckout({
          sessionId: session,
        });
      }
    
    } catch (error:any) {
      const message=error.response.data.message
      console.log(error,"erorrorororr");
      throwError(message)
    }

  

  };

  useEffect(() => {

    const CartItemsfetch = async () => {
      setIsLoading(true)
      try {
        const response = await fetchMyitems();
      console.log(response, "response");
      if(response.data.length===0){
        setIsLoading(false)
      }
      if (response.data) {
        setCartCourses(response.data);
        setIsLoading(false)
      }
      } catch (error:any) {
        const message=error.response.data.message
        console.log(error,"erorrorororr");
        throwError(message)
      }
      
    };
    CartItemsfetch();
  }, [cartCourses.length]);

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto mt-1 p-20 h-full overflow-y-auto  bg-white shadow-lg rounded-lg  mb-10">
        <div className="flex justify-between  items-center ">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
        </div>
      {isLoading?(
        <LoadingSpinner />
      ):(
         cartCourses.length === 0 ? (
          <div className="text-center ">
            <img
              src="https://cdn-icons-png.freepik.com/512/9332/9332309.png?ga=GA1.1.123369978.1716992511"
              alt="Empty Cart"
              className="w-32 h-32 mx-auto mb-4"
            />
            <p className="text-gray-500">Your cart is empty.</p>
          </div>
        ) : (
          <>
        
            <ul className="divide-y divide-gray-200 ">
              {cartCourses.map(
                (course) =>
                  course &&
                  course._id && (
                    <li
                      key={course._id.toString()}
                      className="py-4 flex items-center"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-24 h-24 object-cover rounded-md mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                          {course.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Price: ${course.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(course._id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        Remove
                      </button>
                    </li>
                  )
              )}
            </ul>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg font-semibold">Total:</p>
              <p className="text-lg font-semibold">${totalPrice}</p>
            </div>
            <div className="mt-6">
              <button
                onClick={makePament}
                className="bg-gradient-to-br from-red-600 to-pink-500 text-white py-2 px-6 rounded-md hover:bg-pink-600 transition-transform duration-300 hover:scale-110"
              >
                Checkout
              </button>
            </div>
          </>
        )
      )}
      </div>
    </>
  );
};

export default CartComponent;
