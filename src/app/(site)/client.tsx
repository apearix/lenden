"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Ban,
  CalendarClock,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Globe2,
  Languages,
  Lock,
  Mail,
  Menu,
  Play,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserPlus,
  Users,
  Wallet,
  X,
  XCircle,
  Zap,
  ArrowLeftRight,
} from "lucide-react";
import Image from "next/image";

interface LedgerContact {
  id: number;
  name: string;
  note: string;
  amount: number;
  type: "receive" | "pay";
  due: string;
}

type DownloadPlatform = "all" | "android" | "ios" | "qr";

interface LendenLandingClientProps {
  welcomeUrl?: string;
}

const INITIAL_CONTACTS: LedgerContact[] = [
  {
    id: 1,
    name: "Rohan Sharma",
    note: "Dinner & movie split",
    amount: 3250,
    type: "receive",
    due: "Due Nov 30",
  },
  {
    id: 2,
    name: "Priya Verma",
    note: "Concert tickets",
    amount: 2500,
    type: "receive",
    due: "Due Dec 04",
  },
  {
    id: 3,
    name: "Amit Patel",
    note: "Cab & coffee share",
    amount: 1500,
    type: "pay",
    due: "Due Nov 28",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is Lenden free to use?",
    answer:
      "Yes! Lenden is completely free to download and use for tracking personal transactions, managing contact ledgers, and setting due dates—with zero intrusive advertisements.",
  },
  {
    question: "Can I use Lenden on both my phone and web browser?",
    answer:
      "Absolutely. You can install the Lenden mobile app on Android or iOS, or sign in directly from any desktop or mobile browser via lenden.apearix.com. Your entries stay synced across all your devices.",
  },
  {
    question: "How is my financial data protected?",
    answer:
      "Your account is secured with verified Email OTP authentication and encrypted password protection. Only you can view or edit your personal ledger entries, and we never sell your financial data.",
  },
  {
    question: "Does Lenden support both English and Hindi?",
    answer:
      "Yes! Lenden is built with full bilingual support for both English and हिन्दी. You can toggle your preferred language at any time with a single tap inside the app.",
  },
  {
    question: "How do due-date reminders work?",
    answer:
      "Whenever you record an “I Gave” or “I Took” transaction, you can optionally pick a due date. Lenden highlights upcoming and overdue settlements right inside your contact ledger so you always stay on schedule.",
  },
];

function formatINR(amount: number): string {
  return `₹${Math.abs(amount).toLocaleString("en-IN")}`;
}

