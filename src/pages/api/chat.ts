// import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextApiRequest, } from 'next'

export const config = {
  runtime: 'edge', // pour utiliser Web Streams
}

export default async function handler(req: NextApiRequest) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  const { messages } = await new Response(req.body).json()
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      stream: true,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    return new Response(err, { status: res.status })
  }
  // Renvoie directement le flux au client
  return new Response(res.body, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}