import type { ComponentType } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";

export function SummaryCard({
  icon: Icon,
  label,
  value,
  isLoading,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  isLoading: boolean;
}) {
  return (
    <Card className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#E7A93C]/30 hover:bg-card h-full">
      <CardContent className="flex items-center gap-4 py-6">
        <div className="flex size-12 items-center justify-center rounded-xl bg-[#E7A93C]/10 text-[#E7A93C] group-hover:scale-110 transition-transform duration-300">
          <Icon className="size-6" />
        </div>
        <div>
          {isLoading ? (
            <Skeleton className="h-7 w-12" />
          ) : (
            <p className="text-2xl font-semibold">{value}</p>
          )}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
