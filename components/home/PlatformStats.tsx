"use client";

import { usePlatformStats } from "@/hooks/useAssets";
import { useHolderTotals } from "@/hooks/useHolderTotals";
import { formatUsdCents, compactNumber } from "@/lib/format";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

/** Headline platform metrics sourced live from the registry contract. */
export function PlatformStats() {
  const stats = usePlatformStats();
  const holders = useHolderTotals(
    stats.data?.totalHolders !== null ? null : (stats.data?.assets ?? null),
  );

  const holderCount = stats.data?.totalHolders ?? holders.data ?? null;

  if (stats.error) {
    return (
      <ErrorState
        title="Couldn't load platform stats"
        message={stats.error}
        onRetry={stats.refetch}
      />
    );
  }

  const items = [
    {
      label: "Assets tokenized",
      value: stats.data ? stats.data.totalAssets.toLocaleString() : null,
    },
    {
      label: "Total value locked (self-reported)",
      value: stats.data ? formatUsdCents(stats.data.tvl, { compact: true }) : null,
    },
    {
      label: "Approved holders",
      value: holderCount !== null ? compactNumber(holderCount) : null,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="card p-6 text-center sm:text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-base-100/40">
            {item.label}
          </p>
          {item.value === null ? (
            <Skeleton className="mt-2 h-9 w-40" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-base-100">{item.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
