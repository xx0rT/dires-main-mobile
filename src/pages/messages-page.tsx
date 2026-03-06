import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Users2, GraduationCap, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { usePresence } from '@/lib/presence-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { MessageBubble, type MessageData, type MessageReaction } from '@/components/messages/message-bubble'
import { MessageActionMenu } from '@/components/messages/message-action-menu'
import { hapticLight } from '@/lib/haptics'

interface ConversationPartner {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string
  trainer_role: string | null
  is_trainer: boolean | null
  last_seen_at: string | null
}

interface Conversation {
  id: string
  user_id: string
  trainer_id: string
  last_message_at: string
  partner: ConversationPartner
  lastMessage?: string
  unreadCount: number
}

function getInitials(name: string | null, email: string): string {
  if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  return email[0]?.toUpperCase() || 'U'
}

function showBrowserNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
    new Notification(title, { body, icon: '/logo.png' })
  }
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<MessageData[]>([])
  const [reactions, setReactions] = useState<MessageReaction[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [replyTo, setReplyTo] = useState<MessageData | null>(null)
  const [actionMenuMessage, setActionMenuMessage] = useState<MessageData | null>(null)
  const [actionMenuRect, setActionMenuRect] = useState<DOMRect | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const activeConversationRef = useRef<Conversation | null>(null)
  activeConversationRef.current = activeConversation

  const trainerId = searchParams.get('trainer')

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const fetchConversations = useCallback(async () => {
    if (!user) return

    const { data: convos } = await supabase
      .from('chat_conversations')
      .select('*')
      .or(`user_id.eq.${user.id},trainer_id.eq.${user.id}`)
      .order('last_message_at', { ascending: false })

    if (!convos?.length) {
      setConversations([])
      setLoading(false)
      return
    }

    const partnerIds = [...new Set(convos.map(c => {
      if (c.user_id === c.trainer_id) return c.user_id
      return c.user_id === user.id ? c.trainer_id : c.user_id
    }))]

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email, trainer_role, is_trainer, last_seen_at')
      .in('id', partnerIds)

    const profileMap = new Map((profiles ?? []).map(p => [p.id, p]))

    const { data: lastMessages } = await supabase
      .from('chat_messages')
      .select('conversation_id, content, read, sender_id')
      .in('conversation_id', convos.map(c => c.id))
      .order('created_at', { ascending: false })

    const lastMsgMap = new Map<string, { content: string; unread: number }>()
    for (const msg of lastMessages ?? []) {
      if (!lastMsgMap.has(msg.conversation_id)) {
        lastMsgMap.set(msg.conversation_id, { content: msg.content, unread: 0 })
      }
      if (!msg.read && msg.sender_id !== user.id) {
        const entry = lastMsgMap.get(msg.conversation_id)!
        entry.unread++
      }
    }

    const mapped: Conversation[] = convos.map(c => {
      const partnerId = c.user_id === c.trainer_id
        ? c.user_id
        : (c.user_id === user.id ? c.trainer_id : c.user_id)
      const partner = profileMap.get(partnerId) || {
        id: partnerId, full_name: null, avatar_url: null, email: '',
        trainer_role: null, is_trainer: null, last_seen_at: null,
      }
      const msgInfo = lastMsgMap.get(c.id)
      return {
        ...c,
        partner,
        lastMessage: msgInfo?.content,
        unreadCount: msgInfo?.unread ?? 0,
      }
    })

    setConversations(mapped)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    if (trainerId && user && !loading) {
      openOrCreateConversation(trainerId)
    }
  }, [trainerId, user, loading])

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('chat-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
      }, (payload) => {
        const msg = payload.new as MessageData
        if (msg.sender_id === user.id) return

        const active = activeConversationRef.current
        if (active && msg.conversation_id === active.id) {
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev
            return [...prev, msg]
          })
          supabase.from('chat_messages').update({ read: true }).eq('id', msg.id)
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
        }

        fetchConversations()

        if (document.hidden) {
          showBrowserNotification('Nova zprava', msg.content)
        } else if (!active || msg.conversation_id !== active.id) {
          toast('Nova zprava', { description: msg.content })
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'message_reactions',
      }, (payload) => {
        const active = activeConversationRef.current
        if (!active) return
        if (payload.eventType === 'INSERT') {
          const r = payload.new as MessageReaction
          setReactions(prev => {
            if (prev.some(x => x.id === r.id)) return prev
            return [...prev, r]
          })
        } else if (payload.eventType === 'DELETE') {
          const r = payload.old as { id: string }
          setReactions(prev => prev.filter(x => x.id !== r.id))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, fetchConversations])

  const openOrCreateConversation = async (tId: string) => {
    if (tId === user!.id) {
      toast.error('Nemuzete poslat zpravu sami sobe')
      setSearchParams({})
      return
    }

    const existing = conversations.find(
      c => (c.user_id === user!.id && c.trainer_id === tId) ||
           (c.trainer_id === user!.id && c.user_id === tId) ||
           (c.user_id === tId && c.trainer_id === tId)
    )

    if (existing) {
      setActiveConversation(existing)
      loadMessages(existing.id)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email, trainer_role, is_trainer, last_seen_at')
      .eq('id', tId)
      .maybeSingle()

    if (!profile) return

    const { data: convo } = await supabase
      .from('chat_conversations')
      .insert({ user_id: user!.id, trainer_id: tId })
      .select()
      .maybeSingle()

    if (convo) {
      const newConvo: Conversation = {
        ...convo,
        partner: profile,
        unreadCount: 0,
      }
      setConversations(prev => [newConvo, ...prev])
      setActiveConversation(newConvo)
      setMessages([])
      setReactions([])
    }
  }

  const loadMessages = async (conversationId: string) => {
    const [{ data: msgData }, { data: reactData }] = await Promise.all([
      supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true }),
      supabase
        .from('message_reactions')
        .select('*')
        .in('message_id', (
          await supabase
            .from('chat_messages')
            .select('id')
            .eq('conversation_id', conversationId)
        ).data?.map(m => m.id) ?? []),
    ])

    setMessages(msgData ?? [])
    setReactions(reactData ?? [])

    if (user) {
      await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('read', false)
    }

    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !user || sending) return

    setSending(true)
    hapticLight()
    const content = newMessage.trim()
    const replyToId = replyTo?.id ?? null
    setNewMessage('')
    setReplyTo(null)

    const optimistic: MessageData = {
      id: crypto.randomUUID(),
      conversation_id: activeConversation.id,
      sender_id: user.id,
      content,
      read: false,
      created_at: new Date().toISOString(),
      reply_to_id: replyToId,
    }
    setMessages(prev => [...prev, optimistic])
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    const insertPayload: Record<string, unknown> = {
      conversation_id: activeConversation.id,
      sender_id: user.id,
      content,
    }
    if (replyToId) insertPayload.reply_to_id = replyToId

    const { error } = await supabase
      .from('chat_messages')
      .insert(insertPayload)

    if (!error) {
      await supabase
        .from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', activeConversation.id)
    }

    setSending(false)
    inputRef.current?.focus()
  }

  const handleToggleReaction = async (messageId: string, emoji: string) => {
    if (!user) return
    hapticLight()

    const existing = reactions.find(
      r => r.message_id === messageId && r.user_id === user.id && r.emoji === emoji
    )

    if (existing) {
      setReactions(prev => prev.filter(r => r.id !== existing.id))
      await supabase.from('message_reactions').delete().eq('id', existing.id)
    } else {
      const optimistic: MessageReaction = {
        id: crypto.randomUUID(),
        message_id: messageId,
        user_id: user.id,
        emoji,
        created_at: new Date().toISOString(),
      }
      setReactions(prev => [...prev, optimistic])
      await supabase.from('message_reactions').insert({
        message_id: messageId,
        user_id: user.id,
        emoji,
      })
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return
    setMessages(prev => prev.filter(m => m.id !== messageId))
    setReactions(prev => prev.filter(r => r.message_id !== messageId))
    await supabase.from('chat_messages').delete().eq('id', messageId).eq('sender_id', user.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const goBack = () => {
    setActiveConversation(null)
    setMessages([])
    setReactions([])
    setReplyTo(null)
    setSearchParams({})
    fetchConversations()
  }

  if (activeConversation) {
    return (
      <>
        <ChatView
          conversation={activeConversation}
          messages={messages}
          reactions={reactions}
          newMessage={newMessage}
          sending={sending}
          userId={user?.id ?? ''}
          replyTo={replyTo}
          inputRef={inputRef}
          messagesEndRef={messagesEndRef}
          onBack={goBack}
          onChangeMessage={setNewMessage}
          onSend={sendMessage}
          onKeyDown={handleKeyDown}
          onLongPress={(msg, rect) => {
            setActionMenuMessage(msg)
            setActionMenuRect(rect)
          }}
          onToggleReaction={handleToggleReaction}
          onClearReply={() => setReplyTo(null)}
        />
        <MessageActionMenu
          message={actionMenuMessage}
          bubbleRect={actionMenuRect}
          isMe={actionMenuMessage?.sender_id === user?.id}
          onClose={() => { setActionMenuMessage(null); setActionMenuRect(null) }}
          onReact={handleToggleReaction}
          onReply={(msg) => {
            setReplyTo(msg)
            inputRef.current?.focus()
          }}
          onDelete={handleDeleteMessage}
        />
      </>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold">Zpravy</h1>
        <p className="text-muted-foreground mt-1">Vase konverzace s trenery</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : conversations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Users2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-1">Zatim zadne zpravy</h2>
          <p className="text-sm text-muted-foreground mb-4">Zacnete konverzaci s trenerem</p>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/prehled/treneri">Najit trenera</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-1">
          {conversations.map((convo, i) => (
            <ConversationItem
              key={convo.id}
              conversation={convo}
              index={i}
              onClick={() => {
                setActiveConversation(convo)
                loadMessages(convo.id)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TrainerBadge({ className }: { className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300',
      className,
    )}>
      <GraduationCap className="h-2.5 w-2.5" />
      Trener
    </span>
  )
}

function ConversationItem({ conversation, index, onClick }: {
  conversation: Conversation
  index: number
  onClick: () => void
}) {
  const { isUserOnline } = usePresence()
  const { partner } = conversation
  const online = isUserOnline(partner.id)

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-muted/40 active:bg-muted/60 transition-colors text-left"
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={partner.avatar_url || undefined} />
          <AvatarFallback className="text-sm bg-neutral-200 dark:bg-neutral-700">
            {getInitials(partner.full_name, partner.email)}
          </AvatarFallback>
        </Avatar>
        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${online ? 'bg-green-500' : 'bg-neutral-400'}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {partner.full_name || partner.email.split('@')[0]}
            </h3>
            {partner.is_trainer && <TrainerBadge />}
          </div>
          <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
            {formatTime(conversation.last_message_at)}
          </span>
        </div>
        {conversation.lastMessage && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {conversation.lastMessage}
          </p>
        )}
      </div>

      {conversation.unreadCount > 0 && (
        <span className="flex-shrink-0 h-5 min-w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5">
          {conversation.unreadCount}
        </span>
      )}
    </motion.button>
  )
}

function ChatView({
  conversation, messages, reactions, newMessage, sending, userId, replyTo, inputRef, messagesEndRef,
  onBack, onChangeMessage, onSend, onKeyDown, onLongPress, onToggleReaction, onClearReply,
}: {
  conversation: Conversation
  messages: MessageData[]
  reactions: MessageReaction[]
  newMessage: string
  sending: boolean
  userId: string
  replyTo: MessageData | null
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  onBack: () => void
  onChangeMessage: (v: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onLongPress: (message: MessageData, rect: DOMRect) => void
  onToggleReaction: (messageId: string, emoji: string) => void
  onClearReply: () => void
}) {
  const { isUserOnline } = usePresence()
  const { partner } = conversation
  const online = isUserOnline(partner.id)

  const messagesMap = new Map(messages.map(m => [m.id, m]))

  return (
    <div
      className="fixed inset-x-0 top-0 z-30 flex flex-col bg-background md:static md:z-auto md:-mb-6 md:rounded-2xl md:border md:border-border/40 md:bg-muted/10 md:h-[calc(100vh-10rem)]"
      style={{ bottom: 'calc(3.25rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div
        className="z-20 flex items-center gap-3 px-4 pb-3 border-b border-border/40 bg-background"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
      >
        <button type="button" onClick={onBack} className="p-1 -ml-1 rounded-lg hover:bg-muted/60 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="relative">
          <Avatar className="h-9 w-9">
            <AvatarImage src={partner.avatar_url || undefined} />
            <AvatarFallback className="text-xs bg-neutral-200 dark:bg-neutral-700">
              {getInitials(partner.full_name, partner.email)}
            </AvatarFallback>
          </Avatar>
          <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background ${online ? 'bg-green-500' : 'bg-neutral-400'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-sm truncate">
              {partner.full_name || partner.email.split('@')[0]}
            </h3>
            {partner.is_trainer && <TrainerBadge />}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {online ? 'Online' : 'Offline'}
          </p>
        </div>

        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link to={`/prehled/treneri/${partner.id}`}>Profil</Link>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" style={{ WebkitOverflowScrolling: 'touch' }}>
        {messages.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Zacnete konverzaci
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.sender_id === userId
            const showAvatar = !isMe && (i === 0 || messages[i - 1]?.sender_id !== msg.sender_id)
            const isLast = i === messages.length - 1 || messages[i + 1]?.sender_id !== msg.sender_id
            const msgReactions = reactions.filter(r => r.message_id === msg.id)
            const replyMsg = msg.reply_to_id ? messagesMap.get(msg.reply_to_id) ?? null : null

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMe={isMe}
                showAvatar={showAvatar}
                isLast={isLast}
                partnerName={partner.full_name}
                partnerEmail={partner.email}
                partnerAvatar={partner.avatar_url}
                reactions={msgReactions}
                replyMessage={replyMsg}
                userId={userId}
                onLongPress={onLongPress}
                onToggleReaction={onToggleReaction}
              />
            )
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border/40 bg-background">
        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border/20 bg-muted/20">
                <div className="w-0.5 h-8 rounded-full bg-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-primary">
                    {replyTo.sender_id === userId ? 'Vy' : (partner.full_name || partner.email.split('@')[0])}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{replyTo.content}</p>
                </div>
                <button type="button" onClick={onClearReply} className="p-1 rounded-full hover:bg-muted/60 transition-colors">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 px-3 py-2 pb-1">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => onChangeMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Napiste zpravu..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border/40 bg-muted/30 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-24"
            style={{ fontSize: '16px' }}
          />
          <Button
            onClick={onSend}
            disabled={!newMessage.trim() || sending}
            size="icon"
            className="h-10 w-10 rounded-xl flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Vcera'
  if (diffDays < 7) return date.toLocaleDateString('cs-CZ', { weekday: 'short' })
  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })
}
