import type { Metadata } from "next";
import LendenLandingClient from "./client";

const SITE_URL = "https://lenden.apearix.com";
const WELCOME_URL = "https://lenden.apearix.com/welcome";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Lenden — Every Rupee. Clearly Tracked. | Personal Money Ledger by Apearix",
  description:
    "Keep crystal-clear records of money lent, borrowed, and shared with friends, family, and daily contacts. Download Lenden for Android, iOS, or launch the Web App.",
  keywords: [
    "Lenden",
    "personal money ledger",
    "udhar khata",
    "debt tracker app",
    "expense and lending tracker",
    "Apearix",
    "money lent and borrowed",
    "Hindi English ledger app",
  ],
  authors: [{ name: "Apearix", url: "https://apearix.com" }],
  creator: "Apearix",
  publisher: "Apearix",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Lenden by Apearix",
    title: "Lenden — Every Rupee. Clearly Tracked.",
    description:
      "Track money lent, borrowed, and shared across friends, family, and daily contacts with English & Hindi support, due dates, and instant sync.",
    images: [
      {
        url: "/images/welcome.png",
        width: 1200,
        height: 630,
        alt: "Lenden Personal Money Ledger App Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lenden - Every Rupee. Clearly Tracked.",
    description:
      "Personal money ledger and debt tracker for Android, iOS, and Web by Apearix.",
    images: ["/images/welcome.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Lenden",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Android, iOS, Web",
  url: WELCOME_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  author: {
    "@type": "Organization",
    name: "Apearix",
    url: "https://apearix.com",
    email: "hello@apearix.com",
  },
  description:
    "Personal money ledger and debt tracker to record money lent, borrowed, and shared with due dates and English/Hindi language support.",
};

export default function LendenWelcomePage() {
  return (
    <div className="font-jakarta">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />
      <LendenLandingClient welcomeUrl={WELCOME_URL} />
    </div>
  );
}