import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "Contact — Research Code Respond",
  description:
    "Have a project idea, want to partner, or interested in our training programs? Write to the Research Code Respond team in Kampala.",
};

export default function ContactPage() {
  return (
    <main className="bg-[#FAF9F5] pt-[72px]">
      <PageBanner
        eyebrow="Say hello"
        title="Talk to us"
        description="Have a project idea, want to partner, or interested in our training programs? We read everything."
        media={{ image: "/photos/card1.jpg" }}
        variant="violet"
      />
      <div className="mx-auto max-w-7xl px-6 pb-28 pt-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-[#1A1A1A]/10 bg-white p-7 sm:p-9">
            <ContactForm />
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-[#1A1A1A]/10 bg-white p-7">
              <Mail className="h-5 w-5 text-[#6B21E8]" />
              <p className="mt-3 text-sm font-semibold text-[#1A1A1A]">Email</p>
              <a
                href="mailto:info@researchcoderesolve.org"
                className="mt-1 block text-sm text-[#6B7280] transition-colors hover:text-[#6B21E8]"
              >
                info@researchcoderesolve.org
              </a>
            </div>
            <div className="rounded-2xl border border-[#1A1A1A]/10 bg-white p-7">
              <MapPin className="h-5 w-5 text-[#6B21E8]" />
              <p className="mt-3 text-sm font-semibold text-[#1A1A1A]">
                Location
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">Kampala, Uganda</p>
            </div>
            <div className="rounded-2xl border border-[#1A1A1A]/10 bg-white p-7">
              <Clock className="h-5 w-5 text-[#6B21E8]" />
              <p className="mt-3 text-sm font-semibold text-[#1A1A1A]">
                Office hours
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">
                Monday – Friday, 9:00 AM – 5:00 PM EAT
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
