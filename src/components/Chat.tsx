import { useState, useRef } from 'react'

interface Message { role: 'user'|'assistant'|'system'; content: string }

export default function Chat({ systemPrompt }: { systemPrompt: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  const send = async () => {
    if (!input) return
    const userMsg = { role: 'user' as const, content: input }
    const allMsgs = [{ role: 'system' as const, content: systemPrompt }, ...messages, userMsg]
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: allMsgs }),
    })
    if (!res.ok) {
      console.error(await res.text())
      setLoading(false)
      return
    }
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let assistantMsg = ''
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      assistantMsg += decoder.decode(value)
      // on met à jour progressivement
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === 'assistant') {
          // remplace le dernier
          return [...prev.slice(0, -1), { role: 'assistant', content: assistantMsg }]
        } else {
          return [...prev, { role: 'assistant', content: assistantMsg }]
        }
      })
      // scroll bottom
      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
    }
    setLoading(false)
  }

  return (
    <div>
      <div ref={chatRef} style={{ height: 400, overflow: 'auto', border: '1px solid #ccc', padding: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
        {loading && <div><em>...</em></div>}
      </div>
      <div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          disabled={loading}
          style={{ width: '80%' }}
        />
        <button onClick={send} disabled={loading}>Envoyer</button>
      </div>
    </div>
  )
}