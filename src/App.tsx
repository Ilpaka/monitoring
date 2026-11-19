import { NavLink, Route, Routes } from 'react-router'
import { useMonitoring } from './monitoring'
import { formatTime } from './status'
import SitesPage from './pages/SitesPage'
import SitePage from './pages/SitePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

function Header() {
  const { history } = useMonitoring()
  return (
    <header>
      <div className="wrap top">
        <div className="brand"><span className="mark" aria-hidden="true">▥</span> Мониторинг сайтов</div>
        <nav aria-label="Основное меню">
          <NavLink end to="/">Сводка</NavLink>
          <NavLink to="/about">О проверке</NavLink>
        </nav>
      </div>
      {history[0] && <div className="stamp wrap">Последняя проверка <time dateTime={history[0].time}>{formatTime(history[0].time)} МСК</time></div>}
    </header>
  )
}

export default function App() {
  const { error, loading } = useMonitoring()
  return (
    <>
      <Header />
      <main className="wrap">
        {loading ? <p role="status">Загрузка результатов…</p> : error ? <p role="alert">{error}</p> : (
          <Routes>
            <Route path="/" element={<SitesPage />} />
            <Route path="/site/:id" element={<SitePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </main>
    </>
  )
}
