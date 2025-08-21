"use client";
import "./loader.css"
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <SidebarProvider>
        {children}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-[9999]">
            <span className="loader"></span>
          </div>
        )}
      </SidebarProvider>
    </ThemeProvider>
  );
}
