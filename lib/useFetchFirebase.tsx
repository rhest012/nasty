import { useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
  DocumentReference,
  startAfter,
  limit,
  getCountFromServer,
  DocumentSnapshot,
  orderBy,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Define the type for fetched data
// Custom hook to fetch data from a nested Firestore subcollection
export const useFetchFirebaseNestedCollection = (
  collection: string,
  nestedCollection: string,
) => {
  const [data, setData] = useState<FetchedDataProps | null>(null);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  useEffect(() => {
    setIsFetchingData(true);
    const docRef = doc(db, collection, nestedCollection);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setData({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
          setData(null);
        }
        setIsFetchingData(false);
      },
      (error) => {
        console.error("Error fetching document:", error);
        setIsFetchingData(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [collection, nestedCollection]);

  return { data, isFetchingData };
};

export const useFetchFirebaseNestedSubCollection = (
  collectionName: string,
  nestedCollection: string,
  subcollectionName: string,
  activePage: number = 1,
  orderByParameter?: string,
) => {
  const [data, setData] = useState<FetchedDataProps[] | null>(null);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Store cursors for each page to enable efficient navigation
  const pageStartsRef = useRef<Map<number, DocumentSnapshot>>(new Map());

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      setIsFetchingData(true);

      try {
        const docRef = doc(db, collectionName, nestedCollection);
        const subcolRef = collection(docRef, subcollectionName);

        // Get total count (optional - only if you need it for pagination UI)
        const countSnapshot = await getCountFromServer(subcolRef);
        setTotalCount(countSnapshot.data().count);

        let baseQuery;

        if (activePage === 1) {
          // First page - clear stored cursors and start fresh
          pageStartsRef.current.clear();
          baseQuery = orderByParameter
            ? query(subcolRef, orderBy(orderByParameter, "asc"), limit(100))
            : query(subcolRef, limit(100));
        } else {
          // Check if we have a cursor for this page
          const pageCursor = pageStartsRef.current.get(activePage);

          if (pageCursor) {
            // We have the cursor, use it directly
            baseQuery = orderByParameter
              ? query(
                  subcolRef,
                  orderBy(orderByParameter, "asc"),
                  startAfter(pageCursor),
                  limit(100),
                )
              : query(subcolRef, startAfter(pageCursor), limit(100));
          } else {
            // No cursor - need to fetch from the beginning up to this page
            const skipCount = (activePage - 1) * 100;
            const skipQuery = orderByParameter
              ? query(
                  subcolRef,
                  orderBy(orderByParameter, "asc"),
                  limit(skipCount),
                )
              : query(subcolRef, limit(skipCount));

            const skipSnapshot = await getDocs(skipQuery);

            const lastVisible = skipSnapshot.docs[skipSnapshot.docs.length - 1];

            if (lastVisible) {
              // Store cursor for future use
              pageStartsRef.current.set(activePage, lastVisible);

              baseQuery = orderByParameter
                ? query(
                    subcolRef,
                    orderBy(orderByParameter, "asc"),
                    startAfter(lastVisible),
                    limit(100),
                  )
                : query(subcolRef, startAfter(lastVisible), limit(100));
            } else {
              // No documents found
              setData([]);
              setIsFetchingData(false);
              return;
            }
          }
        }

        // Set up real-time listener for current page
        unsubscribe = onSnapshot(
          baseQuery,
          (snapshot) => {
            const fetchedData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as FetchedDataProps[];

            setData(fetchedData);
            setIsFetchingData(false);

            // Store cursor for next page
            if (snapshot.docs.length > 0) {
              const lastDocument = snapshot.docs[snapshot.docs.length - 1];
              pageStartsRef.current.set(activePage + 1, lastDocument);
            }
          },
          (error) => {
            console.error("Error fetching subcollection:", error);
            setIsFetchingData(false);
          },
        );
      } catch (error) {
        console.error("Error setting up query:", error);
        setIsFetchingData(false);
      }
    };

    setupListener();

    // Cleanup: unsubscribe from real-time listener
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [
    collectionName,
    nestedCollection,
    subcollectionName,
    activePage,
    orderByParameter,
  ]);

  const totalPages = Math.ceil(totalCount / 100);

  return { data, isFetchingData, totalPages };
};

export const getUserDocRef = async (
  searchTerm: string,
  collectionName: string,
  searchAll: boolean,
): Promise<DocumentReference | DocumentReference[] | null> => {
  try {
    const usersRef = collection(db, "energLaunch", "rsvp", collectionName);
    const q = query(usersRef, where("email", "==", searchTerm));
    const querySnapshot = await getDocs(q);

    if (searchAll) {
      return querySnapshot.docs.map((doc) => doc.ref);
    } else {
      const userDoc = querySnapshot.docs[0];
      return userDoc.ref;
    }
  } catch (error) {
    // console.error("Error finding user document: ", error);
    return null;
  }
};
