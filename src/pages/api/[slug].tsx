// pages/[slug].tsx

import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Chat from '../../components/Chat'

export interface Topic {
  slug: string
  label: string
  prompt: string
}

// On peut stocker/centraliser la config des thèmes dans un fichier séparé,
// ici on la met en dur pour l’exemple.
const topics: Topic[] = [
  { slug: 'foot',   label: 'Football', prompt: 'Tu es un expert en football…' },
  { slug: 'tennis', label: 'Tennis',   prompt: 'Tu es un commentateur de tennis…' },
  { slug: 'boxe',   label: 'Boxe',     prompt: 'Tu es un coach de boxe…' },
  { slug: 'basket', label: 'Basket',   prompt: 'Tu es un expert en basket…' },
  { slug: 'rugby',  label: 'Rugby',    prompt: 'Tu es un fan de rugby…' },
]

interface Props { topics: Topic[] }

export default function TopicPage({ topics }: Props) {
  const router = useRouter()
  if (router.isFallback) return <p>Chargement…</p>

  const { slug } = router.query as { slug: string }
  const topic = topics.find(t => t.slug === slug)
  if (!topic) return <p>Thème inconnu</p>

  return <Chat systemPrompt={topic.prompt} />
}

// 1) On génère les chemins /foot, /tennis, etc.
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: topics.map(t => ({ params: { slug: t.slug } })),
    fallback: false, // ou 'blocking' si vous voulez gérer dynamiquement
  }
}

// 2) On passe la liste complète des topics en props
export const getStaticProps: GetStaticProps<Props> = async () => {
  return { props: { topics } }
}