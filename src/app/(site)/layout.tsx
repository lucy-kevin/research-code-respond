import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/content";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();

  return (
    <>
      <Navbar />
      {children}
      <Footer content={content.footer} />
    </>
  );
}
