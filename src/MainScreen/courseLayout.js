import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import Course from "./course.js";


const CourseLayout = () => {

  return (
    <>
   
      <NavTemplate tab={"Courses"}>
      <PageBody>
        <Course/>
      </PageBody>
      </NavTemplate>
    
    </>
  );
};

export default CourseLayout;
