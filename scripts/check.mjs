import { readFile, writeFile } from 'node:fs/promises'

const SITES = 'public/data/sites.json'
const RESULTS = 'public/data/results.json'

async function checkSites(sites) {
  const checks = []
  for (const site of sites) {
    const check = { id: site.id, ok: false, status: 0, ms: 0, error: '' }
    const start = Date.now()
    try {
      const response = await fetch(site.url, { signal: AbortSignal.timeout(15_000) })
      check.ms = Date.now() - start
      check.status = response.status
      check.ok = response.ok
      await response.body?.cancel()
    } catch (e) {
      check.ms = Date.now() - start
      check.error = e.message
    }
    console.log(`${check.ok ? 'OK' : 'FAIL'} ${check.status} · ${check.ms} мс · ${site.url}`)
    checks.push(check)
  }
  return checks
}

async function notifyChanges(sites, [last, previous]) {
  const changes = []
  for (const check of last?.checks ?? []) {
    const site = sites.find((item) => item.id === check.id)
    if (!site) continue
    const before = previous?.checks.find((item) => item.id === check.id)
    if (!check.ok && (!before || before.ok)) {
      changes.push(`🔴 Не открывается: ${site.name} · ${check.status || check.error}\n${site.url}`)
    } else if (check.ok && before && !before.ok) {
      changes.push(`🟢 Снова работает: ${site.name}\n${site.url}`)
    }
  }
  if (!changes.length) {
    console.log('Изменений нет, сообщение не отправлено')
    return
  }
  const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Секреты Telegram не заданы, сообщение не отправлено')
    return
  }
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `Ночная проверка сайтов\n\n${changes.join('\n\n')}` }),
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`Telegram вернул HTTP ${response.status}`)
  console.log('Сообщение об изменениях отправлено')
}

const sites = JSON.parse(await readFile(SITES, 'utf8'))
const { history } = JSON.parse(await readFile(RESULTS, 'utf8'))
if (process.argv.includes('--notify')) {
  await notifyChanges(sites, history)
} else {
  const checks = await checkSites(sites)
  const run = { time: new Date().toISOString(), checks }
  await writeFile(RESULTS, JSON.stringify({ history: [run, ...history].slice(0, 30) }, null, 2) + '\n')
}
