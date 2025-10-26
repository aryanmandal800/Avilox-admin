import { Box, Stack } from "@mui/material";
import { styled } from "@mui/system";
import Profile from "./Profile.js";
import CustomeButton from "./CustomeButton.js";
import Image from "./Image .js";
import { useState, useEffect } from "react";

import logoImage from "../assets/Avilox/logo.png";
import profileimage from "../assets/image/Profile.png";
import notificationIcon from "../assets/image/Notification.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "./store/index.js";


const HeaderWrapper = styled(Stack)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0px 30px;
  justify-content: space-between;
  background-color: #1a1a1a;
`;

const UserIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StyledImage = styled("img")`
  height: 33px;
  width: 33px;
  cursor: pointer;
  padding-right: 10px;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled("img")`
  height: 50px;
  width: 150px;
  cursor: pointer;
`;

const ProfileImage = styled("img")`
  height: 35px;
  width: 35px;
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const NavHeader = () => {
  const { userInfo } = useUser();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    console.log("Profile image clicked");
    navigate('/Profile');
  };

  return (
    <HeaderWrapper direction="row">
      <LogoImage src={logoImage} alt="Logo" onClick={()=>{navigate("/home")}} />
      {/* <h1>Avilox Admin</h1> */}
      <UserIconWrapper>
        {/* <StyledImage src={notificationIcon} alt="notification" /> */}
        <Profile />
        <ProfileImage src={userInfo && userInfo.photo ? userInfo.photo : "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"} alt="Profile" onClick={handleProfileClick} />
      </UserIconWrapper>
    </HeaderWrapper>
  );
};

export default NavHeader;
