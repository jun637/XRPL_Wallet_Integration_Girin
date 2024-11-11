"use client";
import React, { ReactNode } from "react";
import { ClientContextProvider } from "@/context/ClientContext";

export default function Provider({ children }: { children: ReactNode }) {
  return <ClientContextProvider>{children}</ClientContextProvider>;
}
