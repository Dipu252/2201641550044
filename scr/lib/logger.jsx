import React, { createContext, useContext, useMemo, useRef } from 'react'

const LoggerCtx = createContext(null)

export function LoggerProvider({ children }){
  const logsRef = useRef([])

  const api = useMemo(() => ({
    log: (event, payload = {}) => {
      const record = {
        ts: new Date().toISOString(),
        event,
        payload
      }
      // Console for developer inspection
      console.log('[LOG]', record)
      // Persist in-memory and to localStorage
      logsRef.current.push(record)
      try {
        const prev = JSON.parse(localStorage.getItem('am_logs') || '[]')
        prev.push(record)
        localStorage.setItem('am_logs', JSON.stringify(prev))
      } catch {}
    },
    getLogs: () => {
      try { return JSON.parse(localStorage.getItem('am_logs') || '[]') } catch { return [] }
    },
    clear: () => localStorage.removeItem('am_logs')
  }), [])

  return <LoggerCtx.Provider value={api}>{children}</LoggerCtx.Provider>
}

export function useLogger(){
  return useContext(LoggerCtx)
}
