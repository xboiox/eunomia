import { type Metadata } from "next";
import "../styles/index.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Eunomia — IT Compliance Dashboard",
  description: "Self-hosted IT security compliance dashboard for NIST CSF, ISO 27001, and PCI DSS assessments.",
  icons: {
    icon: "/images/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="!scroll-smooth" lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
