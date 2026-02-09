import React from "react";

const FormInput = <T,>({
  placeholder,
  handleInputChange,
  value,
  prop,
  type,
}: FormInputProps<T>) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(prop, event.target.value);
  };

  return (
    <input
      className="form-inputfield focus:outline-none focus:ring-0 "
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default FormInput;
