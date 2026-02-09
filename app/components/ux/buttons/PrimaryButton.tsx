import React from "react";

interface PrimaryButtonProps {
  buttonText?: string;
  buttonLoadingText?: string;
  onClick: () => void;
  isSubmissionPending?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  buttonText,
  buttonLoadingText,
  onClick,
  isSubmissionPending,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <button
      disabled={isSubmissionPending}
      className={`
        flex 
        items-center 
        justify-center 
        transition-all 
        duration-200
        rounded-[1.25rem] 
        px-4 
        py-2 
        !w-full
        font-bold
        ${isSubmissionPending ? "primary-button__disabled" : "primary-button"}
      `}
      onClick={handleClick}
    >
      {isSubmissionPending ? (
        <div className="flex items-center justify-center !text-black">
          {buttonLoadingText}
          <svg
            className="animate-spin h-5 w-5 text-black ml-4 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <span>{buttonText}</span>
      )}
    </button>
  );
};

export default PrimaryButton;
