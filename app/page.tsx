import Image from "next/image";
import BackgroundImage from "../public/background.jpg";
import NastyLogo from "../public/nasty-logo.svg";
import RsvpForm from "./components/RsvpForm";

export default function Home() {
  return (
    <div
      className="relative w-screen h-screen overflow-scroll
  "
    >
      <Image
        src={BackgroundImage}
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        quality={100}
        priority
      />
      <div className="relative p-8 !z-10 w-full h-full flex flex-col w-full justify-center items-center mx-0 lg:px-50">
        <Image src={NastyLogo} alt="Nasty Logo" height={100} className="mb-4" />
        <p>
          We cordially invite you to join us for the official launch of Nasty
          ENRG in South Africa.
        </p>
        <RsvpForm />
      </div>
    </div>
  );
}
