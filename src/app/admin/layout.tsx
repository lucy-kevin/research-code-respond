import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Research Code Respond",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[#FAF9F5]">{children}</div>;
}
