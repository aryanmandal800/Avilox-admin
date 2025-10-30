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

  const isMobile = screenWidth <= 950;
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
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: { xs: 20, sm: 40, md: 60, lg: 78 },
              top: { xs: 96, md: 82, lg: 12 },
              height: {
                xs: 'calc(100% - 96px)',
                md: 'calc(100% - 82px)',
                lg: 'calc(100% - 82px)'
              }
            },
          }}
        >
          <LeftNavContainer>
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

const LeftNavContainer = styled(Box)({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: 'white',
});

const BodyContainer = styled(Box)({
  flex: 1,
  overflow: "auto",
  padding: "16px 16px 0px 16px",
  marginLeft: 0,
  minHeight: 0,
  "@media (min-width: 900px)": {
    marginLeft: "260px",
  },
  "@media (min-width: 1200px)": {
    marginLeft: "278px",
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
