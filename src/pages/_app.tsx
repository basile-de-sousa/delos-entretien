import Link from 'next/link'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

const topics = [
  { slug: 'foot', label: 'Foot', prompt: 'You are a football expert...' },
  { slug: 'tennis', label: 'Tennis', prompt: 'You are a tennis coach...' },
  { slug: 'boxe', label: 'Boxe', prompt: 'You are a boxe coach...' },
  { slug: 'surf', label: 'Surf', prompt: 'You are a surf trainer...' },
  { slug: 'basket', label: 'Basket', prompt: 'You are a tenbasketnis coach...' },
  // etc. 5 thèmes
]
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <nav>
        {topics.map(t => (
          <Link key={t.slug} href={`/${t.slug}`} style={{ margin: 8 }}>
            {t.label}
          </Link>
        ))}
      </nav>
      <Component {...pageProps} topics={topics} />
    </>
  )
}

export default MyApp