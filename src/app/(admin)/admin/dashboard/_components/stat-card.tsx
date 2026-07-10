import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/src/components/ui/card"
import { Skeleton } from "@/src/components/ui/skeleton"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  isLoading: boolean
}

export function StatCard({ icon, label, value, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription>{label}</CardDescription>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}
