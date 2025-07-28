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
import {useState, useEffect} from 'react';

export default function RootLayout({ children }: PropsWithChildren) {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const token = getRoleFromToken();
    if (token) {
      setLogin(true);
    }
  }, []);
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ToastContainer />
          {login&&
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
