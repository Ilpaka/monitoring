import { useEffect, useState, type ReactNode } from 'react'
import { MonitoringContext } from './monitoring'
import type { Run, Site } from './types'

async function loadJson<T>(name: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}`, { signal, cache: 'no-cache' })
  if (!response.ok) throw new Error(`Файл ${name} не загрузился: HTTP ${response.status}.`)
  return response.json()
}

export default function MonitoringProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<Site[]>([])
  const [history, setHistory] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const [list, results] = await Promise.all([
          loadJson<Site[]>('sites.json', controller.signal),
          loadJson<{ history: Run[] }>('results.json', controller.signal),
        ])
        if (!controller.signal.aborted) {
          setSites(list)
          setHistory(results.history)
        }
      } catch (e) {
        if (!controller.signal.aborted) setError((e as Error).message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [])

  return (
    <MonitoringContext value={{ sites, history, loading, error }}>
      {children}
    </MonitoringContext>
  )
}
