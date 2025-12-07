'use client'

import { Undo2 } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { useIPStore } from '@/store/useIPStore'
import { toast } from 'sonner'

interface TopBarProps {
  title: string
  showUndo?: boolean
}

export function TopBar({ title, showUndo = false }: TopBarProps) {
  const { undoLastSwipe, swipeHistory } = useIPStore()

  const handleUndo = () => {
    const undoneIP = undoLastSwipe()
    if (undoneIP) {
      toast('Undone', { description: 'Last swipe was undone' })
    } else {
      toast('Nothing to undo')
    }
  }

  return (
    <div className="sticky top-0 z-30 bg-secondary/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">{title}</h1>

        {showUndo && swipeHistory.length > 0 && (
          <IconButton variant="ghost" onClick={handleUndo}>
            <Undo2 size={20} />
          </IconButton>
        )}
      </div>
    </div>
  )
}
