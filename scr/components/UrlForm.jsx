import * as React from 'react'
import { TextField, Grid, IconButton, Paper, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function UrlFormRow({ index, value, onChange, onRemove }){
  const handleChange = (field) => (e) => {
    onChange(index, { ...value, [field]: e.target.value })
  }

  return (
    <Paper sx={{ p:2, mb:2 }} elevation={3}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={7}>
          <TextField fullWidth label="Original URL" placeholder="https://example.com/page" value={value.longUrl || ''} onChange={handleChange('longUrl')} />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField fullWidth label="Validity (mins)" placeholder="e.g., 30" value={value.validity || ''} onChange={handleChange('validity')} />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField fullWidth label="Custom shortcode (optional)" placeholder="alphanumeric" value={value.custom || ''} onChange={handleChange('custom')} />
        </Grid>
        <Grid item xs={12} md={1} sx={{ textAlign: 'right' }}>
          <Tooltip title="Remove row">
            <IconButton onClick={() => onRemove(index)} aria-label="remove-row">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  )
}
