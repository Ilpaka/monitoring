import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MonitoringProvider from './MonitoringProvider'
import App from './App'
import { MemoryRouter } from 'react-router'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('MonitoringProvider', () => {
  it('сообщает, какой файл не загрузился', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 404 })))
    render(
      <MemoryRouter>
        <MonitoringProvider>
          <App />
        </MonitoringProvider>
      </MemoryRouter>,
    )
    const message = await screen.findByRole('alert')
    expect(message).toHaveTextContent('Файл sites.json не загрузился: HTTP 404.')
  })
})
