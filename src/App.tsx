import { useState, useEffect } from 'react'
import './App.css'
import ChampionGrid from './components/ChampionGrid'
import ProgressCards from './components/ProgressCards'
import SearchAndFilters from './components/SearchAndFilters'
import MilestoneModal from './components/MilestoneModal'

interface Champion {
  id: string
  name: string
  roles: string[]
  key: string
}

interface RiotChampion {
  id: string
  name: string
  tags: string[]
  key: string
}

interface WinData {
  [championId: string]: boolean
}

function App() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [wins, setWins] = useState<WinData>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [completionFilter, setCompletionFilter] = useState('all')
  const [gridSize, setGridSize] = useState<'small' | 'medium'>('small')
  const [showMilestone, setShowMilestone] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentVersion, setCurrentVersion] = useState('14.21.1')
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false)

  // Load champions from Riot Data Dragon
  useEffect(() => {
    loadChampions()
  }, [])

  // Load wins from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('arenaWinsByChampion')
    console.log('Loading from localStorage:', stored)
    if (stored) {
      const parsedWins = JSON.parse(stored)
      console.log('Parsed wins:', parsedWins)
      setWins(parsedWins)
    }
    setHasLoadedFromStorage(true)
  }, [])

  // Save wins to localStorage when they change (but not on initial load)
  useEffect(() => {
    // Only save after we've loaded from storage to avoid overwriting on initial load
    if (hasLoadedFromStorage) {
      console.log('Saving to localStorage:', wins)
      localStorage.setItem('arenaWinsByChampion', JSON.stringify(wins))
    }
  }, [wins, hasLoadedFromStorage])

  // Check for milestone achievement (Arena God = 60 wins)
  useEffect(() => {
    const wonChampions = Object.values(wins).filter(Boolean).length
    
    if (wonChampions >= 60 && !showMilestone) {
      setShowMilestone(true)
    }
  }, [wins, showMilestone])

  const loadChampions = async () => {
    try {
      setLoading(true)
      
      // Load latest version
      const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      const versions = await versionRes.json()
      const version = versions[0]
      setCurrentVersion(version)
      
      // Load champions
      const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      
      const data = await res.json() as { data: Record<string, RiotChampion> }
      const championsList = Object.values(data.data).map((champ: RiotChampion) => ({
        id: champ.id,
        name: champ.name,
        roles: champ.tags,
        key: champ.key
      }))
      
      setChampions(championsList)
    } catch (err) {
      console.error('Failed to load champions:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleWin = (championId: string) => {
    setWins(prev => ({
      ...prev,
      [championId]: !prev[championId]
    }))
  }

  const resetWins = () => {
    setWins({})
  }

  const filteredChampions = champions.filter(champion => {
    const matchesSearch = champion.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || champion.roles.includes(roleFilter)
    const matchesCompletion = completionFilter === 'all' || 
      (completionFilter === 'won' && wins[champion.id]) ||
      (completionFilter === 'not-won' && !wins[champion.id])
    
    return matchesSearch && matchesRole && matchesCompletion
  })

  const totalChampions = champions.length
  const wonChampions = Object.values(wins).filter(Boolean).length
  const arenaGodProgress = Math.min((wonChampions / 60) * 100, 100)

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Loading Champions</h2>
            <p className="text-muted-foreground">Fetching the latest champion data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                LoL Arena Tracker
              </h1>
            </div>
            
            {/* Center: Search and Filters */}
            <div className="flex-1 max-w-4xl">
              <SearchAndFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                completionFilter={completionFilter}
                setCompletionFilter={setCompletionFilter}
                gridSize={gridSize}
                setGridSize={setGridSize}
                onReset={resetWins}
              />
            </div>
            
            {/* Right: Progress Summary */}
            <div className="flex-shrink-0 text-right">
              <div className="text-sm font-semibold text-primary">
                {wonChampions}/{totalChampions}
              </div>
              <div className="text-xs text-muted-foreground">
                {arenaGodProgress.toFixed(1)}% Arena God
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 my-6">
        <ProgressCards
          totalChampions={totalChampions}
          wonChampions={wonChampions}
          arenaGodProgress={arenaGodProgress}
          gridSize={gridSize}
        />
        <ChampionGrid
          champions={filteredChampions}
          wins={wins}
          onToggleWin={toggleWin}
          gridSize={gridSize}
          currentVersion={currentVersion}
        />
      </main>

      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p>Built with React, TypeScript, and Tailwind CSS</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a 
                href="https://developer.riotgames.com/docs/lol#data-dragon" 
                target="_blank" 
                rel="noreferrer noopener"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <span>Data from</span>
                <span className="font-medium">Riot Data Dragon</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <MilestoneModal
        isOpen={showMilestone}
        onClose={() => setShowMilestone(false)}
      />
    </div>
  )
}

export default App
