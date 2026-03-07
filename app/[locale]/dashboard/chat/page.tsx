'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const MODE_LABELS: Record<string, string> = {
  safe_space: '🌊 Safe Space',
  coach: '🧭 Coach',
  checkin: '✨ Check-in',
}

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = params.locale as string
  const forcedMode = searchParams.get('mode')

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [detectedMode, setDetectedMode] = useState<string | null>(forcedMode)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Create session on mount
  useEffect(() => {
    async function createSession() {
      const mode = forcedMode || 'checkin'
      const res = await fetch('/api/zerova/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      })
      const data = await res.json()
      if (data.session) setSessionId(data.session.id)
    }
    createSession()
  }, [forcedMode])

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, newUserMsg])

    try {
      const res = await fetch('/api/zerova/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          sessionId,
          conversationHistory: messages,
          forcedMode,
        }),
      })

      const data = await res.json()

      if (data.error === 'TRIAL_EXPIRED') {
        router.push(`/${locale}/subscribe`)
        return
      }

      if (data.response) {
        if (data.mode && !detectedMode) setDetectedMode(data.mode)

        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, assistantMsg])
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between flex-shrink-0">
        <Link href={`/${locale}/dashboard`} className="text-slate-400 hover:text-slate-600 text-sm">
          ← Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Zerova</span>
          {detectedMode && (
            <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
              {MODE_LABELS[detectedMode] || detectedMode}
            </span>
          )}
        </div>
        <div className="w-16" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-2xl mb-2">💬</p>
            <p className="text-sm">Just start talking — Zerova is listening</p>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-sm'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm shadow-sm'
              }`}
            >
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-100 px-4 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            rows={1}
            className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none max-h-32"
            style={{ minHeight: '48px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-teal-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-teal-700 transition disabled:opacity-40 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-slate-300 mt-2">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
