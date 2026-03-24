import { Shield, Sparkles, Zap } from "lucide-react";

type StatusKind = "impulsionado" | "premium" | "profissional";

const STYLES: Record<
  StatusKind,
  { label: string; className: string; icon: typeof Shield }
> = {
  impulsionado: {
    label: "Impulsionado",
    className: "bg-amber-400 text-white shadow-md",
    icon: Zap,
  },
  premium: {
    label: "Premium",
    className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm",
    icon: Sparkles,
  },
  profissional: {
    label: "Profissional",
    className: "bg-blue-600 text-white shadow-sm",
    icon: Shield,
  },
};

export function StatusBadge({ kind }: { kind: StatusKind }) {
  const { label, className, icon: Icon } = STYLES[kind];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
