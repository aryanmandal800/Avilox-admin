import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";

import AdminPanelLayout from "./AdminPanelLayout.js";


const AdminPanel = () => {
 
  return (
    <>
   
      <NavTemplate tab={"Admin Panel"}>
      <PageBody>
      <AdminPanelLayout/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default AdminPanel;

