import { usePageTitle } from '../usePageTitle'
import { Link, useParams } from 'react-router'
import { useMonitoring } from '../monitoring'
import { formatTime } from '../status'
import NotFoundPage from './NotFoundPage'

export default function SitePage() {
  const { sites, history } = useMonitoring()
  const { id } = useParams()
  const site = sites.find((item) => item.id === id)
  usePageTitle(site?.name ?? 'Сайта нет в списке')
  if (!site) return <NotFoundPage site />

  const rows = history.flatMap((run) => {
    const check = run.checks.find((item) => item.id === id)
    return check ? [{ time: run.time, check }] : []
  })
  const ok = rows.filter(({ check }) => check.ok).length

  return (
    <>
      <Link className="back" to="/">← Все сайты</Link>
      <h1>{site.name}</h1>
      <a className="url" href={site.url} target="_blank" rel="noreferrer">{site.url}</a>
      <h2>История проверок</h2>
      {rows.length ? <>
        <p>Успешных проверок: <strong>{ok} из {rows.length}</strong>.</p>
        <div className="table-wrap"><table>
          <thead><tr><th>Время, МСК</th><th>Состояние</th><th>HTTP</th><th>Время ответа</th></tr></thead>
          <tbody>{rows.map(({ time, check }) => (
            <tr key={time} className={check.ok ? '' : 'failure'}>
              <td><time dateTime={time}>{formatTime(time)}</time></td>
              <td>{check.ok ? 'Работает' : 'Не открывается'}{check.error && <small>{check.error}</small>}</td>
              <td>{check.status || '—'}</td><td>{check.ms} мс</td>
            </tr>
          ))}</tbody>
        </table></div>
      </> : <p>Для этого сайта пока нет результатов.</p>}
    </>
  )
}
