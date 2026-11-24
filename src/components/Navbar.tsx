import type { SetId } from "../types";
import { PROBLEM_SETS, SET_ORDER } from "../lib/sets";

interface NavbarProps {
  setId: SetId;
  onChange: (id: SetId) => void;
  soundOn: boolean;
  onToggleSound: () => void;
}

export function Navbar({
  setId,
  onChange,
  soundOn,
  onToggleSound,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-[0_6px_20px_-6px_rgba(109,139,255,0.9)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
            </svg>
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
              DSA Spin
            </h1>
            <p className="text-[11px] text-white/45">
              Let the wheel decide what you grind
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="flex flex-1 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 sm:flex-none">
            {SET_ORDER.map((id) => {
              const active = id === setId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange(id)}
                  className={`flex-1 cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:flex-none sm:px-4 sm:text-sm ${
                    active
                      ? "bg-brand-500 text-white shadow-[0_4px_14px_-4px_rgba(79,108,255,0.9)]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                  aria-pressed={active}
                  title={`${PROBLEM_SETS[id].problems.length} questions`}
                >
                  {PROBLEM_SETS[id].label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundOn}
            title={soundOn ? "Mute sounds" : "Enable sounds"}
            className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition ${
              soundOn
                ? "border-brand-500/40 bg-brand-500/15 text-brand-400"
                : "border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70"
            }`}
          >
            {soundOn ? (
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path d="m16 9 5 5M21 9l-5 5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
