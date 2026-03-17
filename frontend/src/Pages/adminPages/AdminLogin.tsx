
import { adminLogin } from "../../utils/Axios/api";
import { useState } from "react";
import { toast } from "react-toastify";
import "../../style/adminlogin.css";
import { useDispatch } from "react-redux";
import { setAdminDetails } from "../../utils/redux/slices/adminAuthSlice";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitLogin = async (e: any) => {
    e.preventDefault();
    console.log("login aTtempt", { email, password });

    if (!email || !password) {
      console.log("Missing email or password");
      toast.error("Email and password are required");
      return;
    }

    try {
      const response = await adminLogin({ email, password });
      console.log(response, "login res of admin");
      if (response.data) {
        dispatch(setAdminDetails(response.data));
        toast.success("Login successful");
        navigate("/admin/dashboard");
      } else {
        toast.error("Login failed: " + response.data.message);
      }
    } catch (err: any) {
      console.log(err, "errr hain");
      if (err.response && err.response.data && err.response.data.message) {
        toast.error("Error: " + err.response.data.message);
      } else {
        toast.error("wrong credentials ");
        // toast.error("wrong credentials " + err.message);
      }
    }
  };

  return (
    <>
      <div className="bg-white flex items-center justify-center min-h-screen bg-orbit-admin p-4">
        <div className="flex flex-col md:flex-row w-full max-w-4xl ">
          <div className="bg-white text-white p-8 md:w-1/2 w-full flex flex-col justify-center custom-shadow ">
            <h2 className="text-2xl font-bold mb-8 text-black">Admin-In</h2>
            <form onSubmit={submitLogin}>
              <div className="flex flex-col mb-4">
                <label className="text-sm mb-1 px-3 text-black">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  name="email"
                  className="bg-gray-200 rounded-full text-black p-2 focus:outline-none"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="text-sm mb-1 px-3 text-black">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  className="bg-gray-200 rounded-full text-black p-2 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="bg-gradient-to-br from-red-600 to-pink-500 text-white px-4 py-2 ml-36 rounded-full hover:bg-white hover:text-black transition duration-300">
                Sign In
              </button>
            </form>

            <div className="flex items-center justify-between mt-6 mb-4">
              <div className="custom-checkbox flex items-center">
                <input
                  type="checkbox"
                  id="remember_me"
                  name="remember_me"
                  className="mr-2"
                />
                <label className="text-sm text-transparent bg-gradient-to-br from-red-600 hover:underline to-pink-500 bg-clip-text">
                  Remember me
                </label>
              </div>
              <Link
                to={"/admin/forgotpassword"}
                className="text-sm text-gray-500 hover:text-black transition duration-300"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-pink-500 text-white p-4 md:w-1/2 w-full flex items-center justify-center">
            <div className="flex flex-col text-center items-center justify-center">
              <h1 className="text-4xl font-custom">ADHYAYA</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
