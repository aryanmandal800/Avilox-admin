import { Button } from "@mui/material";

const CustomeButton = ({ text, variant, onClick, children, ...rest }) => {
  return (
    <Button variant={variant} onClick={onClick} {...rest}>
      {text}
      {children}
    </Button>
  );
};

export default CustomeButton;
