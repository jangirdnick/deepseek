"use client";

import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { PropsWithChildren } from "react";

export default function ClientProviders({ children }: PropsWithChildren) {
  return (
    <AppContextProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: { 
            style: { 
              background: "#000", 
              color: "#fff",
              border: "1px solid #333"
            } 
          },
          error: { 
            style: { 
              background: "#000", 
              color: "#fff",
              border: "1px solid #ef4444"
            } 
          },
        }}
      />
      {children}
    </AppContextProvider>
  );
}
