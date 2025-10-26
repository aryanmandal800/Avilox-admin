import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import User from "./user.js";

const UserLayout = () => {

  return (
    <>
   
      <NavTemplate tab={"User Management"}>
      <PageBody>
        <User/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default UserLayout;
