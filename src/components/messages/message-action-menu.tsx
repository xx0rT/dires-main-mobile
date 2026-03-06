import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reply, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hapticLight, hapticSelection } from '@/lib/haptics'
import type { MessageData } from './message-bubble'

const QUICK_EMOJIS = [
  { emoji: '\u2764\uFE0F', label: 'heart' },
  { emoji: '\uD83D\uDE02', label: 'laugh' },
  { emoji: '\uD83D\uDE2E', label: 'wow' },
  { emoji: '\uD83D\uDE22', label: 'cry' },
  { emoji: '\uD83D\uDE21', label: 'angry' },
  { emoji: '\uD83D\uDC4D', label: 'thumbs up' },
]

interface MessageActionMenuProps {
  message: MessageData | null
  bubbleRect: DOMRect | null
  isMe: boolean
  onClose: () => void
  onReact: (messageId: string, emoji: string) => void
  onReply: (message: MessageData) => void
  onDelete: (messageId: string) => void
}

export function MessageActionMenu({
  message, bubbleRect, isMe, onClose, onReact, onReply, onDelete,
}: MessageActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((e: MouseEvent | TouchEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (!message) return
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [message, handleClickOutside])

  useEffect(() => {
    if (!message) return
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [message, onClose])

  if (!message || !bubbleRect) return null

  const viewportH = window.innerHeight
  const spaceAbove = bubbleRect.top
  const spaceBelow = viewportH - bubbleRect.bottom
  const showAbove = spaceBelow < 200 && spaceAbove > 200

  const menuTop = showAbove
    ? Math.max(8, bubbleRect.top - 140)
    : Math.min(viewportH - 200, bubbleRect.bottom + 8)

  const menuLeft = isMe
    ? Math.max(16, bubbleRect.right - 280)
    : Math.min(window.innerWidth - 280 - 16, bubbleRect.left)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
      >
        <div ref={menuRef}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: showAbove ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="fixed"
            style={{ top: menuTop, left: menuLeft, maxWidth: 280 }}
          >
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-border/30 overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2.5 border-b border-border/20">
                {QUICK_EMOJIS.map(({ emoji, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      hapticLight()
                      onReact(message.id, emoji)
                      onClose()
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/60 active:scale-110 transition-all text-xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="py-1">
                <ActionButton
                  icon={<Reply className="h-4 w-4" />}
                  label="Odpovedet"
                  onClick={() => {
                    hapticSelection()
                    onReply(message)
                    onClose()
                  }}
                />
                {isMe && (
                  <ActionButton
                    icon={<Trash2 className="h-4 w-4" />}
                    label="Smazat"
                    destructive
                    onClick={() => {
                      hapticSelection()
                      onDelete(message.id)
                      onClose()
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function ActionButton({ icon, label, destructive, onClick }: {
  icon: React.ReactNode
  label: string
  destructive?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors',
        destructive
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'text-foreground hover:bg-muted/50',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
