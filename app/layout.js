import "./globals.css";
import StarField from "@/components/StarField";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackWidget from "@/components/FeedbackWidget";

export const metadata = {
  title: "DevSoc - Build. Ship. Belong.",
  description:
    "DevSoc is a student developer club: workshops, hackathons, mentorship, verifiable certificates, and a showcase for what members build.",
  icons: { icon: "/logo.jpg" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-void-900 text-white antialiased">
        <StarField />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <FeedbackWidget />
      </body>
    </html>
  );
}
