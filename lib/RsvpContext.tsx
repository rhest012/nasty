"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useFetchFirebaseNestedCollection,
  useFetchFirebaseNestedSubCollection,
} from "./useFetchFirebase";

const RsvpContext = createContext<RsvpContextProp>({
  rsvpOverview: {
    id: "",
    totalSubmissions: 0,
    yes: 0,
    no: 0,
  },
  activeSection: "",
  setActiveSection: () => {},
  activePage: 1,
  setActivePage: () => {},
  activeGuestList: null,
  totalPages: 1,
  setTotalPages: () => {},
  isLoading: false,
});

export const RsvpProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const rsvpOverviewData = useFetchFirebaseNestedCollection(
    "energLaunch",
    "rsvp",
  );
  const rsvpOverview: any = rsvpOverviewData?.data || {
    id: "",
    yes: 0,
    no: 0,
    totalSubmissions: 0,
  };

  const [activeSection, setActiveSection] = useState<string>("yes");
  const [activePage, setActivePage] = useState<number>(30);

  const activeGuestsData = useFetchFirebaseNestedSubCollection(
    "energLaunch",
    "rsvp",
    "yes",
    3,
    "firstName",
  );

  const activeGuestList: any[] | null = activeGuestsData?.data;
  const [totalPages, setTotalPages] = useState<number>(1);

  // Update totalPages when activeGuestsData changes
  useEffect(() => {
    setTotalPages(activeGuestsData?.totalPages ?? 1);
  }, [activeGuestsData?.totalPages]);

  // Update Active Page when section changes
  // useEffect(() => {
  //   setActivePage(1);
  // }, [activeSection]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeGuestsData?.isFetchingData || rsvpOverviewData?.isFetchingData) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [activeGuestsData?.isFetchingData, rsvpOverviewData?.isFetchingData]);

  return (
    <RsvpContext.Provider
      value={{
        rsvpOverview,
        activeSection,
        setActiveSection,
        activePage,
        setActivePage,
        activeGuestList,
        totalPages,
        setTotalPages,
        isLoading,
      }}
    >
      {children}
    </RsvpContext.Provider>
  );
};

export const useRsvpContext = () => useContext(RsvpContext);
