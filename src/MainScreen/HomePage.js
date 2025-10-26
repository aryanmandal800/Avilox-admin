import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import Home from "./Home.js";

const HomePage = () => {

  return (
    <>
   
      <NavTemplate tab={"Dashboard"}>
      <PageBody>
        <Home/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default HomePage;
