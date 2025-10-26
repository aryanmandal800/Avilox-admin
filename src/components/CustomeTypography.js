import { Typography } from "@mui/material";

const CustomeTypography = ({ text, ...rest }) => {
  return <Typography {...rest}>{text}</Typography>;
};

export default CustomeTypography;
