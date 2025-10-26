import React, { useEffect, useState } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styled from "@emotion/styled";
import { navBarCoordinationOptions } from "./constant";
import NavHeader from "./NavHeader";
import NavBar from "./NavBar";

const NavTemplate = ({ children, showHeader = true, tab }) => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = screenWidth <= 1250;
  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <div>
      {/* Navbar Header Section */}
      {showHeader && (
        <TopHeader>
          <NavHeader />
        </TopHeader>
      )}

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
          <Box>{children}</Box>
        </BodyContainer>
      </MainContainer>
    </div>
  );
};

export default NavTemplate;


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
  minHeight: 0,
  "@media (max-width: 1250px)": {
    marginLeft: "0",
    height: "auto",
    minHeight: 0,
  },
});

const TopHeader = styled(Box)({
  backgroundColor: "#1a1a1a",
  padding: "16px",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
  width: "100%",
  zIndex: 1100,
});
