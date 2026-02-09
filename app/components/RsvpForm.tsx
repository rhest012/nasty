"use client";
import React, { useEffect, useState } from "react";
import FormInput from "./ux/FormInput";
import FormSelect from "./ux/FormSelect";
import PrimaryButton from "./ux/buttons/PrimaryButton";
import SuccessModal from "./modals/SuccessModal";
import { db, getUserDocRef } from "@/lib/useFetchFirebase";
import {
  collection,
  doc,
  increment,
  runTransaction,
} from "@firebase/firestore";
import formatString from "@/utils/formatString";
import generateUserId from "@/utils/generateUserId";

const defaultInputData: RsvpFormProps = {
  firstName: "",
  lastName: "",
  rsvp: "",
  email: "",
  contactNumber: "",
  dietaryRequirements: "",
  vape: "",
  fasting: "",
  iftaar: "",
  deliveryAddress: "",
};

function RsvpForm() {
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [inputData, setInputData] = useState<RsvpFormProps>(defaultInputData);
  const [isSubmissionPending, setIsSubmissionPending] =
    useState<boolean>(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] =
    useState<boolean>(false);

  const handleInputChange = (
    prop: keyof RsvpFormProps,
    value: string | boolean,
  ) => {
    setInputData({ ...inputData, [prop]: value });
  };

  const handleSubmit = async () => {
    setIsSubmissionPending(true);
    setErrorMessage(null);
    try {
      if (!inputData.firstName) {
        throw new Error("Name is required");
      } else if (!inputData.lastName) {
        throw new Error("Surname is required");
      } else if (!inputData.rsvp) {
        throw new Error("Attendance is required");
      } else if (!inputData.email) {
        throw new Error("Email is required");
      }
      if (inputData.rsvp === "Yes") {
        if (!inputData.email) {
          throw new Error("Email Address is required");
        } else if (!inputData.contactNumber) {
          throw new Error("Contact Number is required");
        } else if (!inputData.dietaryRequirements) {
          throw new Error("Dietary Requirements are required");
        } else if (!inputData.vape) {
          throw new Error("Vape field is required");
        } else if (!inputData.fasting) {
          throw new Error("Fasting field is required");
        }
      }

      const formattedInputData = {
        ...inputData,
        firstName: formatString(inputData.firstName),
        lastName: formatString(inputData.lastName),
        email: inputData.email.toLocaleLowerCase(),
        id: generateUserId(inputData.lastName),
        date: new Date().toISOString(),
      };

      // Post to firebase
      const summaryRef = doc(db, "energLaunch", "rsvp");

      const collectionName = inputData.rsvp === "Yes" ? "yes" : "no";

      console.log("Formatted Input data", formattedInputData);

      // Check Duplicates
      const userDocRef: any = await getUserDocRef(
        formattedInputData.email,
        collectionName,
        false,
      );

      // Handle Submission
      if (userDocRef) {
        throw new Error(
          "Could not RSVP. You have already submitted your RSVP.",
        );
      } else {
        const submissionRef = doc(
          collection(db, "energLaunch", "rsvp", collectionName),
          formattedInputData.id,
        );

        await runTransaction(db, async (transaction) => {
          const summaryDoc = await transaction.get(summaryRef);

          if (!summaryDoc.exists()) {
            transaction.set(summaryRef, {
              totalSubmissions: 1,
              yes: inputData.rsvp === "Yes" ? 1 : 0,
              no: inputData.rsvp === "No" || inputData.rsvp === "" ? 1 : 0,
            });
          } else {
            transaction.update(summaryRef, {
              totalSubmissions: increment(1),
              yes: inputData.rsvp === "Yes" ? increment(1) : increment(0),
              no:
                inputData.rsvp === "No" || inputData.rsvp === ""
                  ? increment(1)
                  : increment(0),
            });
          }

          transaction.set(submissionRef, formattedInputData);
        });
      }

      setIsSubmissionSuccessful(true);
    } catch (error) {
      console.error("Submission failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      throw error;
    } finally {
      setIsSubmissionPending(false);
    }
  };

  // Handle Success
  useEffect(() => {
    if (isSubmissionSuccessful) {
      setErrorMessage(null);
      setInputData(defaultInputData);

      const timer = setTimeout(() => {
        setIsSubmissionSuccessful(false);
      }, 5000);

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [isSubmissionSuccessful]);

  return (
    <div className="flex flex-col w-full content-center gap-4 justify-center flex-wrap w-full sm:pb-8 md:pb-0">
      <div className="form-inputfield-container">
        <div className="single-input-container">
          <FormInput
            placeholder="First Name"
            handleInputChange={handleInputChange}
            value={inputData.firstName}
            prop="firstName"
            type="input"
            formProps={defaultInputData}
          />
        </div>
        <div className="single-input-container">
          <FormInput
            placeholder="Surname"
            handleInputChange={handleInputChange}
            value={inputData.lastName}
            prop="lastName"
            type="input"
            formProps={defaultInputData}
          />
        </div>
      </div>
      <div className="form-inputfield-container">
        <div className="single-input-container">
          <FormSelect
            selectedOption="Will you be attending?"
            prop="rsvp"
            handleInputChange={handleInputChange}
            value={inputData.rsvp}
            options={["Yes", "No"]}
          />
        </div>
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
      {inputData.rsvp == "Yes" ? (
        <>
          <div className="form-inputfield-container">
            <div className="single-input-container">
              <FormInput
                placeholder="Contact Number"
                handleInputChange={handleInputChange}
                value={inputData.contactNumber}
                prop="contactNumber"
                type="input"
                formProps={defaultInputData}
              />
            </div>
            <div className="single-input-container">
              <FormSelect
                selectedOption="Dietary Requirements?"
                prop="dietaryRequirements"
                handleInputChange={handleInputChange}
                value={inputData.dietaryRequirements}
                options={["Halaal", "Vegetarian", "Vegan", "None"]}
              />
            </div>
          </div>
          <div className="form-inputfield-container">
            <div className="single-input-container">
              <FormSelect
                selectedOption="Do you vape?"
                prop="vape"
                handleInputChange={handleInputChange}
                value={inputData.vape}
                options={["Yes", "No"]}
              />
            </div>

            <div className="single-input-container">
              <FormInput
                placeholder="Delivery Address"
                handleInputChange={handleInputChange}
                value={inputData.deliveryAddress}
                prop="deliveryAddress"
                type="input"
                formProps={defaultInputData}
              />
            </div>
          </div>

          <div className="form-inputfield-container">
            <div className="single-input-container">
              <FormSelect
                selectedOption="Are you fasting for Ramadan?"
                prop="fasting"
                handleInputChange={handleInputChange}
                value={inputData.fasting}
                options={["Yes", "No"]}
              />
            </div>
            {inputData.fasting == "Yes" ? (
              <div className="single-input-container">
                <FormSelect
                  selectedOption="Do you require an iftaar pack to break your fast?"
                  prop="iftaar"
                  handleInputChange={handleInputChange}
                  value={inputData.iftaar}
                  options={["Yes", "No"]}
                />
              </div>
            ) : null}
          </div>
        </>
      ) : null}
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
        notificationHeading="RSVP Successful"
        notificationText="Thank you for RSVPing! Get ready to step into the world of Nasty ENRG"
      />
    </div>
  );
}

export default RsvpForm;
