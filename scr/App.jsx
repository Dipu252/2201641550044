import * as React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material'
import Shortener from './pages/Shortener.jsx'
import Stats from './pages/Stats.jsx'
import Redirect from './pages/Redirect.jsx'
import { LoggerProvider } from './lib/logger.jsx'

function NavButton({ to, label }){
  const location = useLocation()
  const selected = location.pathname === to
  return (
    <Button component={Link} to={to} color={selected ? 'inherit' : 'secondary'} variant={selected ? 'outlined' : 'text'} sx={{ ml: 1 }}>
      {label}
    </Button>
  )
}

export default function App(){
  return (
    <LoggerProvider>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Affordmed URL Shortener</Typography>
          <NavButton to="/" label="Create" />
          <NavButton to="/stats" label="Statistics" />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ my: 3 }}>
          <Routes>
            <Route path="/" element={<Shortener />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/s/:code" element={<Redirect />} />
          </Routes>
        </Box>
      </Container>
    </LoggerProvider>
  )
}
