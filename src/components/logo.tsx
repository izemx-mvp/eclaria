import { cn } from "@/lib/utils";

export function EclariaLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eclariaGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.72 0.14 155)" />
          <stop offset="100%" stopColor="oklch(0.52 0.14 165)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#eclariaGrad)" />
      {/* Medical cross */}
      <rect x="17" y="9" width="6" height="22" rx="1.5" fill="white" fillOpacity="0.95" />
      <rect x="9" y="17" width="22" height="6" rx="1.5" fill="white" fillOpacity="0.95" />
      {/* Leaf accent */}
      <path
        d="M28 12c-3 0-5.5 2-6.5 5 3 0 5.5-2 6.5-5z"
        fill="oklch(0.88 0.14 130)"
      />
    </svg>
  );
}

export function EclariaWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="h-9 w-9 shrink-0">
        <EclariaLogo />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">Eclaria</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-sidebar-foreground/60">
          Parapharmacie
        </span>
      </div>
    </div>
  );
}
