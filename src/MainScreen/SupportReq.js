import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import SupportQuery from "./SupportQuery.js";


const SupportReq = () => {
 
  return (
    <>
   
      <NavTemplate tab={"Support"}>
      <PageBody>
        <SupportQuery/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default SupportReq;

