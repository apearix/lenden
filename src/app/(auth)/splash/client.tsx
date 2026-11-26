"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashClient() {
  const router = useRouter();
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    let nextDot = 0;
    const dotTimer = window.setInterval(() => {
      nextDot += 1;
      if (nextDot >= 3) {
        window.clearInterval(dotTimer);
        router.replace("/welcome");
        return;
      }
      setActiveDot(nextDot);
    }, 700);

    return () => window.clearInterval(dotTimer);
  }, [router]);

  return (
    <main className="h-dvh min-h-dvh overflow-hidden bg-[radial-gradient(ellipse_at_20%_5%,#075844_0%,transparent_52%),linear-gradient(145deg,#004b3d_0%,#00604d_58%,#006a53_100%)]">
      <div className="relative isolate h-dvh min-h-dvh w-full overflow-hidden [container-type:inline-size]">
        <div className="pointer-events-none absolute -bottom-[41cqw] -right-[34cqw] size-[94cqw] rounded-full border border-[#41d6a080] shadow-[0_0_18px_#2abe8f33]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-[32cqw] -right-[25cqw] size-[76cqw] rounded-full border border-[#41d6a080] shadow-[0_0_16px_#2abe8f2b]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-[23cqw] -right-[16cqw] size-[58cqw] rounded-full border border-[#41d6a080] shadow-[0_0_14px_#2abe8f24]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-[14cqw] -right-[7cqw] size-[40cqw] rounded-full border border-[#41d6a080] shadow-[0_0_12px_#2abe8f1d]" aria-hidden="true" />
        <div className="relative z-[1] flex h-dvh min-h-dvh flex-col items-center px-[6.2cqw] pb-[calc(15cqw+env(safe-area-inset-bottom))] pt-[calc(14cqw+env(safe-area-inset-top))] text-center">
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <div className="w-[37.3cqw] flex-none" aria-hidden="true">
              <img src="/images/splash-logo.png" alt="Lenden logo" className="block h-auto w-full" />
            </div>

            <div className="mt-[1.55cqw] text-center">
              <h1 className="m-0 text-[16cqw] font-extrabold leading-[.96] text-[#f7fdf9]">Lenden</h1>
              <p className="m-[2.5cqw_0_0] text-[5.35cqw] font-medium text-[rgba(233,244,236,.95)]">Har len-den ka saaf hisaab.</p>
            </div>
          </div>

          <div className="mt-auto flex items-center gap-[2.2cqw]" aria-label="Page indicator">
            {[0, 1, 2].map((dot) => (
              <span
                className={`size-[3.2cqw] rounded-full transition-all duration-300 ${activeDot === dot ? "scale-125 animate-pulse bg-[#d5f86c]" : "bg-[rgba(209,245,186,.6)]"}`}
                key={dot}
              />
            ))}
          </div>

          <p className="m-[4cqw_0_0] text-[4.7cqw] font-medium text-[rgba(230,249,237,.95)]">Made for everyday clarity</p>
        </div>
      </div>
    </main>
  );
}
