import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./sidebar";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "NovaMart Marketing Analytics",
  description: "Campaign ROI, Customer Segmentation, Lead Conversion & Customer Growth Analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full bg-slate-950 text-slate-100">
        <Providers>
          <Sidebar />
          <main className="ml-0 min-h-screen transition-all duration-300 lg:ml-60">
            <div className="px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-8">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
