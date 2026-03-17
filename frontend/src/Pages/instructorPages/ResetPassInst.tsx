import { useState } from "react";
import "../../style/resetpassword.css";
import { toast } from "react-toastify";
import { PasswordUpdateInst } from "../../utils/Axios/api";
import { useNavigate } from "react-router-dom";

const ResetPassInst = () => {
  const [newpass, setNewPass] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const navigate = useNavigate();

  const validatePassword = (newpass: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(newpass);
  };

  const HandleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (newpass !== confirmpass) {
        toast.error("Passwords do not match.");
        return;
      }
      if (!validatePassword(newpass)) {
        toast.error(
          "Password should have minimum 8 characters with at least one special character"
        );
        return;
      }

      if (newpass === confirmpass) {
        const email = localStorage.getItem("datainst");

        const response = await PasswordUpdateInst({ email, newpass });
        console.log(response.data, "heyehe");
        if (response) {
          localStorage.removeItem("datainst");
          toast.success("Password updated");
          navigate("/instructor/login");
        }
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center bg-orbitr">
        <div className="bg-gradient-to-br from-red-600 to-pink-500 h-96 w-96 flex flex-col items-center justify-center p-16 rounded-lg shadow-2xl z-10 animate-dropIn">
          <img
            src="https://icons.veryicon.com/png/o/business/urban-intelligent-logistics-icon/change-password-20.png"
            alt="Reset Password"
            className="mb-4 w-16 h-16 object-cover bg-emerald-50 rounded-lg shadow-2xl "
          />
          <h2 className="text-3xl  text-white mb-4">Reset Password</h2>
          <form className="w-full" onSubmit={HandleSubmit}>
            <div className="mb-4">
              <label className="block text-white text-sm mx-2 font-medium mb-2">
                Enter New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={newpass}
                onChange={(e) => setNewPass(e.target.value)}
                className="bg-white rounded-full text-black p-1 focus:outline-none w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm mx-2 font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmpass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="bg-white rounded-full text-black p-1 focus:outline-none w-full"
              />
            </div>
            <button
              type="submit"
              className="w-40 mx-12 py-2 mt-4 bg-white text-gray-500 rounded-full hover:text-white hover:bg-gradient-to-br from-red-600 to-pink-500  transition duration-300"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassInst;
