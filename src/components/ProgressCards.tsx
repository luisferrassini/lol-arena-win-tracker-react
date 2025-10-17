import { Card } from "@/components/ui/card"

interface ProgressCardsProps {
  totalChampions: number
  wonChampions: number
  arenaGodProgress: number
  gridSize: 'small' | 'medium'
}

export default function ProgressCards({
  totalChampions,
  wonChampions,
  arenaGodProgress,
  gridSize: _gridSize
}: ProgressCardsProps) {
  const allChampionsProgress = totalChampions > 0 ? (wonChampions / totalChampions) * 100 : 0

  return (
    <div className="flex gap-4 mb-3 w-full">
      {/* All Champions Progress */}
      <Card className="flex-1 p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">All Champions</h3>
            <div className="text-xs text-muted-foreground">
              {allChampionsProgress.toFixed(1)}% complete
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {wonChampions}/{totalChampions}
            </div>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${allChampionsProgress}%` }}
          />
        </div>
      </Card>

      {/* Arena God Progress */}
      <Card className="flex-1 p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Arena God</h3>
            <div className="text-xs text-muted-foreground">
              {arenaGodProgress.toFixed(1)}% to 60 wins
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {wonChampions}/60
            </div>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${arenaGodProgress}%` }}
          />
        </div>
      </Card>
    </div>
  )
}
