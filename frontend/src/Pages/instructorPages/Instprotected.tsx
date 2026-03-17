import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useError } from "./InstErrorBoundary";
import { ChildrenProps } from "../../utils/types";

const Instprotected: React.FC<ChildrenProps> = ({ children }) => {
  const throwError = useError();
  useEffect(() => {
    const accessToken = Cookies.get("InstructorAccessToken");
    const refreshToken = Cookies.get("InstructorRefreshToken");

    console.log(accessToken,"accessTokenaccessToken",refreshToken,'refreshTokennnnn');
   
    if (!accessToken) {
      throwError("No Token found");
    }
  }, [throwError]);

  return <>{children}</>;
};

export default Instprotected;
