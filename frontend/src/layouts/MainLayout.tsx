import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton
} from '@mui/material'
import SvgIcon from '@mui/material/SvgIcon'

const drawerWidth = 240

const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <SvgIcon>
        <path d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-8h8V3h-8v10zm-10 6h8v-4H3v4z" />
      </SvgIcon>
    )
  },
  {
    label: 'Employees',
    path: '/employees',
    icon: (
      <SvgIcon>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C13 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C22 14.17 17.33 13 15 13z" />
      </SvgIcon>
    )
  },
  {
    label: 'Insights',
    path: '/insights',
    icon: (
      <SvgIcon>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5V12H7.5V10H11V7.5h2V10H16.5v2H13v4.5h-2z" />
      </SvgIcon>
    )
  }
]

function MainLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const effectiveWidth = collapsed ? 72 : drawerWidth

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1f4dd8 0%, #4d78ff 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 0
        }}
      >
        <Toolbar sx={{ minHeight: 72, px: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton size="large" onClick={() => setCollapsed((s) => !s)} sx={{ color: '#fff', borderRadius: 0 }}>
              {collapsed ? (
                <SvgIcon>
                  <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
                </SvgIcon>
              ) : (
                <SvgIcon>
                  <path d="M15.41 16.59 10.83 12 15.41 7.41 14 6l-6 6 6 6z" />
                </SvgIcon>
              )}
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
              HR Salary Management
            </Typography>
          </Box>

        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: effectiveWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: effectiveWidth,
            boxSizing: 'border-box',
            mt: 8,
            background: '#0f1c3b',
            color: '#f4f7ff',
            border: 'none',
            pt: 2,
            transition: 'width 220ms',
            borderRadius: 0
          }
        }}
      >
        <Toolbar sx={{ justifyContent: 'center', py: 3, px: 2 }}>
          {collapsed ? (
            <SvgIcon sx={{ color: '#fff', fontSize: 30 }}>
              <path d="M4 17h3v-7H4v7zm5 0h3V7H9v10zm5 0h3v-4h-3v4zm5 0h3v-9h-3v9z" />
            </SvgIcon>
          ) : (
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.4 }}>
              Team Analytics
            </Typography>
          )}
        </Toolbar>
        <List sx={{ px: 1 }}>
          {menuItems.map(item => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 0,
                mb: 0.5,
                px: collapsed ? 1.25 : 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#ffffff'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, color: '#fff' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ '& .MuiTypography-root': { fontWeight: 600 }, display: collapsed ? 'none' : 'block' }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 4 },
          mt: 8,
          backgroundColor: '#eef3ff',
          minHeight: '100vh'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout