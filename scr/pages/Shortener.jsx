import * as React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Alert, Button, Stack, Typography } from '@mui/material'
import UrlFormRow from '../components/UrlForm.jsx'
import { randomCode, isValidCustom } from '../lib/shortcode.js'
import { loadAll, upsert } from '../lib/storage.js'
import { useLogger } from '../lib/logger.jsx'

function isValidUrl(u){
  try { const _ = new URL(u); return /^https?:/.test(_.protocol) } catch { return false }
}

export default function Shortener(){
  const [rows, setRows] = React.useState([{},{},{}])
  const [errors, setErrors] = React.useState([])
  const [created, setCreated] = React.useState([])
  const navigate = useNavigate()
  const logger = useLogger()

  const addRow = () => setRows(r => r.length >= 5 ? r : [...r, {}])
  const removeRow = (i) => setRows(r => r.filter((_, idx) => idx !== i))
  const updateRow = (i, v) => setRows(r => r.map((row, idx) => idx === i ? v : row))

  const validate = () => {
    const errs = []
    const existingCodes = new Set(loadAll().map(x => x.shortcode))
    rows.forEach((r, idx) => {
      if (!r.longUrl && !r.custom && !r.validity) return // empty row is fine
      if (!isValidUrl(r.longUrl)) errs.push(`Row ${idx+1}: Enter a valid http(s) URL.`)
      if (r.validity && !/^[0-9]+$/.test(String(r.validity))) errs.push(`Row ${idx+1}: Validity must be an integer (minutes).`)
      if (r.custom){
        if (!isValidCustom(r.custom)) errs.push(`Row ${idx+1}: Custom shortcode must be 3-15 alphanumeric.`)
        if (existingCodes.has(r.custom)) errs.push(`Row ${idx+1}: Shortcode '${r.custom}' already exists.`)
      }
    })
    setErrors(errs)
    return errs.length === 0
  }

  const handleCreate = () => {
    if (!validate()) return
    const now = Date.now()
    const existingCodes = new Set(loadAll().map(x => x.shortcode))
    const made = []

    rows.forEach((r) => {
      if (!r.longUrl) return
      let code = r.custom && isValidCustom(r.custom) ? r.custom : null
      if (!code){
        do { code = randomCode(6) } while (existingCodes.has(code))
      }
      existingCodes.add(code)
      const mins = r.validity ? parseInt(r.validity, 10) : 30
      const item = {
        id: crypto.randomUUID(),
        longUrl: r.longUrl,
        shortcode: code,
        createdAt: new Date(now).toISOString(),
        expiresAt: new Date(now + mins*60000).toISOString(),
        validityMinutes: mins,
        custom: Boolean(r.custom),
        clicks: []
      }
      upsert(item)
      made.push(item)
      logger.log('CREATE_URL', { shortcode: code, longUrl: r.longUrl, mins })
    })

    setCreated(made)
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Create Short Links</Typography>
      <Typography variant="body2" color="text.secondary">
        You can add up to 5 URLs at once. Default validity is 30 minutes if not specified.
      </Typography>

      {rows.map((row, i) => (
        <UrlFormRow key={i} index={i} value={row} onChange={updateRow} onRemove={removeRow} />
      ))}
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={addRow} disabled={rows.length >= 5}>Add another</Button>
        <Button variant="contained" onClick={handleCreate}>Shorten</Button>
        <Button component={Link} to="/stats">View Statistics</Button>
      </Stack>

      {errors.map((e, i) => <Alert key={i} severity="error">{e}</Alert>)}

      {created.length > 0 && (
        <Stack spacing={1}>
          <Alert severity="success">
            Created {created.length} link{created.length>1?'s':''}. Open them to test redirection.
          </Alert>
          {created.map(c => (
            <Alert key={c.shortcode} severity="info">
              <strong>{window.location.origin}/s/{c.shortcode}</strong><br />
              Creation: {new Date(c.createdAt).toLocaleString()} | Expiry: {new Date(c.expiresAt).toLocaleString()}
            </Alert>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
