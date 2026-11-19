import { usePageTitle } from '../usePageTitle'
import { useMonitoring } from '../monitoring'

export default function AboutPage() {
  usePageTitle('О проверке')
  const { history } = useMonitoring()
  return (
    <section className="about">
      <h1>О проверке</h1>
      <h2>Что проверяется</h2>
      <p>В списке пять сайтов нашей группы. Это мониторы madagaskarvb и Desai0, LeBron James Ventures, ChromaSync и сайт футбольной секции «Высота».</p>
      <h2>Как читать результаты</h2>
      <p>Каждую ночь в 00:00 МСК GitHub Actions запрашивает каждый сайт. Ответ HTTP 200–299 после перехода по перенаправлениям считается успешным. На ответ отводится 15 секунд. Время измеряется с сервера GitHub до получения заголовков.</p>
      <p>История хранит до 30 последних запусков. Сейчас записано: {history.length}. Время в таблице указано по Москве. Расписание GitHub допускает задержку запуска.</p>
      <h2>Когда приходит уведомление</h2>
      <p>При подключённом Telegram бот сообщает о новом сбое или восстановлении сайта. Пока состояние остаётся прежним, повторных сообщений нет.</p>
      <a href="https://github.com/Ilpaka/monitoring/actions/workflows/check.yml">Журнал проверок на GitHub →</a>
    </section>
  )
}
