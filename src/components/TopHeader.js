import React, { useState } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styled from "@emotion/styled";
import { navBarCoordinationOptions } from "../../../constants/constant";
import NavHeader from "../../organisms/header";
import NavBar from "../../organisms/navbar";
import { useUser } from "../../store";

const MainContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  backgroundColor: "white",
});

const LeftNavContainer = styled(Box)(({ isVisible }) => ({
  width: isVisible ? "20%" : "0",
  transition: "width 0.3s ease-in-out",
  overflow: "hidden",
  backgroundColor: "white",
  zIndex: 1000,
  "@media (max-width: 1180px)": {
    display: "block",
    position: "fixed",
    width: "250px",
  },
}));

const BodyContainer = styled(Box)({
  flex: 1,
  overflow: "auto",
  padding: "16px 16px 0px 16px",
  marginLeft: "20%",
  "@media (max-width: 1250px)": {
    marginLeft: "0",
    height: "97vh",
  },
});

const TopHeader = styled(Box)({
  marginBottom: "3%",
});

const NavTemplate = ({ children, showHeader = true, tab }) => {
  const { userInfo } = useUser();
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isMobile = screenWidth <= 1250;
  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <MainContainer>
      {isMobile && !isNavVisible && (
        <IconButton
          onClick={toggleNav}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1001,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        anchor="left"
        open={isMobile ? isNavVisible : true}
        onClose={toggleNav}
        variant={isMobile ? "temporary" : "permanent"}
        style={{ zIndex: 1000 }}
      >
        <LeftNavContainer isVisible={isMobile ? isNavVisible : true}>
          <NavBar currentTab={tab} navOptions={navBarCoordinationOptions} />
        </LeftNavContainer>
      </Drawer>
      <BodyContainer>
        {showHeader && (
          <TopHeader>
            <NavHeader />
          </TopHeader>
        )}
        <Box>{children}</Box>
      </BodyContainer>
    </MainContainer>
  );
};

export default NavTemplate;
