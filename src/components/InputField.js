import { FormControl, OutlinedInput } from "@mui/material";

const InputField = ({ label, placeholder, type, ...rest }) => {
  return (
    <FormControl variant="outlined">
      <OutlinedInput label={label} placeholder={placeholder} type={type} {...rest} />
    </FormControl>
  );
};

export default InputField;
   