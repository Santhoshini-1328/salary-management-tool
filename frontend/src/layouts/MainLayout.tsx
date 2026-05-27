import { Outlet, Link, useLocation } from 'react-router-dom'

import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material'

const drawerWidth = 240

const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard'
  },
  {
    label: 'Employees',
    path: '/employees'
  },
  {
    label: 'Insights',
    path: '/insights'
  }
]

function MainLayout() {
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1f4dd8 0%, #4d78ff 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.12)'
        }}
      >
        <Toolbar sx={{ minHeight: 72, px: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
            HR Salary Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: 8,
            background: '#0f1c3b',
            color: '#f4f7ff',
            border: 'none',
            pt: 2
          }
        }}
      >
        <Toolbar sx={{ justifyContent: 'center', py: 3, px: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.4 }}>
            Team Analytics
          </Typography>
        </Toolbar>
        <List sx={{ px: 1 }}>
          {menuItems.map(item => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#ffffff'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}
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