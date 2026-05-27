import { useEffect, useState } from 'react'

import {
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import { api } from '../api/api'

function EmployeesPage() {
  const [employees, setEmployees] = useState([])

  const fetchEmployees = async () => {
    const response = await api.get('/employees')

    setEmployees(response.data.data)
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const columns = [
    {
      field: 'fullName',
      headerName: 'Full Name',
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1
    },
    {
      field: 'country',
      headerName: 'Country',
      flex: 1
    },
    {
      field: 'jobTitle',
      headerName: 'Job Title',
      flex: 1
    },
    {
      field: 'salary',
      headerName: 'Salary',
      flex: 1
    }
  ]

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4">
          Employees
        </Typography>

        <Button variant="contained">
          Add Employee
        </Button>
      </Box>

      <Box mb={2}>
        <TextField
          label="Search employees"
          fullWidth
        />
      </Box>

      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={employees}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </div>
    </Box>
  )
}

export default EmployeesPage