import { Box } from "@mui/material";
import { styled } from '@mui/system';
import UserProfile from "../components/userProfile";


const ProfilePage = () => {
  return (
    <>
      <BackgroundContainer>
        <UserProfile />
      </BackgroundContainer>
    </>
  );
};

const BackgroundContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100vh',
  backgroundColor:"#143B80"
});

export default ProfilePage;
