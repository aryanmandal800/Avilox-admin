import { Box } from "@mui/material";
import Login from "./Login";
import { styled } from '@mui/system';


const LoginPage = () => {
  return (
    <>
      <BackgroundContainer>
        <Login />
      </BackgroundContainer>
    </>
  );
};

const BackgroundContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100vh',
  backgroundColor:"#e6d27c"
});

export default LoginPage;
