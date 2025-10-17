import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface MilestoneModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MilestoneModal({ isOpen, onClose }: MilestoneModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-card-foreground mb-2">
              Arena God!
            </h2>
            <p className="text-muted-foreground">
              Congratulations! You've achieved 60 wins in the Arena!
            </p>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center">
          <Button onClick={onClose} className="px-6 py-2">
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
