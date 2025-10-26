import { Box, Divider } from "@mui/material";
import CustomeTypography from "./CustomeTypography";
import styled from "@emotion/styled";

import "./style.css"


const PageBody = ({ heading, children, showBack }) => {
//   const navigate = useNavigate();

  return (
    <>
      <Box className="body-container">
        <StyledMainBox className="body main">

       {children}
       
        </StyledMainBox>
      </Box>
    </>
  );
};

const StyledMainBox = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "0% 0% 2% 0%",
  marginTop: "20px",
  marginRight: "10px",
  borderTopLeftRadius: "22px",
  borderTopRightRadius: "22px",
  boxShadow: "-2px 12px 19px lightgray",
});

const StyledBox = styled(Box)({
  height: "100vh",
  overflowY: "scroll",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "@media (max-width: 950px)": {
    minHeight: "62vh",
  },
  "@media (max-width: 900px)": {
    minHeight: "64vh",
  },
  "@media (max-width: 500px)": {
    minHeight: "65vh",
  },
});

const StyledHeaderBox = styled(Box)({
  height: "auto",
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2%",
});

const StyledHeading = styled(CustomeTypography)({
  fontFamily: "Inter",
  fontSize: "1rem",
  fontWeight: 700,
  lineHeight: "1.2",
});

export default PageBody;
