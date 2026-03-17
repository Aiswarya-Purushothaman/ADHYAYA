import React, { createContext, useState, useContext } from "react";
import { ChildrenProps, ErrorHandler } from "../../utils/types";
import { instRefreshToken } from "../../utils/Axios/api";
import { logoutinst } from "../../utils/redux/slices/instructorAuthSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const ErrorContext = createContext<ErrorHandler>(() => {});

export const ErrorProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [error, setError] = useState(null);
  const [hasError, setHasError] = useState(false);

  const throwError = (error: any) => {
    setError(error);
    
    if (error === "No Token found") {
      setHasError(true);
    } else {
      return;
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const HandleRefreshToken = async () => {
    try {
      const update = await instRefreshToken();
      console.log(update, "update");

      if (update?.data) {
        setHasError(false);
        window.location.reload();
      }
    } catch (error: any) {
      
      if (error.response.data.message === "No refreshToken") {
        dispatch(logoutinst(null));
        setHasError(false);
        navigate("/instructor/login");
      }
    }
  };

  const ErrorComponent = () => {
    return (
      <div>
        <h1>Something Wrong</h1>
        <button className="bg-blue-400 p" onClick={HandleRefreshToken}>
          Refresh
        </button>
      </div>
    );
  };

  return (
    <ErrorContext.Provider value={throwError}>
      {hasError ? ErrorComponent() : children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  console.log("context");
  return useContext(ErrorContext);
};
