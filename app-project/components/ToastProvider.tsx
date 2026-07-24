"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1a2226",
          color: "#f4f6f7",
          fontSize: "0.875rem",
        },
        success: {
          iconTheme: { primary: "#cf8f42", secondary: "#1a2226" },
        },
        error: {
          iconTheme: { primary: "#dc2626", secondary: "#f4f6f7" },
        },
      }}
    />
  );
}
