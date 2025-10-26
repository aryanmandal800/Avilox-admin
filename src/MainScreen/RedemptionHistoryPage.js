import React from "react";
import NavTemplate from "../components/NavTemplate.js";
import PageBody from "../components/PageBody.js";
import RedemtionHistory from "./RedemtionHistory.js";

const RedemptionHistoryPage = () => {
  return (
    <>
      <NavTemplate tab={"Redemption History"}>
        <PageBody>
          <RedemtionHistory />
        </PageBody>
      </NavTemplate>
    </>
  );
};

export default RedemptionHistoryPage;
