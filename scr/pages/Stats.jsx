import * as React from 'react'
import { loadAll } from '../lib/storage.js'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

function pretty(dt){
  return new Date(dt).toLocaleString()
}

export default function Stats(){
  const [items, setItems] = React.useState(loadAll())

  React.useEffect(() => {
    const onStorage = () => setItems(loadAll())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Short Links Statistics</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Original URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.shortcode}>
                <TableCell>{window.location.origin}/s/{item.shortcode}</TableCell>
                <TableCell>{pretty(item.createdAt)}</TableCell>
                <TableCell>{pretty(item.expiresAt)}</TableCell>
                <TableCell><Chip label={item.clicks?.length || 0} /></TableCell>
                <TableCell>{item.longUrl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {items.map(item => (
        <Accordion key={item.shortcode}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Details for /s/{item.shortcode}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">Created: {pretty(item.createdAt)} | Expires: {pretty(item.expiresAt)}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}><strong>Click log:</strong></Typography>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Geo (coarse)</TableCell>
                    <TableCell>User Agent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(item.clicks || []).map((c, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{pretty(c.ts)}</TableCell>
                      <TableCell>{c.source}</TableCell>
                      <TableCell>{c.geo}</TableCell>
                      <TableCell>{c.userAgent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  )
}
