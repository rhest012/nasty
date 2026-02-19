"use client";

import { useState } from "react";
import FormInput from "./ux/FormInput";
import PrimaryButton from "./ux/buttons/PrimaryButton";
import SuccessModal from "./modals/SuccessModal";

const defaultInputData: SignUpFormProps = {
  email: "",
  password: "",
};

const SignUp = () => {
  const [inputData, setInputData] = useState<SignUpFormProps>(defaultInputData);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [isSubmissionPending, setIsSubmissionPending] =
    useState<boolean>(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] =
    useState<boolean>(false);

  const handleInputChange = (prop: keyof SignUpFormProps, value: string) => {
    setInputData({ ...inputData, [prop]: value });
  };

  const handleSubmit = async () => {
    setIsSubmissionPending(true);
    setErrorMessage(null);
    try {
      setIsSubmissionSuccessful(true);
    } catch (error) {
      console.error("Submission failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmissionPending(false);
    }
  };

  return (
    <div>
      <div className="form-inputfield-container">
        <div className="single-input-container">
          <FormInput
            placeholder="Email Address"
            handleInputChange={handleInputChange}
            value={inputData.email}
            prop="email"
            type="input"
            formProps={defaultInputData}
          />
        </div>
      </div>
      <div className="form-inputfield-container">
        <div className="single-input-container">
          <FormInput
            placeholder="Password"
            handleInputChange={handleInputChange}
            value={inputData.password}
            prop="password"
            type="password"
            formProps={defaultInputData}
          />
        </div>
      </div>
      <div>
        <div className="h-[30px]">
          <p className="error-text text-center !text-white">
            {errorMessage ? errorMessage : ""}
          </p>
        </div>
        <PrimaryButton
          buttonText="RSVP"
          buttonLoadingText="Submitting"
          onClick={handleSubmit}
          isSubmissionPending={isSubmissionPending}
        />
      </div>
      <SuccessModal
        isActive={isSubmissionSuccessful}
        notificationHeading="Sign up Successful"
        notificationText="Account set up successfully"
      />
    </div>
  );
};

export default SignUp;
