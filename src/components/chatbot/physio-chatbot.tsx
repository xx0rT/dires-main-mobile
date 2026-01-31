import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RiSendPlane2Line, RiQuestionLine, RiRobotLine, RiCloseLine } from '@remixicon/react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockChatbotQA, type ChatMessage } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth-context'

interface ConversationMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  category?: string
  isTyping?: boolean
}

export function PhysioChatbot() {
  const { session } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showPresetQuestions, setShowPresetQuestions] = useState(true)
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '0',
      type: 'bot',
      content: 'Ahoj! Jsem váš AI asistent pro fyzioterapii. Můžete se mě zeptat na cokoliv ohledně fyzioterapie, rehabilitace a péče o pacienty.'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatCardRef = useRef<HTMLDivElement>(null)

  const filteredQuestions = mockChatbotQA

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatCardRef.current && !chatCardRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const simulateTyping = (content: string, category?: string) => {
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const botMessage: ConversationMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        category
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000 + Math.random() * 1000)
  }

  const handleQuestionClick = (qa: ChatMessage) => {
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: qa.question
    }

    setMessages(prev => [...prev, userMessage])
    simulateTyping(qa.answer, qa.category)
    setShowPresetQuestions(false)
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    const userQuestion = input
    setInput('')
    setIsTyping(true)

    try {
      const authToken = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      setIsTyping(false)
      const botMessage: ConversationMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: data.answer
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('AI Error:', error)
      setIsTyping(false)

      const matchedQA = mockChatbotQA.find(qa =>
        qa.question.toLowerCase().includes(userQuestion.toLowerCase()) ||
        userQuestion.toLowerCase().includes(qa.question.toLowerCase().split(' ').slice(0, 3).join(' '))
      )

      const responseContent = matchedQA
        ? matchedQA.answer
        : 'Omlouvám se, na tuto otázku momentálně nemám odpověď. Zkuste prosím přeformulovat dotaz nebo vyberte některou z připravených otázek níže.'

      const botMessage: ConversationMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: responseContent,
        category: matchedQA?.category
      }
      setMessages(prev => [...prev, botMessage])
    }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-2xl flex items-center justify-center hover:shadow-primary/50 transition-shadow"
          >
            <RiRobotLine className="h-7 w-7 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatCardRef}
            initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="border-2 border-primary/20 bg-background shadow-2xl">
              <CardHeader className="pb-3 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-br from-primary to-primary/80">
                      <RiRobotLine className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">AI Asistent</CardTitle>
                      <CardDescription className="text-xs">Fyzioterapie pomoc</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setIsOpen(false)}
                  >
                    <RiCloseLine className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <div className="relative" onWheel={(e) => e.stopPropagation()}>
                  <ScrollArea className="h-[250px] pr-2">
                    <div className="space-y-3">
                      <AnimatePresence>
                        {messages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 relative overflow-hidden ${
                                message.type === 'user'
                                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                                  : index === 0
                                    ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-background/50 border border-primary/20 rounded-bl-sm shadow-sm'
                                    : 'bg-muted rounded-bl-sm'
                              }`}
                            >
                              {message.type === 'bot' && index === 0 && (
                                <>
                                  <div
                                    className="absolute inset-0 opacity-30"
                                    style={{
                                      backgroundImage: `repeating-linear-gradient(
                                        45deg,
                                        transparent,
                                        transparent 10px,
                                        hsl(var(--primary) / 0.08) 10px,
                                        hsl(var(--primary) / 0.08) 20px
                                      )`
                                    }}
                                  />
                                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-full blur-3xl" />
                                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl" />
                                </>
                              )}
                              <p className="text-xs leading-relaxed relative z-10">{message.content}</p>
                              {message.category && (
                                <Badge variant="outline" className="mt-1.5 text-xs relative z-10">
                                  {message.category}
                                </Badge>
                              )}
                            </div>
                          </motion.div>
                        ))}
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-start"
                          >
                            <div className="max-w-[85%] rounded-2xl rounded-bl-sm px-3 py-2 bg-muted">
                              <div className="flex gap-1">
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-primary"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                />
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-primary"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                />
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-primary"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                <AnimatePresence>
                  {showPresetQuestions && filteredQuestions.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2 overflow-hidden border-t pt-3"
                    >
                      <p className="text-xs font-medium text-muted-foreground">Často kladené:</p>
                      <div className="space-y-1.5">
                        {filteredQuestions.slice(0, 3).map((qa) => (
                          <button
                            key={qa.id}
                            onClick={() => handleQuestionClick(qa)}
                            className="w-full text-left px-3 py-2 rounded-lg border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all text-xs group"
                          >
                            <div className="flex items-start gap-2">
                              <RiQuestionLine className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{qa.question}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2 border-t pt-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Napište dotaz..."
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!input.trim()}
                    className="flex-shrink-0"
                  >
                    <RiSendPlane2Line className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
