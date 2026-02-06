interface NotificationModalProps {
  isActive: boolean;
  notificationText: string;
  notificationHeading: string;
}

const SuccessModal: React.FC<NotificationModalProps> = ({
  isActive,
  notificationText,
  notificationHeading,
}) => {
  return (
    <>
      {isActive && (
        <div className="fixed inset-0 bg-black/60 transition-opacity !z-[60]" />
      )}
      {isActive && (
        <div className="fixed inset-0 flex items-center justify-center !z-[60]">
          <div className="relative transform overflow-hidden rounded-xl bg-[url('/background.jpg')] bg-cover bg-repeat text-left shadow-xl transition-all sm:w-full sm:max-w-lg ">
            <div className="p-4 sm:p-10 text-center overflow-y-auto">
              <h3 className="text-[#cefa05] !text-[2.25rem] font-bold">
                {notificationHeading}
              </h3>
              <p className="text-white">{notificationText}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessModal;
