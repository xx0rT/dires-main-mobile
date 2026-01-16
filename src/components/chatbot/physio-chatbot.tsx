import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { RiSendPlane2Line, RiQuestionLine, RiRobotLine, RiArrowUpSLine, RiArrowDownSLine } from '@remixicon/react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockChatbotQA, type ChatMessage } from '@/lib/mock-data'

interface ConversationMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  category?: string
  isTyping?: boolean
}

export function PhysioChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPresetQuestions, setShowPresetQuestions] = useState(true)
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '0',
      type: 'bot',
      content: 'Ahoj! Jsem váš AI asistent pro fyzioterapii. Můžete se mě zeptat na cokoliv ohledně fyzioterapie, rehabilitace a péče o pacienty. Napište vlastní dotaz nebo klikněte na některou z častých otázek níže.'
    }
  ])
  const [input, setInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('všechny')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const categories = ['všechny', 'páteř', 'sport', 'terapie', 'neurologie', 'obecné', 'akutní péče']

  const filteredQuestions = selectedCategory === 'všechny'
    ? mockChatbotQA
    : mockChatbotQA.filter(qa => qa.category === selectedCategory)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

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
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])

    const matchedQA = mockChatbotQA.find(qa =>
      qa.question.toLowerCase().includes(input.toLowerCase()) ||
      input.toLowerCase().includes(qa.question.toLowerCase().split(' ').slice(0, 3).join(' '))
    )

    const responseContent = matchedQA
      ? matchedQA.answer
      : 'Omlouvám se, na tuto otázku momentálně nemám odpověď. Zkuste prosím přeformulovat dotaz nebo vyberte některou z připravených otázek níže. Pokud potřebujete konkrétní pomoc, konzultujte s odborníkem.'

    simulateTyping(responseContent, matchedQA?.category)
    setInput('')
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <RiRobotLine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Asistent Fyzioterapeuta</CardTitle>
                <CardDescription>Zeptejte se na cokoliv ohledně fyzioterapie</CardDescription>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {isOpen ? (
                  <RiArrowUpSLine className="h-5 w-5" />
                ) : (
                  <RiArrowDownSLine className="h-5 w-5" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4">
        <div className="relative" onWheel={(e) => e.stopPropagation()}>
        <ScrollArea className="h-[200px] pr-4" ref={scrollRef}>
          <div className="space-y-3">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-2.5 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-xs leading-relaxed">{message.content}</p>
                    {message.category && (
                      <Badge variant="outline" className="mt-1.5 text-xs">
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
                  <div className="max-w-[85%] rounded-lg p-2.5 bg-muted">
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

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Napište vlastní otázku (např. 'Jak léčit bolest ramene?')..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon" disabled={!input.trim()}>
              <RiSendPlane2Line className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            💡 Tip: Ptejte se volně svými slovy - nemusíte používat připravené otázky
          </p>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => setShowPresetQuestions(!showPresetQuestions)}
            className="flex items-center gap-2 text-sm font-medium mb-3 hover:text-primary transition-colors"
          >
            <RiQuestionLine className="h-4 w-4" />
            <span>Často kladené otázky</span>
            {showPresetQuestions ? (
              <RiArrowUpSLine className="h-4 w-4 ml-auto" />
            ) : (
              <RiArrowDownSLine className="h-4 w-4 ml-auto" />
            )}
          </button>

          <AnimatePresence>
            {showPresetQuestions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  {filteredQuestions.slice(0, 5).map((qa) => (
                    <button
                      key={qa.id}
                      onClick={() => handleQuestionClick(qa)}
                      className="w-full text-left p-3 rounded-lg border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all hover:shadow-md group"
                    >
                      <div className="flex items-start gap-2">
                        <RiQuestionLine className="h-4 w-4 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">{qa.question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
