import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { hapticHeavy } from '@/lib/haptics'

export interface MessageReaction {
  id: string
  message_id: string
  user_id: string
  emoji: string
  created_at: string
}

export interface MessageData {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
  reply_to_id?: string | null
}

interface MessageBubbleProps {
  message: MessageData
  isMe: boolean
  showAvatar: boolean
  isLast: boolean
  partnerName: string | null
  partnerEmail: string
  partnerAvatar: string | null
  reactions: MessageReaction[]
  replyMessage?: MessageData | null
  userId: string
  onLongPress: (message: MessageData, rect: DOMRect) => void
  onToggleReaction: (messageId: string, emoji: string) => void
}

function getInitials(name: string | null, email: string): string {
  if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  return email[0]?.toUpperCase() || 'U'
}

export function MessageBubble({
  message, isMe, showAvatar, isLast, partnerName, partnerEmail, partnerAvatar,
  reactions, replyMessage, userId, onLongPress, onToggleReaction,
}: MessageBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didTrigger = useRef(false)

  const startLongPress = useCallback(() => {
    didTrigger.current = false
    longPressTimer.current = setTimeout(() => {
      didTrigger.current = true
      hapticHeavy()
      if (bubbleRef.current) {
        onLongPress(message, bubbleRef.current.getBoundingClientRect())
      }
    }, 500)
  }, [message, onLongPress])

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const onTouchStart = useCallback((_e: React.TouchEvent) => {
    startLongPress()
  }, [startLongPress])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    cancelLongPress()
    if (didTrigger.current) {
      e.preventDefault()
    }
  }, [cancelLongPress])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) startLongPress()
  }, [startLongPress])

  const groupedReactions = reactions.reduce<Record<string, { count: number; userReacted: boolean }>>((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = { count: 0, userReacted: false }
    acc[r.emoji].count++
    if (r.user_id === userId) acc[r.emoji].userReacted = true
    return acc
  }, {})

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-end gap-2', isMe ? 'justify-end' : 'justify-start')}
    >
      {!isMe && (
        <div className="w-7 flex-shrink-0">
          {showAvatar && (
            <Avatar className="h-7 w-7">
              <AvatarImage src={partnerAvatar || undefined} />
              <AvatarFallback className="text-[10px] bg-neutral-200 dark:bg-neutral-700">
                {getInitials(partnerName, partnerEmail)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div className={cn('max-w-[75%]', isLast ? 'mb-1.5' : 'mb-0.5')}>
        <div
          ref={bubbleRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={cancelLongPress}
          onMouseDown={onMouseDown}
          onMouseUp={cancelLongPress}
          onMouseLeave={cancelLongPress}
          onContextMenu={(e) => {
            e.preventDefault()
            hapticHeavy()
            if (bubbleRef.current) {
              onLongPress(message, bubbleRef.current.getBoundingClientRect())
            }
          }}
          className={cn(
            'px-3.5 py-2 text-sm leading-relaxed select-none cursor-default',
            isMe
              ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
              : 'bg-muted/60 rounded-2xl rounded-bl-md',
          )}
        >
          {replyMessage && (
            <div className={cn(
              'mb-1.5 pb-1.5 border-b text-[11px] opacity-70 line-clamp-2',
              isMe ? 'border-primary-foreground/20' : 'border-border/40',
            )}>
              <span className="font-medium">
                {replyMessage.sender_id === userId ? 'Vy' : (partnerName || partnerEmail.split('@')[0])}
              </span>
              <p className="truncate mt-0.5">{replyMessage.content}</p>
            </div>
          )}
          {message.content}
          <span className={cn(
            'block text-[10px] mt-0.5',
            isMe ? 'text-primary-foreground/60' : 'text-muted-foreground/60',
          )}>
            {new Date(message.created_at).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {Object.keys(groupedReactions).length > 0 && (
          <div className={cn('flex flex-wrap gap-1 mt-1', isMe ? 'justify-end' : 'justify-start')}>
            {Object.entries(groupedReactions).map(([emoji, info]) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onToggleReaction(message.id, emoji)}
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs transition-all',
                  info.userReacted
                    ? 'bg-primary/15 border border-primary/30'
                    : 'bg-muted/80 border border-border/40',
                )}
              >
                <span className="text-sm">{emoji}</span>
                {info.count > 1 && <span className="text-[10px] text-muted-foreground">{info.count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
