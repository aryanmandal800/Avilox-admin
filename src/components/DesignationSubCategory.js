import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  MenuItem,
  Select,
  CircularProgress,
  Modal,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";

import SpeakllerImg from "../assets/image/SpeakllerLogo.svg";
import CustomeTypography from "../components/CustomeTypography";
import CustomeButton from "./CustomeButton";
import { apiSubscribeModule, getAllModules } from "../services/apiModules";
import {
  apiGetSubscriptionsByModuleId,
  apiIsUSerSubscribedModule,
} from "../services/apiSubscriptionPlans";
import Image from "./Image ";
import PaymentConfirmModel from "./paymentConfirmModel";

const DesignationSubcategory = () => {
  const [designation, setDesignation] = useState("");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const response = await getAllModules();
        setModules(response.modules);
      } catch (err) {
        setError("Failed to fetch modules.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleChange = (event) => {
    setDesignation(event.target.value);
  };

  const handleNavigate = async () => {
    try {
      const response = await apiGetSubscriptionsByModuleId(selectedOption);
      console.log("Subscription API Response:", response);

      if (response && response.success) {
        setSubscriptions(response.subscriptions || []);
        setShowSubscriptionModal(true);
      }
    } catch (error) {
      console.log("Error fetching subscriptions for module:", error);
    }
  };

  const handleSubscribe = async (subscription) => {
    try {
      const resData = await apiIsUSerSubscribedModule(subscription.id);
      console.log(resData);
      if (resData && resData.subscribed) {
        navigate("/Dashboard");
      } else {
        console.log(subscription)
        if(subscription.planType === "free_trial" || subscription.price===0){
          const resData = await apiSubscribeModule(subscription.moduleId, subscription.id);
          console.log(resData);
          navigate("/Dashboard");
        }else{
          setSelectedPlan(subscription);
          setShowPaymentModal(true);
          setShowSubscriptionModal(false);
        }
      }
    } catch (err) {
      console.log("Error reading data : ", err);
    }
  };

  const handleOnClosePaymentModal = () => {
    setShowPaymentModal(false);
    setShowSubscriptionModal(true);
  };

  return (
    <BackgroundContainer>
      {showPaymentModal && (
        <PaymentConfirmModel
          selectedPlan={selectedPlan}
          showModal={showPaymentModal}
          onClose={handleOnClosePaymentModal}
        />
      )}
      <Box>
        <Stack alignItems={"center"}>
          <Image
            src={SpeakllerImg}
            alt="Speakller_Img"
            width="20%"
            height="20%"
            style={{ marginTop: "5%" }}
          />
          <StyledPaper sx={{ marginTop: "2%" }}>
            <StyledMainContainer>
              <StyledLogin text={"Designation"} fontWeight={700} />
              <StyledHeadCaption text={"Select your Designation"} />

              {loading ? (
                <CircularProgress />
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : (
                <Select
                  value={designation}
                  onChange={handleChange}
                  displayEmpty
                  sx={{ width: "100%" }}
                >
                  <MenuItem value="" disabled>
                    Select Module
                  </MenuItem>
                  {modules.map((module) => (
                    <MenuItem
                      key={module.id}
                      value={module.id}
                      disabled={!module.isActive}
                      onClick={() => setSelectedOption(module.id)}
                    >
                      {module.title}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </StyledMainContainer>
            <CustomeButton
              text={"Next"}
              variant={"contained"}
              onClick={handleNavigate}
            />
          </StyledPaper>
        </Stack>
      </Box>

      {/* Modal to display subscription plans if not subscribed */}
      <Modal
        open={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        aria-labelledby="subscription-modal-title"
        aria-describedby="subscription-modal-description"
      >
        <ModalBox>
          <Typography id="subscription-modal-title" variant="h6" component="h2">
            Choose a Subscription Plan
          </Typography>
          {subscriptions.length > 0 ? (
            subscriptions.map((plan) => (
              <PlanBox key={plan.id}>
                <Typography variant="subtitle1">{plan.name}</Typography>
                <Typography variant="body2">{plan.description}</Typography>
                <Typography variant="body2">Price: ₹{plan.price}/-</Typography>
                <Button
                  variant="contained"
                  onClick={() => handleSubscribe(plan)}
                  sx={{ mt: 1 }}
                >
                  Subscribe
                </Button>
              </PlanBox>
            ))
          ) : (
            <Typography>No subscription plans available.</Typography>
          )}
        </ModalBox>
      </Modal>
    </BackgroundContainer>
  );
};

const BackgroundContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100vh",
  backgroundColor: "#143B80",
});

const StyledPaper = styled(Paper)({
  width: "40%",
  padding: "1% 5% 3% 5%",
  borderRadius: "19px",
});

const StyledMainContainer = styled(Box)({
  marginTop: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "19px",
});

const StyledLogin = styled(CustomeTypography)({
  fontFamily: "Poppins",
  fontSize: "40px",
  fontWeight: 800,
  textAlign: "center",
});

const StyledHeadCaption = styled(CustomeTypography)({
  fontFamily: "Poppins",
  fontSize: "20px",
  fontWeight: 500,
  textAlign: "center",
});

const ModalBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  padding: "16px 32px 24px",
});

const PlanBox = styled(Box)({
  marginBottom: "16px",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "8px",
});

export default DesignationSubcategory;
