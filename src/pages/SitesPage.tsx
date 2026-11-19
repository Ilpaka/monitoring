import { usePageTitle } from '../usePageTitle'
import { Link } from 'react-router'
import { useMonitoring } from '../monitoring'
import { sitesWord } from '../plural'
import { statusText } from '../status'

export default function SitesPage() {
  usePageTitle('Сайты')
  const { sites, history } = useMonitoring()
  const last = history[0]
  const current = sites.map((site) => ({ site, check: last?.checks.find((c) => c.id === site.id) }))
  const failed = current.filter(({ check }) => check && !check.ok).length
  const unknown = current.filter(({ check }) => !check).length

  let summary = sites.length === 1 ? '1 сайт открывается' : `Все ${sites.length} ${sitesWord(sites.length)} открываются`
  if (!sites.length) summary = 'Список сайтов пуст'
  else if (!last) summary = 'Проверок ещё не было'
  else if (failed) summary = `Не открываются: ${failed} из ${sites.length}`
  else if (unknown) summary = `Проверены: ${sites.length - unknown} из ${sites.length}`

  return (
    <>
      <section className="summary">
        <h1>{summary}</h1>
        <p>Доступность учебных сайтов по последней ночной проверке.</p>
      </section>
      <h2>Сайты</h2>
      <ul className="sites">
        {current.map(({ site, check }) => (
          <li key={site.id}>
            <Link className="site" to={`/site/${site.id}`}>
              <h3>{site.name}</h3>
              <span className={'status ' + (!check ? 'unknown' : check.ok ? 'ok' : 'bad')}>{statusText(check)}</span>
              <span className="address">{new URL(site.url).hostname}</span>
              <span className="card-foot"><span>История →</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
