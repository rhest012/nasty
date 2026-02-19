import Image from "next/image";
import BackgroundImage from "../public/background.jpg";
import NastyLogo from "../public/nasty-logo.svg";
import RsvpForm from "./components/RsvpForm";

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Fixed Background */}
      <Image
        src={BackgroundImage}
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        quality={100}
        priority
        className="fixed inset-0"
      />

      {/* Scrollable Content */}
      <div className="relative z-10 h-full w-full overflow-y-auto">
        <div className="flex flex-col min-h-full w-full justify-center items-center px-8 md:px-22 py-8">
          <Image
            src={NastyLogo}
            alt="Nasty Logo"
            height={100}
            className="mb-4"
          />
          <h3 className="text-white !font-semibold">RSVP Closed</h3>
          <p className="text-white text-center mb-8">
            Step into the world of Nasty ENRG — South Africa's bold new energy
            drink — as we celebrate its official launch with an exclusive
            padel-themed experience like no other. Expect a mix of sound, sports
            and a rush of pure energy — all set in Africa's richest mile -
            Sandton.
          </p>
        </div>
      </div>
    </div>
  );
}
