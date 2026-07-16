import { SEGMENT_COLORS } from "@/config/constants";

type SegmentBadgeProps = {
  label: string | null;
};

export function SegmentBadge({ label }: SegmentBadgeProps) {
  const text = label ??           "Não classificado";
  const color = SEGMENT_COLORS[text] ?? SEGMENT_COLORS.fallback;

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  );
}
