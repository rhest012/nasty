type FormInputProps<T> = {
  placeholder: string;
  handleInputChange: (prop: keyof T, value: string) => void;
  value: string;
  prop: keyof T;
  type: string;
  formProps: T;
};

type FormSelectProps<T> = {
  handleInputChange: (prop: keyof T, value: string) => void;
  options: selectOption[];
  value: string;
  prop: keyof T;
  selectedOption: string;
};

type RsvpFormProps = {
  firstName: string;
  lastName: string;
  rsvp: string;
  email: string;
  contactNumber: string;
  dietaryRequirements: string;
  vape: string;
  fasting: string;
  iftaar: string;
};

type FetchedDataProps = {
  id: string;
  [key: string]: any;
  yes?: number;
  no?: number;
  totalSubmissions?: number;
};
