import React, { useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import styled from "styled-components";


const Profile = () => {


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          ></IconButton>
        </Tooltip>
      </Box>
    </React.Fragment>
  );
};

const StyledMenu = styled(Menu)`
  overflow: visible;
  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.32));
  margin-top: 1.5rem;
  & .MuiAvatar-root {
    width: 32px;
    height: 32px;
    margin-left: -0.5rem;
    margin-right: 1rem;
  }
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 14px;
    width: 10px;
    height: 10px;
    background-color: white;
    transform: translateY(-50%) rotate(45deg);
    z-index: 0;
  }
`;

export default Profile;
