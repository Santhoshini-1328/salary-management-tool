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

const drawerWidth = 220

const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard'
  },
  {
    label: 'Employees',
    path: '/employees'
  }
]

function MainLayout() {
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">
            HR Salary Management Dashboard
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
            mt: 8
          }
        }}
      >
        <List>
          {menuItems.map(item => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout