const FormSelect = <T extends Record<string, any>>({
  selectedOption,
  options,
  prop,
  handleInputChange,
  value,
}: FormSelectProps<T>) => {
  return (
    <>
      <select
        className="form-inputfield focus:outline-none focus:ring-0 appearance-none rounded-none text-white"
        onChange={(e) => handleInputChange(prop, e.target.value)}
        value={value || ""}
      >
        <option value="">{selectedOption}</option>
        {options?.map((option, index) =>
          !option?.name ? (
            <option key={index} value={option}>
              {option}
            </option>
          ) : (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ),
        )}
      </select>
    </>
  );
};

export default FormSelect;
