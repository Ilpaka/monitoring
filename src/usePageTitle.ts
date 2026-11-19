import { useEffect } from 'react'

export function usePageTitle(name: string) {
  useEffect(() => {
    document.title = `${name} · Мониторинг сайтов группы`
  }, [name])
}
