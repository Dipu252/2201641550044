import * as React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Alert, Button, Stack, Typography } from '@mui/material'
import { findByCode, upsert } from '../lib/storage.js'
import { useLogger } from '../lib/logger.jsx'

export default function Redirect(){
  const { code } = useParams()
  const [state, setState] = React.useState({ status: 'checking' })
  const logger = useLogger()

  React.useEffect(() => {
    const item = findByCode(code)
    if (!item){
      setState({ status: 'notfound' })
      logger.log('REDIRECT_NOT_FOUND', { shortcode: code })
      return
    }
    const now = Date.now()
    const exp = Date.parse(item.expiresAt)
    if (isNaN(exp) || now > exp){
      setState({ status: 'expired', item })
      logger.log('REDIRECT_EXPIRED', { shortcode: code })
      return
    }

    const click = {
      ts: new Date().toISOString(),
      source: document.referrer || 'direct',
      geo: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
      userAgent: navigator.userAgent
    }
    item.clicks = item.clicks || []
    item.clicks.push(click)
    upsert(item)
    logger.log('CLICK', { shortcode: code, source: click.source, geo: click.geo })

    // Redirect
    window.location.replace(item.longUrl)
  }, [code])

  if (state.status === 'checking'){
    return <Typography>Checking link and redirecting...</Typography>
  }

  if (state.status === 'notfound'){
    return (
      <Stack spacing={2}>
        <Alert severity="error">Short link not found.</Alert>
        <Button component={Link} to="/">Create new</Button>
      </Stack>
    )
  }

  if (state.status === 'expired'){
    return (
      <Stack spacing={2}>
        <Alert severity="warning">This link has expired.</Alert>
        <Typography>Original URL: {state.item.longUrl}</Typography>
        <Button component={Link} to="/">Create new</Button>
      </Stack>
    )
  }

  return null
}
