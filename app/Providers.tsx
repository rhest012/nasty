"use client";
import React, { ReactNode } from "react";
import { AuthProvider } from "../lib/AuthContext";
import { RsvpProvider } from "../lib/RsvpContext";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <RsvpProvider>{children}</RsvpProvider>
    </AuthProvider>
  );
}