export default function LendenLandingClient({
  welcomeUrl = "/splash",
}: LendenLandingClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Live Ledger Simulator state
  const [demoContacts, setDemoContacts] = useState<LedgerContact[]>(() =>
    INITIAL_CONTACTS.map((c) => ({ ...c }))
  );
  const [demoLang, setDemoLang] = useState<"en" | "hi">("en");
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [simName, setSimName] = useState("");
  const [simAmount, setSimAmount] = useState("");
  const [simFeedback, setSimFeedback] = useState("");

  // FAQ accordion state (first item open by default)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Download modal & toast state
  const [downloadModalPlatform, setDownloadModalPlatform] =
    useState<DownloadPlatform | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDownloadModalPlatform(null);
        setMobileMenuOpen(false);
      }
    };

    if (downloadModalPlatform) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [downloadModalPlatform]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.clearTimeout((window as unknown as { __lendenToast?: number }).__lendenToast);
    (window as unknown as { __lendenToast?: number }).__lendenToast = window.setTimeout(
      () => {
        setToastMessage(null);
      },
      3000
    );
  };

  const totalReceive = demoContacts
    .filter((item) => item.type === "receive")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPay = demoContacts
    .filter((item) => item.type === "pay")
    .reduce((sum, item) => sum + item.amount, 0);

  const netBalance = totalReceive - totalPay;

  const handleAddSimulatedEntry = (action: "gave" | "took") => {
    const trimmedName = simName.trim();
    const numericAmount = Number(simAmount);

    if (!trimmedName) {
      setSimFeedback("Please enter a contact name.");
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setSimFeedback("Please enter a valid rupee amount.");
      return;
    }

    setSimFeedback("");
    const roundedAmount = Math.round(numericAmount);
    const newEntry: LedgerContact = {
      id: Date.now(),
      name: trimmedName,
      note: action === "gave" ? "Lent via Quick Entry" : "Borrowed via Quick Entry",
      amount: roundedAmount,
      type: action === "gave" ? "receive" : "pay",
      due: "Just now",
    };

    setDemoContacts((prev) => [newEntry, ...prev]);
    setSimName("");
    setSimAmount("");
    setQuickEntryOpen(false);
    showToast(`Added ${formatINR(roundedAmount)} for ${trimmedName}`);
  };

  const handleResetDemo = () => {
    setDemoContacts(INITIAL_CONTACTS.map((c) => ({ ...c })));
    setSimFeedback("");
    showToast("Demo ledger reset to defaults");
  };

  const handleCopySupportEmail = async () => {
    const email = "hello@apearix.com";
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      setCopiedEmail(true);
      showToast(`Support email copied: ${email}`);
      window.setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      showToast(`Support email: ${email}`);
    }
  };

  const getModalCopy = (platform: DownloadPlatform | null) => {
    switch (platform) {
      case "android":
        return {
          title: "Download Lenden for Android",
          subtitle: "Install on Android or scan the QR code below",
        };
      case "ios":
        return {
          title: "Download Lenden for iOS",
          subtitle: "Get Lenden on iPhone & iPad or scan the QR code",
        };

      default:
        return {
          title: "Get the Lenden App",
          subtitle: "Available on Android, iOS & Web Browser",
        };
    }
  };

  const modalCopy = getModalCopy(downloadModalPlatform);

  return (
    <div className="min-h-screen bg-[#edf4ef] text-[#17231d] antialiased selection:bg-[#d5f86c] selection:text-[#064a37] overflow-x-hidden">
      <style jsx global>{`
        .lenden-balance-gradient {
          background: linear-gradient(115deg, #0b8159 0%, #139264 100%);
        }
        .lenden-hero-gradient {
          background:
            radial-gradient(circle at 85% 15%, rgba(213, 248, 108, 0.22) 0%, transparent 42%),
            radial-gradient(circle at 10% 80%, rgba(11, 129, 89, 0.09) 0%, transparent 45%),
            #edf4ef;
        }
        .lenden-dark-forest-card {
          background:
            radial-gradient(circle at 90% 15%, rgba(213, 248, 108, 0.16) 0%, transparent 45%),
            linear-gradient(135deg, #064a37 0%, #075d43 100%);
        }
        .lenden-no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .lenden-no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes lendenPulseSoft {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.75;
          }
        }
        .lenden-dot-pulse {
          animation: lendenPulseSoft 2.2s infinite ease-in-out;
        }
      `}</style>

      {/* ===================================================================== */}
      {/* 1. STICKY GLASSMORPHISM NAVBAR                                        */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-40 w-full bg-[#edf4ef]/85 backdrop-blur-md border-b border-[#d6e4da] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo Mark */}
            <a href="#" className="flex items-center gap-3 group focus:outline-none">
              <div className="relative w-10 h-10 rounded-xl bg-[# ] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.png"
                  alt="Lenden logo"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#102b24] leading-none">
                  Lenden
                </span>
                <span className="text-[11px] font-medium text-[#6a7971] tracking-wide mt-0.5">
                   Har Lenden Ka Clear Hisab
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#374640]">
              <a href="#features" className="hover:text-[#087354] transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-[#087354] transition-colors">
                How It Works
              </a>
              <a href="#live-preview" className="hover:text-[#087354] transition-colors">
                Live Preview
              </a>
              <a href="#why-lenden" className="hover:text-[#087354] transition-colors">
                Why Lenden
              </a>
              <a href="#faq" className="hover:text-[#087354] transition-colors">
                FAQ
              </a>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
             
              <button
                type="button"
                onClick={() => setDownloadModalPlatform("all")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#087354] hover:bg-[#075d43] shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#d5f86c]" />
                <span>Download App</span>
              </button>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-xl bg-white border border-[#d6e4da] text-[#102b24] hover:bg-[#e4f6eb] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#d6e4da] px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-1 text-base font-medium text-[#17231d]">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-[#f4f8f5]"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-[#f4f8f5]"
              >
                How It Works
              </a>
              <a
                href="#live-preview"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-[#f4f8f5]"
              >
                Live Preview
              </a>
              <a
                href="#why-lenden"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-[#f4f8f5]"
              >
                Why Lenden
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-[#f4f8f5]"
              >
                FAQ
              </a>
            </nav>
            <div className="pt-3 border-t border-[#e4ebe6] grid grid-cols-1 gap-2.5">
             
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDownloadModalPlatform("all");
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#087354] cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-[#d5f86c]" />
                <span>Download Mobile App</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ===================================================================== */}
      {/* 2. HERO SECTION + INTERACTIVE LIVE LEDGER SIMULATOR                   */}
      {/* ===================================================================== */}
      <section
        id="live-preview"
        className="lenden-hero-gradient relative pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-[#d6e4da]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column: Copy & App Download Badges */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#064a37] text-white text-xs sm:text-sm font-medium shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d5f86c] lenden-dot-pulse" />
                <span>Personal Money Ledger &amp; Debt Tracker</span>
              </div>

              <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-[3.5rem] text-[#102b24] tracking-tight leading-[1.12]">
                Every rupee. <br className="hidden sm:inline" />
                <span className="relative inline-block text-[#087354]">
                  Clearly tracked.
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#d5f86c]"
                    viewBox="0 0 240 12"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 9C65 3 175 3 238 9"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#374640] max-w-xl mx-auto lg:mx-0 ">
                Keep crystal-clear records of money lent, borrowed, and shared with friends,
                family, and daily contacts. Everything organized in one secure place.
              </p>

              {/* Download Store Badges + Open Web App CTA */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <button
                  type="button"
                  onClick={() => setDownloadModalPlatform("android")}
                  className="w-full sm:w-auto inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#064a37] hover:bg-[#075d43] text-white shadow-[0_10px_30px_-10px_rgba(6,74,55,0.12)] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M3.6 2.4C3.3 2.7 3.1 3.2 3.1 3.9V20.1C3.1 20.8 3.3 21.3 3.6 21.6L3.8 21.7L13.1 12.4V12.2V12L3.8 2.3L3.6 2.4Z"
                      fill="#4ADE80"
                    />
                    <path
                      d="M16.2 15.5L13.1 12.4V12.2V12L16.2 8.9L16.4 9L20.1 11.1C21.1 11.7 21.1 12.7 20.1 13.3L16.4 15.4L16.2 15.5Z"
                      fill="#d5f86c"
                    />
                    <path
                      d="M16.4 15.4L13.1 12.1L3.6 21.6C4 22 4.6 22 5.3 21.6L16.4 15.4Z"
                      fill="#F87171"
                    />
                    <path
                      d="M16.4 9L5.3 2.7C4.6 2.3 4 2.4 3.6 2.8L13.1 12.3L16.4 9Z"
                      fill="#60A5FA"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider text-[#e1f7e9]/80 leading-none">
                      Get it on
                    </div>
                    <div className="text-sm font-bold text-white leading-tight mt-0.5">
                      Google Play
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDownloadModalPlatform("ios")}
                  className="w-full sm:w-auto inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#064a37] hover:bg-[#075d43] text-white shadow-[0_10px_30px_-10px_rgba(6,74,55,0.12)] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <svg
                    className="w-6 h-6 shrink-0 text-white fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.96 6.32c.67-.81 1.12-1.94 1-3.07-.96.04-2.13.64-2.82 1.45-.61.71-1.14 1.85-.99 2.96 1.07.08 2.15-.53 2.81-1.34z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider text-[#e1f7e9]/80 leading-none">
                      Download on the
                    </div>
                    <div className="text-sm font-bold text-white leading-tight mt-0.5">
                      App Store
                    </div>
                  </div>
                </button>

                <a
                  href={welcomeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-white hover:bg-[#e4f6eb] text-[#064a37] font-semibold text-sm border border-[#d6e4da] hover:border-[#087354] shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  <Globe className="w-4 h-4 text-[#087354]" />
                  <span>Open Web App</span>
                  <ArrowRight className="w-4 h-4 text-[#087354]" />
                </a>
              </div>

              {/* Micro Trust Line & QR Trigger */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm text-[#374640]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087354]" />
                  Free forever for personal use
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#087354]" />
                  No ads or spam
                </span>

              </div>
            </div>

            {/* Right Column: Interactive Live Mobile App Ledger Simulator */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[400px]">
                <div className="hidden sm:block absolute -top-4 -right-4 w-28 h-28 rounded-3xl bg-[#d5f86c]/70 -z-10 rotate-6" />
                <div className="hidden sm:block absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-[#087354]/15 -z-10" />

                <div className="mb-2.5 flex items-center justify-between px-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064a37] bg-white/90 border border-[#d6e4da] px-3 py-1 rounded-full shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#0c8058] animate-ping" />
                    Interactive Demo — Try adding an entry!
                  </span>
                  <button
                    type="button"
                    onClick={handleResetDemo}
                    className="text-xs font-medium text-[#6a7971] hover:text-[#087354] underline cursor-pointer"
                  >
                    Reset demo
                  </button>
                </div>

                {/* Mobile App Frame */}
                <div className="bg-[#f4f8f5] rounded-[2rem] border-4 border-[#064a37] shadow-[0_25px_60px_-15px_rgba(6,74,55,0.22)] overflow-hidden">
                  <div className="bg-[#064a37] text-white px-5 pt-4 pb-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#087354] flex items-center justify-center">
                          <span className="font-extrabold text-sm text-[#d5f86c]">₹</span>
                        </div>
                        <div>
                          <div className="font-bold text-sm leading-none">Lenden</div>
                          <div className="text-[10px] text-[#e1f7e9]/75 mt-0.5">
                            Personal Ledger
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDemoLang((prev) => (prev === "en" ? "hi" : "en"))}
                        title="Click to toggle EN / हिन्दी preview"
                        className="cursor-pointer px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-[#d5f86c] transition-colors"
                      >
                        EN / हिं
                      </button>
                    </div>

                    {/* Vibrant Green Gradient Net Balance Card */}
                    <div className="lenden-balance-gradient rounded-2xl p-4 shadow-lg border border-white/15">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#e1f7e9]">
                          {demoLang === "en" ? "Net Balance" : "कुल बैलेंस"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${netBalance >= 0
                            ? "bg-[#d5f86c] text-[#064a37]"
                            : "bg-[#fff0f0] text-[#c23e49]"
                            }`}
                        >
                          {netBalance >= 0
                            ? demoLang === "en"
                              ? "Overall Receivable"
                              : "कुल लेना है"
                            : demoLang === "en"
                              ? "Overall Payable"
                              : "कुल देना है"}
                        </span>
                      </div>
                      <div className="font-extrabold text-3xl text-white tracking-tight mt-1">
                        {netBalance >= 0 ? `+ ${formatINR(netBalance)}` : `- ${formatINR(netBalance)}`}
                      </div>

                      {/* Split Receive vs Pay Pills */}
                      <div className="grid grid-cols-2 gap-2.5 mt-4">
                        <div className="bg-[#e4f6eb] rounded-xl p-2.5">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#087354]">
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>
                              {demoLang === "en" ? "You will receive" : "आपको मिलेंगे"}
                            </span>
                          </div>
                          <div className="font-bold text-base text-[#064a37] mt-0.5">
                            {formatINR(totalReceive)}
                          </div>
                        </div>
                        <div className="bg-[#fff0f0] rounded-xl p-2.5">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#c23e49]">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>
                              {demoLang === "en" ? "You will pay" : "आपको देने हैं"}
                            </span>
                          </div>
                          <div className="font-bold text-base text-[#c23e49] mt-0.5">
                            {formatINR(totalPay)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ledger Contacts List Section */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6a7971]">
                        {demoLang === "en" ? "Person-Wise Ledger" : "व्यक्ति अनुसार हिसाब"}
                      </span>
                      <span className="text-[11px] font-medium text-[#087354]">
                        {demoContacts.length} {demoLang === "en" ? "contacts" : "संपर्क"}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[215px] overflow-y-auto lenden-no-scrollbar">
                      {demoContacts.map((person) => {
                        const isReceive = person.type === "receive";
                        const initials = person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();

                        return (
                          <div
                            key={person.id}
                            className="bg-white rounded-2xl p-3 border border-[#e4ebe6] flex items-center justify-between gap-2.5 hover:border-[#087354]/40 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${isReceive
                                  ? "bg-[#e1f7e9] text-[#064a37]"
                                  : "bg-[#fff0f0] text-[#c23e49]"
                                  }`}
                              >
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs text-[#102b24] truncate">
                                  {person.name}
                                </div>
                                <div className="text-[10px] text-[#6a7971] truncate">
                                  {person.note} • {person.due}
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div
                                className={`font-bold text-xs ${isReceive ? "text-[#087354]" : "text-[#c23e49]"
                                  }`}
                              >
                                {isReceive ? "+" : "-"} {formatINR(person.amount)}
                              </div>
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded-md text-[9px] font-semibold ${isReceive
                                  ? "bg-[#e4f6eb] text-[#087354]"
                                  : "bg-[#fff0f0] text-[#c23e49]"
                                  }`}
                              >
                                {isReceive
                                  ? demoLang === "en"
                                    ? "You will receive"
                                    : "आपको मिलेंगे"
                                  : demoLang === "en"
                                    ? "You will pay"
                                    : "आपको देने हैं"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Entry Panel */}
                    {quickEntryOpen ? (
                      <div className="bg-white rounded-2xl p-3.5 border border-[#087354]/30 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#102b24]">
                            Quick Entry Simulator
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setQuickEntryOpen(false);
                              setSimFeedback("");
                            }}
                            className="text-[#6a7971] hover:text-[#17231d] cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={simName}
                            onChange={(e) => setSimName(e.target.value)}
                            placeholder="Friend's name (e.g. Neha)"
                            maxLength={22}
                            className="w-full px-3 py-2 rounded-xl bg-[#f4f8f5] border border-[#d6e4da] text-xs text-[#102b24] focus:outline-none focus:border-[#087354]"
                          />
                          <input
                            type="number"
                            value={simAmount}
                            onChange={(e) => setSimAmount(e.target.value)}
                            placeholder="Amount ₹ (e.g. 800)"
                            min={1}
                            max={999999}
                            className="w-full px-3 py-2 rounded-xl bg-[#f4f8f5] border border-[#d6e4da] text-xs text-[#102b24] focus:outline-none focus:border-[#087354]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddSimulatedEntry("gave")}
                            className="py-2 px-3 rounded-xl bg-[#087354] hover:bg-[#075d43] text-white text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#d5f86c]" />
                            <span>I Gave (Receive)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddSimulatedEntry("took")}
                            className="py-2 px-3 rounded-xl bg-[#c23e49] hover:opacity-90 text-white text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-opacity"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>I Took (Pay)</span>
                          </button>
                        </div>
                        {simFeedback && (
                          <p className="text-[11px] font-medium text-[#c23e49]">{simFeedback}</p>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSimFeedback("");
                          setQuickEntryOpen(true);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-[#064a37] hover:bg-[#075d43] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#d5f86c] text-[#064a37] flex items-center justify-center font-bold">
                          +
                        </span>
                        <span>
                          {demoLang === "en"
                            ? "Tap to Test Quick Entry (+ I Gave / I Took)"
                            : "नई एंट्री टेस्ट करें (+ दिए / लिए)"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. TRUST & HIGHLIGHTS STRIP                                           */}
      {/* ===================================================================== */}
      <section className="bg-white border-b border-[#d6e4da] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#e1f7e9] text-[#087354] flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-[#102b24]">100% Ad-Free</div>
                <div className="text-xs text-[#6a7971]">Zero clutter or distractions</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#e1f7e9] text-[#087354] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-[#102b24]">
                  Instant OTP Security
                </div>
                <div className="text-xs text-[#6a7971]">Encrypted account access</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#e1f7e9] text-[#087354] flex items-center justify-center shrink-0">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-[#102b24]">
                  English &amp; हिन्दी
                </div>
                <div className="text-xs text-[#6a7971]">Seamless bilingual interface</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#e1f7e9] text-[#087354] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-[#102b24]">
                  Cross-Platform Sync
                </div>
                <div className="text-xs text-[#6a7971]">Android, iOS &amp; Web App</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. CORE FEATURES GRID (6 CARDS)                                       */}
      {/* ===================================================================== */}
      <section id="features" className="py-16 sm:py-24 bg-[#f4f8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e1f7e9] text-[#064a37] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#087354]" />
              Built for Everyday Clarity
            </span>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-[#102b24] tracking-tight">
              Everything you need to manage personal lending &amp; borrowing
            </h2>
            <p className="text-sm sm:text-base text-[#374640]">
              Thoughtfully engineered so you never lose track of a single rupee—whether it’s
              splitting dinner, lending to a friend, or tracking daily expenses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-3xl p-7 border border-[#d6e4da] shadow-[0_10px_30px_-10px_rgba(6,74,55,0.08)] hover:border-[#087354]/50 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#064a37] text-[#d5f86c] flex items-center justify-center mb-5">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-[#102b24] mb-2.5">
                Net Balance at a Glance
              </h3>
              <p className="text-sm text-[#374640] leading-relaxed">
                See your exact financial standing the second you open Lenden—clearly split into
                total <span className="font-semibold text-[#087354]">You will receive</span> and{" "}
                <span className="font-semibold text-[#c23e49]">You will pay</span>.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-[#d6e4da] shadow-[0_10px_30px_-10px_rgba(6,74,55,0.08)] hover:border-[#087354]/50 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#e1f7e9] text-[#087354] flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-[#102b24] mb-2.5">Person-Wise Ledger</h3>
              <p className="text-sm text-[#374640] leading-relaxed">
                Add friends, roommates, colleagues, or regular contacts by name and inspect a
                dedicated, chronological transaction timeline for each person.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-[#d6e4da] shadow-[0_10px_30px_-10px_rgba(6,74,55,0.08)] hover:border-[#087354]/50 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#e1f7e9] text-[#087354] flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-[#102b24] mb-2.5">One-Tap Quick Entry</h3>
              <p className="text-sm text-[#374640] leading-relaxed">
                Record <span className="font-semibold text-[#102b24]">“I Gave”</span> or{" "}
                <span className="font-semibold text-[#102b24]">“I Took”</span> in seconds. Attach
                short notes and custom dates so every entry has complete context.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-[#d6e4da] shadow-[0_10px_30px_-10px_rgba(6,74,55,0.08)] hover:border-[#087354]/50 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#e1f7e9] text-[#087354] flex items-center justify-center mb-5">
                <CalendarClock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-[#102b24] mb-2.5">
                Due Dates &amp; Smart Reminders
              </h3>
              <p className="text-sm text-[#374640] leading-relaxed">
                Assign expected return or repayment dates on any entry so upcoming settlements stay
                visible and no pending balance slips through the cracks.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-[#d6e4da] shadow-[0_10px_30px_-10px_rgba(6,74,55,0.08)] hover:border-[#087354]/50 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#e1f7e9] text-[#087354] flex items-center justify-center mb-5">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-[#102b24] mb-2.5">
                English &amp; Hindi Support
              </h3>
              <p className="text-sm text-[#374640] leading-relaxed">
                Switch effortlessly between{" "}
                <span className="font-semibold text-[#102b24]">English</span> and{" "}
                <span className="font-semibold text-[#102b24]">हिन्दी</span> anytime inside the
                app—designed for comfort across every household.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-[#d6e4da] shadow-[0_10px_30px_-10px_rgba(6,74,55,0.08)] hover:border-[#087354]/50 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#e1f7e9] text-[#087354] flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-[#102b24] mb-2.5">100% Safe &amp; Private</h3>
              <p className="text-sm text-[#374640] leading-relaxed">
                Protected with Email OTP verification and encrypted password authentication. Your
                ledger stays private to you and synced securely across devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. HOW IT WORKS (3-STEP FLOW)                                         */}
      {/* ===================================================================== */}
      <section
        id="how-it-works"
        className="py-16 sm:py-24 bg-[#edf4ef] border-y border-[#d6e4da]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#d6e4da] text-[#064a37] text-xs font-bold uppercase tracking-wider">
              Simple 3-Step Workflow
            </span>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-[#102b24] tracking-tight">
              From entry to settlement in three effortless steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-[#d6e4da] shadow-[0_10px_30px_-10px_rgba(6,74,55,0.08)]">
              <div className="flex items-center justify-between mb-6">
                <span className="w-11 h-11 rounded-2xl bg-[#064a37] text-[#d5f86c] font-extrabold text-lg flex items-center justify-center">
                  01
                </span>
                <UserPlus className="w-6 h-6 text-[#087354]" />
              </div>
              <h3 className="font-bold text-xl text-[#102b24] mb-2">Add a Contact</h3>
              <p className="text-sm text-[#374640] leading-relaxed">
                Create a personal ledger profile for any friend, family member, or daily contact in
                one tap—no complicated setup required.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#d6e4da] shadow-[0_10px_30px_-10px_rgba(6,74,55,0.08)]">
              <div className="flex items-center justify-between mb-6">
                <span className="w-11 h-11 rounded-2xl bg-[#064a37] text-[#d5f86c] font-extrabold text-lg flex items-center justify-center">
                  02
                </span>
                <ArrowLeftRight className="w-6 h-6 text-[#087354]" />
              </div>
              <h3 className="font-bold text-xl text-[#102b24] mb-2">
                Log “I Gave” or “I Took”
              </h3>
              <p className="text-sm text-[#374640] leading-relaxed">
                Enter the amount, select whether you gave or took money, add an optional note or
                due date, and save instantly.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#d6e4da] shadow-[0_10px_30px_-10px_rgba(6,74,55,0.08)]">
              <div className="flex items-center justify-between mb-6">
                <span className="w-11 h-11 rounded-2xl bg-[#064a37] text-[#d5f86c] font-extrabold text-lg flex items-center justify-center">
                  03
                </span>
                <CheckCircle className="w-6 h-6 text-[#087354]" />
              </div>
              <h3 className="font-bold text-xl text-[#102b24] mb-2">Track &amp; Settle Cleanly</h3>
              <p className="text-sm text-[#374640] leading-relaxed">
                Watch your Net Balance update automatically. Settle dues with zero awkwardness and a
                complete audit trail everyone trusts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. WHY LENDEN? SIDE-BY-SIDE COMPARISON                                */}
      {/* ===================================================================== */}
      <section id="why-lenden" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e1f7e9] text-[#064a37] text-xs font-bold uppercase tracking-wider">
              Why Switch to Lenden?
            </span>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-[#102b24] tracking-tight">
              Leave messy notes and forgotten tabs behind
            </h2>
            <p className="text-sm sm:text-base text-[#374640]">
              See how Lenden replaces scattered chat messages, paper notebooks, and clunky
              spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            <div className="rounded-3xl p-7 sm:p-9 bg-[#f4f8f5] border border-[#d6e4da] flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff0f0] text-[#c23e49] text-xs font-bold mb-5">
                  <XCircle className="w-4 h-4" />
                  The Old Way
                </div>
                <h3 className="font-bold text-2xl text-[#102b24] mb-6">
                  Paper Diaries &amp; Messy Spreadsheets
                </h3>
                <ul className="space-y-4 text-sm sm:text-base text-[#374640]">
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-[#c23e49] shrink-0 mt-0.5" />
                    <span>Easy to forget who owes whom or lose handwritten scraps of paper.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-[#c23e49] shrink-0 mt-0.5" />
                    <span>Bloated finance apps filled with noisy ads, loan spam, and clutter.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-[#c23e49] shrink-0 mt-0.5" />
                    <span>Manual math errors when calculating partial repayments over time.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-[#c23e49] shrink-0 mt-0.5" />
                    <span>No due-date visibility or quick mobile access when you’re on the go.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl p-7 sm:p-9 bg-[#064a37] text-white shadow-[0_10px_30px_-10px_rgba(6,74,55,0.12)] border border-[#075d43] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#d5f86c]/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5f86c] text-[#064a37] text-xs font-bold mb-5">
                  <Sparkles className="w-4 h-4" />
                  The Lenden Advantage
                </div>
                <h3 className="font-bold text-2xl text-white mb-6">Lenden Personal Ledger App</h3>
                <ul className="space-y-4 text-sm sm:text-base text-[#e1f7e9]">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#d5f86c] text-[#064a37] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>
                      <strong className="text-white">Zero forgotten entries:</strong> Every rupee
                      lent or borrowed is timestamped and totaled automatically.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#d5f86c] text-[#064a37] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>
                      <strong className="text-white">Clutter-free, zero-ad interface:</strong>{" "}
                      Focused purely on your numbers with high-contrast legibility.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#d5f86c] text-[#064a37] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>
                      <strong className="text-white">Lightning-fast performance:</strong>{" "}
                      Lightweight mobile &amp; web experience built for instant logging.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#d5f86c] text-[#064a37] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>
                      <strong className="text-white">Automated due-date tracking:</strong> Clear
                      visual status pills for upcoming and settled balances.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. INTERACTIVE FAQ ACCORDION                                          */}
      {/* ===================================================================== */}
      <section id="faq" className="py-16 sm:py-24 bg-[#f4f8f5] border-t border-[#d6e4da]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#d6e4da] text-[#064a37] text-xs font-bold uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-[#102b24] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.question}
                  className="bg-white rounded-2xl border border-[#d6e4da] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#102b24] hover:bg-[#f4f8f5]/60 transition-colors cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#087354] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm sm:text-base text-[#374640] leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. BOTTOM APP DOWNLOAD BANNER                                         */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-20 bg-[#edf4ef]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lenden-dark-forest-card rounded-[2.25rem] p-8 sm:p-12 lg:p-16 text-white shadow-[0_25px_60px_-15px_rgba(6,74,55,0.22)] relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full border border-[#d5f86c]/20 pointer-events-none" />
            <div className="absolute -right-4 -bottom-4 w-44 h-44 rounded-full border border-[#d5f86c]/20 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#d5f86c] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#d5f86c]" />
                Available on Android, iOS &amp; Web
              </div>

              <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                Start your crystal-clear ledger today.
              </h2>

              <p className="text-base sm:text-lg text-[#e1f7e9] max-w-xl mx-auto leading-relaxed">
                Download the Lenden app now or launch it straight in your browser to keep every
                rupee organized, transparent, and stress-free.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setDownloadModalPlatform("android")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-[#d5f86c] hover:brightness-105 text-[#064a37] font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Download for Android</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDownloadModalPlatform("ios")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#e4f6eb] text-[#064a37] font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 text-[#087354]" />
                  <span>Download for iOS</span>
                </button>

                <a
                  href={welcomeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-sm transition-all"
                >
                  <span>Launch Web App</span>
                  <ArrowUpRight className="w-4 h-4 text-[#d5f86c]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 9. CLEAN FOOTER                                                       */}
      {/* ===================================================================== */}
      <footer className="bg-white border-t border-[#d6e4da] pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#e4ebe6]">
            <div className="space-y-2.5 max-w-sm">
              <a href="#" className="flex items-center gap-3 group focus:outline-none">
              <div className="relative w-10 h-10 rounded-xl bg-[# ] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.png"
                  alt="Lenden logo"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#102b24] leading-none">
                  Lenden
                </span>
                <span className="text-[11px] font-medium text-[#6a7971] tracking-wide mt-0.5">
                   Har Lenden Ka Clear Hisab
                </span>
              </div>
            </a>
              <p className="text-sm text-[#374640]">
                Every rupee. Clearly tracked. Personal money ledger &amp; debt tracker built for
                clarity and peace of mind.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 sm:gap-12 text-sm">
              <div className="space-y-2.5">
                <div className="font-bold text-[#102b24]">Product</div>
                <ul className="space-y-2 text-[#374640]">
                  <li>
                    <a href="#features" className="hover:text-[#087354] transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="hover:text-[#087354] transition-colors">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="#why-lenden" className="hover:text-[#087354] transition-colors">
                      Why Lenden
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-[#087354] transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <div className="font-bold text-[#102b24]">Get Lenden</div>
                <ul className="space-y-2 text-[#374640]">
                  <li>
                    <button
                      type="button"
                      onClick={() => setDownloadModalPlatform("android")}
                      className="hover:text-[#087354] transition-colors cursor-pointer"
                    >
                      Android App
                    </button>
                  </li>
                  {/* <li>
                    <button
                      type="button"
                      onClick={() => setDownloadModalPlatform("ios")}
                      className="hover:text-[#087354] transition-colors cursor-pointer"
                    >
                      iOS App
                    </button>
                  </li> */}
                  <li>
                    <a
                      href={welcomeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#087354] transition-colors"
                    >
                      Web App
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <div className="font-bold text-[#102b24]">Support</div>
                <ul className="space-y-2 text-[#374640]">
                  <li>
                    <a
                      href="mailto:hello@apearix.com"
                      className="inline-flex items-center gap-1.5 hover:text-[#087354] transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#087354]" />
                      hello@apearix.com
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleCopySupportEmail}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087354] hover:underline cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedEmail ? "Copied!" : "Copy support email"}</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6a7971]">
            <p>© 2026 Lenden by Apearix. All rights reserved.</p>
            <p>Made with precision for everyday personal finance.</p>
          </div>
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* INTERACTIVE APP DOWNLOAD MODAL (QR + DIRECT STORE / WEB LINKS)        */}
      {/* ===================================================================== */}
      {downloadModalPlatform && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDownloadModalPlatform(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102b24]/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#d6e4da] shadow-2xl relative">
            <button
              type="button"
              onClick={() => setDownloadModalPlatform(null)}
              aria-label="Close Modal"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#f4f8f5] hover:bg-[#e1f7e9] text-[#17231d] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-[#064a37] text-[#d5f86c] flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-[#102b24]">{modalCopy.title}</h3>
                <p className="text-xs text-[#6a7971]">{modalCopy.subtitle}</p>
              </div>
            </div>

            <div className="my-5 p-5 rounded-2xl bg-[#f4f8f5] border border-[#d6e4da] flex flex-col items-center text-center">
              <div className="p-3 bg-white rounded-2xl border border-[#d6e4da] shadow-xs">
                <svg
                  className="w-36 h-36 text-[#064a37]"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="QR code for Lenden"
                >
                  <rect width="120" height="120" rx="8" fill="#ffffff" />
                  <rect x="10" y="10" width="30" height="30" rx="4" stroke="#064a37" strokeWidth="5" />
                  <rect x="19" y="19" width="12" height="12" rx="2" fill="#064a37" />
                  <rect x="80" y="10" width="30" height="30" rx="4" stroke="#064a37" strokeWidth="5" />
                  <rect x="89" y="19" width="12" height="12" rx="2" fill="#064a37" />
                  <rect x="10" y="80" width="30" height="30" rx="4" stroke="#064a37" strokeWidth="5" />
                  <rect x="19" y="89" width="12" height="12" rx="2" fill="#064a37" />
                  <rect x="50" y="12" width="8" height="8" rx="1.5" fill="#087354" />
                  <rect x="64" y="18" width="8" height="14" rx="1.5" fill="#064a37" />
                  <rect x="48" y="30" width="10" height="8" rx="1.5" fill="#064a37" />
                  <rect x="12" y="50" width="14" height="8" rx="1.5" fill="#064a37" />
                  <rect x="32" y="52" width="8" height="16" rx="1.5" fill="#087354" />
                  <rect x="82" y="50" width="12" height="8" rx="1.5" fill="#064a37" />
                  <rect x="100" y="52" width="10" height="14" rx="1.5" fill="#087354" />
                  <rect x="50" y="82" width="8" height="12" rx="1.5" fill="#064a37" />
                  <rect x="64" y="88" width="14" height="8" rx="1.5" fill="#087354" />
                  <rect x="84" y="76" width="10" height="10" rx="1.5" fill="#064a37" />
                  <rect x="98" y="88" width="12" height="20" rx="1.5" fill="#064a37" />
                  <rect x="54" y="102" width="22" height="8" rx="1.5" fill="#064a37" />
                  <rect x="46" y="46" width="28" height="28" rx="7" fill="#064a37" />
                  <text
                    x="60"
                    y="65"
                    textAnchor="middle"
                    fill="#d5f86c"
                    fontWeight="800"
                    fontSize="16"
                  >
                    ₹
                  </text>
                </svg>
              </div>
              <span className="mt-3 text-xs font-semibold text-[#17231d]">
                lenden.apearix.com/splash
              </span>
              <span className="text-[11px] text-[#6a7971]">
                Point your phone camera to open instantly
              </span>
            </div>

            <div className="space-y-2.5">
              <a
                href={`${welcomeUrl}?platform=android`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast("Redirecting to Lenden Android Download...")}
                className="w-full py-3 px-4 rounded-xl bg-[#087354] hover:bg-[#075d43] text-white font-semibold text-sm flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Play className="w-4 h-4 text-[#d5f86c] fill-current" />
                  <span>Download for Android (Google Play / APK)</span>
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </a>



              <a
                href={welcomeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#f4f8f5] hover:bg-[#e1f7e9] text-[#064a37] border border-[#d6e4da] font-semibold text-sm flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#087354]" />
                  <span>Use Directly in Browser (Web App)</span>
                </span>
                <ExternalLink className="w-4 h-4 text-[#087354]" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* NON-BLOCKING TOAST NOTIFICATION                                       */}
      {/* ===================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#064a37] text-white text-sm font-medium shadow-xl border border-[#087354]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d5f86c]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}