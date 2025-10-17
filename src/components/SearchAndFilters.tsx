import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchAndFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  roleFilter: string
  setRoleFilter: (role: string) => void
  completionFilter: string
  setCompletionFilter: (filter: string) => void
  gridSize: 'small' | 'medium'
  setGridSize: (size: 'small' | 'medium') => void
  onReset: () => void
}

export default function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  completionFilter,
  setCompletionFilter,
  gridSize,
  setGridSize,
  onReset
}: SearchAndFiltersProps) {
  const roles = ['Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support']

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">🔍</span>
        <Input
          type="text"
          placeholder="Search champions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-8"
          aria-label="Search champions"
        />
      </div>

      {/* Role Filter */}
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-[140px] h-8" aria-label="Filter by role">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roles.map(role => (
            <SelectItem key={role} value={role}>{role}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Completion Filter */}
      <Select value={completionFilter} onValueChange={setCompletionFilter}>
        <SelectTrigger className="w-[140px] h-8" aria-label="Filter by completion">
          <SelectValue placeholder="All Champions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Champions</SelectItem>
          <SelectItem value="won">Done</SelectItem>
          <SelectItem value="not-won">Not Done</SelectItem>
        </SelectContent>
      </Select>

      {/* Grid Size */}
      <div className="flex items-center gap-1">
        <div className="flex border border-input rounded-md overflow-hidden">
          <Button
            variant={gridSize === 'small' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setGridSize('small')}
            className="rounded-none h-8 px-2"
            aria-label="Icon only grid"
          >
            <span className="mr-1">⚏</span>
            Icons
          </Button>
          <Button
            variant={gridSize === 'medium' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setGridSize('medium')}
            className="rounded-none h-8 px-2"
            aria-label="Name and class grid"
          >
            <span className="mr-1">⚏</span>
            Names
          </Button>
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="destructive"
        size="sm"
        onClick={onReset}
        className="h-8"
        aria-label="Reset all wins"
      >
        Reset
      </Button>
    </div>
  )
}
