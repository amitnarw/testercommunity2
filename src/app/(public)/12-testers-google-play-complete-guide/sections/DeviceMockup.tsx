"use client";

export function DeviceMockup() {
  return (
    <div className="relative w-[240px] h-[500px] mx-auto shrink-0 select-none">
      <div className="absolute inset-0 rounded-[34px] bg-gradient-to-b from-gray-400 via-gray-600 to-gray-900 p-[3px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="w-full h-full rounded-[31px] bg-[#0a0a0f] overflow-hidden relative">
          <div className="relative z-20 pt-[14px] px-5 flex justify-between items-center">
            <span className="text-white/60 text-[11px] font-semibold tracking-tight">
              10:42
            </span>
            <div className="flex items-center gap-1">
              <svg width="14" height="10" viewBox="0 0 14 10" className="text-white/50">
                <rect x="0.5" y="2" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="0.8" fill="none" />
                <rect x="11" y="3.5" width="2" height="3" rx="0.8" fill="currentColor" />
              </svg>
              <span className="text-white/50 text-[10px] font-semibold">88%</span>
            </div>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-[#0a0a0f] rounded-b-xl z-30" />

          <div className="relative z-10 px-4 pt-2">
            <div className="bg-gradient-to-r from-white/[0.07] to-white/[0.02] rounded-xl p-3 mb-3 border border-white/[0.04]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="white">
                    <polygon points="3,1 11,6 3,11" />
                  </svg>
                </div>
                <span className="text-white/80 text-[11px] font-semibold tracking-tight">
                  Play Console
                </span>
              </div>
              <span className="text-white/35 text-[9px] tracking-wide">
                Closed Testing · v1.2.0
              </span>
            </div>

            <div className="flex gap-2 mb-3">
              <div className="flex-1 bg-white/[0.04] rounded-xl px-3 py-2.5 border border-white/[0.03]">
                <span className="text-white/35 text-[8px] uppercase tracking-wider font-semibold">
                  Testers
                </span>
                <div className="text-white font-bold text-[15px] tracking-tight">
                  12/12
                </div>
              </div>
              <div className="flex-1 bg-white/[0.04] rounded-xl px-3 py-2.5 border border-white/[0.03]">
                <span className="text-white/35 text-[8px] uppercase tracking-wider font-semibold">
                  Days
                </span>
                <div className="text-white font-bold text-[15px] tracking-tight">
                  7/14
                </div>
              </div>
            </div>

            <div className="mb-3 px-0.5">
              <div className="flex justify-between text-[8px] text-white/30 mb-1.5 px-0.5">
                <span className="uppercase tracking-wider font-semibold">Progress</span>
                <span className="font-semibold">50%</span>
              </div>
              <div className="h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary to-primary/50" />
              </div>
            </div>

            <div className="space-y-1.5">
              {[
                { text: "12 testers opted in", done: true },
                { text: "Update v1.0.1 pushed", done: true },
                { text: "Feedback collected", done: true },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 bg-white/[0.03] border border-white/[0.02]"
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      item.done
                        ? "bg-emerald-500/20"
                        : "bg-white/10"
                    }`}
                  >
                    {item.done && (
                      <svg
                        className="w-2 h-2 text-emerald-400"
                        fill="none"
                        viewBox="0 0 10 8"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M1 4l2.5 2.5 5-5" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-[9px] ${
                      item.done ? "text-white/60" : "text-white/25"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 rounded-[31px] bg-gradient-to-b from-white/[0.07] via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100px] h-[3px] bg-gradient-to-b from-white/[0.08] to-transparent rounded-full" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>
      </div>
    </div>
  );
}
