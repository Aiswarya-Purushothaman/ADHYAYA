import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useError } from "./ErrorBoundary";
import { ChildrenProps } from "../../utils/types";

const UserProtected: React.FC<ChildrenProps> = ({ children }) => {
  const throwError = useError();
  useEffect(() => {
    const accessToken = Cookies.get("StudentAccessToken");
    const refreshToken = Cookies.get("StudentRefreshToken");

    console.log(accessToken,"accessTokenaccessToken",refreshToken,'refreshTokennnnn');
   
    if (!accessToken) {
      throwError("No Token found");
    }
  }, [throwError]);

  return <>{children}</>;
};

export default UserProtected;
