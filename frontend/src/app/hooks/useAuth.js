import React, { useEffect } from "react";

const useAuth = () => {
    const userDataString = localStorage.getItem("user");
    const userData = JSON.parse(userDataString);
    // console.log(userData);
    
    return userData;
};

export default useAuth;
