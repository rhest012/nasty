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
  deliveryAddress: string;
};

type SignUpFormProps = {
  email: string;
  password: string;
};

type FetchedDataProps = {
  id: string;
  [key: string]: any;
  yes?: number;
  no?: number;
  totalSubmissions?: number;
};

type AuthContextProp = {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

type RsvpContextProp = {
  rsvpOverview: RsvpOverviewProp;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction>;
  activePage: number;
  setActivePage: React.Dispatch<React.SetStateAction>;
  activeGuestList: SingleGuestDataProp[] | null;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction>;
  isLoading: boolean;
};
