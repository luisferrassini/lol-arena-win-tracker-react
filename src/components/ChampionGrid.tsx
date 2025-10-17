import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"

interface Champion {
  id: string
  name: string
  roles: string[]
  key: string
}

interface ChampionGridProps {
  champions: Champion[]
  wins: { [championId: string]: boolean }
  onToggleWin: (championId: string) => void
  gridSize: 'small' | 'medium'
  currentVersion: string
}

export default function ChampionGrid({
  champions,
  wins,
  onToggleWin,
  gridSize,
  currentVersion
}: ChampionGridProps) {
  if (champions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No champions found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters to find champions.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${
      gridSize === 'small' 
        ? 'gap-3 grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20' 
        : 'gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
    }`}>
      {champions.map((champion) => {
        const hasWon = wins[champion.id] || false
        const imageUrl = `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/champion/${champion.id}.png`
        
        return (
          <Card
            key={champion.id}
            className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden rounded-lg ${
              hasWon 
                ? 'ring-2 ring-green-500 bg-green-500/5' 
                : 'hover:ring-2 hover:ring-primary/50'
            } ${gridSize === 'small' ? 'aspect-square' : 'aspect-[4/5]'}`}
            onClick={() => onToggleWin(champion.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggleWin(champion.id)
              }
            }}
            aria-label={`${champion.name} - ${hasWon ? 'Won' : 'Not won'}`}
          >
            <CardContent className="p-0 h-full relative overflow-hidden">
              {/* Champion Image */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={imageUrl}
                  alt={champion.name}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    hasWon ? 'opacity-60 grayscale' : 'group-hover:opacity-90'
                  }`}
                  loading="lazy"
                />
                
                {/* Dark overlay for won champions */}
                {hasWon && (
                  <div className="absolute inset-0 bg-black/40" />
                )}
                
                {/* Status Icon */}
                <div className="absolute top-2 right-2">
                  {hasWon ? (
                    <CheckCircle className="h-5 w-5 text-green-500 bg-background/80 rounded-full" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground bg-background/80 rounded-full" />
                  )}
                </div>
                
                {/* Champion Name (only in medium grid) */}
                {gridSize === 'medium' && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3">
                    <div className="text-white text-sm font-semibold truncate mb-1">
                      {champion.name}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {champion.roles.slice(0, 2).map((role) => (
                        <Badge key={role} variant="secondary" className="text-xs px-1 py-0">
                          {role}
                        </Badge>
                      ))}
                      {champion.roles.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{champion.roles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
