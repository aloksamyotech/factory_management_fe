'use client'
import "@/css/satoshi.css";
import "@/css/style.css";
import { Sidebar } from "@/components/Layouts/sidebar";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import { getRoleFromToken } from "@/common/api";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from "@mui/material";
import './loader.css'

export default function RootLayout({ children }: PropsWithChildren) {
  const [login, setLogin] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    const token = getRoleFromToken();
    if (token) {
      setLogin(true);
    }
    else {
      router.push('/sign-in');
      setLogin(false)
    }
  }, []);

  if (login === null) {
    return <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
        }}
      >
        <span className="loader"></span>
      </Box>
    </Box>;
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ToastContainer />
          {login &&
            <>
              <NextTopLoader showSpinner={false} />
              <div className="flex min-h-screen">
                <Sidebar />

                <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                  <Header />

                  <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                    {children}
                  </main>
                </div>
              </div>
            </>
          }
          {
            !login &&
            children
          }
        </Providers>
      </body>
    </html>
  );
}
