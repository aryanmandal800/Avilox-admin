import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import Jobs from "./jobs.js";


const JobLayout = () => {

  return (
    <>
   
      <NavTemplate tab={"Jobs"}>
      <PageBody>
       <Jobs/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default JobLayout;
