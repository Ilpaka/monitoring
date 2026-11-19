import { usePageTitle } from '../usePageTitle'
import { Link } from 'react-router'

export default function NotFoundPage({ site = false }: { site?: boolean }) {
  usePageTitle(site ? 'Сайта нет в списке' : 'Страница не найдена')
  return <><h1>{site ? 'Сайта нет в списке' : 'Страница не найдена'}</h1><Link to="/">Вернуться к сводке</Link></>
}
