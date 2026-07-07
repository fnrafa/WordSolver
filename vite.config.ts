import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback
  }

  const normalized = value.trim().toLowerCase()

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false
  }

  return fallback
}

function parsePort(value: string | undefined, fallback: number): number {
  const parsed = Number(value)

  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed
  }

  return fallback
}

function parseAllowedHosts(value: string | undefined): string[] | true | undefined {
  if (!value) {
    return undefined
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === 'true') {
    return true
  }

  const hosts = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return hosts.length > 0 ? hosts : undefined
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = parsePort(env.APP_PORT, 5173)
  const exposeNetwork = parseBoolean(env.APP_NETWORK_EXPOSE, false)
  const host = exposeNetwork ? '0.0.0.0' : '127.0.0.1'
  const open = parseBoolean(env.APP_OPEN_BROWSER, false)
  const allowedHosts = parseAllowedHosts(env.APP_ALLOWED_HOSTS)
  const base = env.APP_BASE_PATH?.trim() || '/'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base,
    server: {
      host,
      port,
      strictPort: true,
      open,
      allowedHosts,
    },
    preview: {
      host,
      port,
      strictPort: true,
      allowedHosts,
    },
  }
})
