import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({
  userInfo: null,
  updateUser: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  const updateUser = (newUser) => {
    setUserInfo(newUser);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("userToken");

    try {
      if (storedData) {
        setUserInfo(storedData);
        // const parsedData = JSON.parse(storedData);
        // if (typeof parsedData === "object") {
        //   setUserInfo(parsedData);
        // }
      }
    } catch (error) {
      console.warn("Invalid JSON format in localStorage for userToken.");
      // localStorage.removeItem("userToken");
    }
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
