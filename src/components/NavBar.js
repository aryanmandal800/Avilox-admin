import { Box, Stack } from "@mui/material";
import styled from "@emotion/styled";
import CustomeTypography from "./CustomeTypography";
import { useContext, useEffect, useState } from "react";
import Image from "./Image ";
import "../App.css"
import { useNavigate } from "react-router-dom";
import { UserContext } from "./store";

const NavBar = ({ navOptions, currentTab }) => {
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(currentTab);
 

  useEffect(() => {
    setSelected(currentTab);
  }, [currentTab]);

  const handleNavOptionClick = (label) => {
    setSelected(label);
    
    if(label === "Logout"){
      localStorage.clear();
      updateUser(null);
      navigate("/login");
      return;
    }
    
    const navOpt = label.split(" ").join("-");
    navigate(`/${navOpt.toLowerCase()}`, { state: navOpt });
  };
 
  return (
    <StyledMainBox display={"flex"}>
    
      <StyledStackMain>
        <StyledOptions>
          {navOptions.map((data, index) => {
            const isSelected = selected === data.label;
            return (
              <StyledOptionBox
                key={index}
                onClick={() => handleNavOptionClick(data.label)}
                selected={isSelected}
              >
                <StyledTypoBox>
                  <StyledContentBox>
                    <Image src={data.icon} alt={"GreenSip-logo"} />
                    <StyledTypography className="nav-text" text={data.label} selected={isSelected} />
                  </StyledContentBox>
                </StyledTypoBox>
              </StyledOptionBox>
            );
          })}
        </StyledOptions>
      </StyledStackMain>
    </StyledMainBox>
  );
};

const StyledMainBox = styled(Stack)({
  alignItems: "center",
  position: "fixed",
  marginLeft: "0%",
  marginTop: "5%",
  minHeight: "100%",
  backgroundColor: "white",
  "@media (max-width: 1180px)": {
    marginTop: "0%",
  },
});

const StyledContentBox = styled(Box)({
  display: "flex",
  gap: 30,
});

const StyledTypoBox = styled(Box)({
  padding: "5px 20px",
});

const StyledOptions = styled(Stack)({
  marginTop: "12%",
  gap: 20,
  height: "100vh",
});

const StyledStackMain = styled(Stack)({
  width: "278px",
  height: "600px",
  alignItems: "center",
  overflow: "scroll",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "@media (max-width: 1180px)": {
    height: "90vh",
  },
  "@media (max-width: 500px)": {
    height: "85vh",
  },
});

const StyledOptionBox = styled(Box)(({ selected }) => ({
  backgroundColor: selected ? "#e0bb02" : "transparent",
  borderRadius: "5px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: selected ? "#f5f107" : "#F0F0F0",
  },
}));

const StyledTypography = styled(CustomeTypography)(({ selected }) => ({
  fontSize: "16px",
  color: selected ? "black" : "black",
  fontWeight: "bold",
}));

export default NavBar;