"use client";

import ScrollUp from "./components/scroll-up";
import Features from "./features";
import ReasonOne from "./reason/reason-one";
import ReasonTwo from "./reason/reason-two";
import WelcomeSection from "./welcome-section";

export default function HomePage() {
  return (
    <>
      <ScrollUp />
      <WelcomeSection />
      <Features />
      <ReasonOne />
      <ReasonTwo />
    </>
  );
}
