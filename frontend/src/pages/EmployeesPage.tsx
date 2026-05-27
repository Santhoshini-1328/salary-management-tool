import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../api/api'

type Employee = {
  id: string
  fullName: string
  email: string
  country: string
  jobTitle: string
  department: string
  salary: number
}

type EmployeeFormValues = Omit<Employee, 'id'>

const defaultEmployeeData: EmployeeFormValues = {
  fullName: '',
  email: '',
  country: '',
  jobTitle: '',
  department: '',
  salary: 0
}

function EmployeeDialog({
  open,
  mode,
  employee,
  onClose,
  onSubmit
}: {
  open: boolean
  mode: 'create' | 'edit' | 'view'
  employee: EmployeeFormValues
  onClose: () => void
  onSubmit: (values: EmployeeFormValues) => Promise<void>
}) {
  const [values, setValues] = useState<EmployeeFormValues>(employee)
  const [error, setError] = useState('')

  useEffect(() => {
    setValues(employee)
    setError('')
  }, [employee, open])

  const handleChange = (field: keyof EmployeeFormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: field === 'salary' ? Number(value) : value
    }))
  }

  const handleSubmit = async () => {
    if (!values.fullName || !values.email || !values.country || !values.jobTitle || !values.department || values.salary <= 0) {
      setError('Please complete all fields and use a positive salary.')
      return
    }

    try {
      await onSubmit(values)
      onClose()
    } catch (submitError) {
      setError('Unable to save employee. Please try again.')
    }
  }

  const readonly = mode === 'view'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' && 'Add Employee'}
        {mode === 'edit' && 'Edit Employee'}
        {mode === 'view' && 'Employee Details'}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Full name"
            value={values.fullName}
            onChange={(event) => handleChange('fullName', event.target.value)}
            disabled={readonly}
            fullWidth
          />
          <TextField
            label="Email"
            value={values.email}
            onChange={(event) => handleChange('email', event.target.value)}
            disabled={readonly}
            fullWidth
          />
          <TextField
            label="Country"
            value={values.country}
            onChange={(event) => handleChange('country', event.target.value)}
            disabled={readonly}
            fullWidth
          />
          <TextField
            label="Job title"
            value={values.jobTitle}
            onChange={(event) => handleChange('jobTitle', event.target.value)}
            disabled={readonly}
            fullWidth
          />
          <TextField
            label="Department"
            value={values.department}
            onChange={(event) => handleChange('department', event.target.value)}
            disabled={readonly}
            fullWidth
          />
          <TextField
            label="Salary"
            type="number"
            value={values.salary}
            onChange={(event) => handleChange('salary', event.target.value)}
            disabled={readonly}
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {readonly ? null : (
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

function EmployeesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create')
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search)
      setPaginationModel((current) => ({ ...current, page: 0 }))
    }, 400)

    return () => window.clearTimeout(timer)
  }, [search])

  type EmployeesResponse = { items: Employee[]; count: number }

  const employeesQuery = useQuery<EmployeesResponse, Error, EmployeesResponse>({
    queryKey: ['employees', paginationModel.page, paginationModel.pageSize, debouncedSearch],
    queryFn: async () => {
      const response = await api.get('/employees', {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          search: debouncedSearch
        }
      })
      return response.data.data as EmployeesResponse
    },
    staleTime: 1000 * 30
  })

  const createEmployeeMutation = useMutation<unknown, Error, EmployeeFormValues>({
    mutationFn: async (employee) => api.post('/employees', employee),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'], exact: false })
      await queryClient.refetchQueries({ queryKey: ['employees'], exact: false })
      setNotification({ message: 'Employee added successfully.', severity: 'success' })
    },
    onError: () => {
      setNotification({ message: 'Unable to add employee.', severity: 'error' })
    }
  })

  const updateEmployeeMutation = useMutation<unknown, Error, { id: string; data: EmployeeFormValues }>({
    mutationFn: async (employee) => api.put(`/employees/${employee.id}`, employee.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'], exact: false })
      await queryClient.refetchQueries({ queryKey: ['employees'], exact: false })
      setNotification({ message: 'Employee updated successfully.', severity: 'success' })
    },
    onError: () => {
      setNotification({ message: 'Unable to update employee.', severity: 'error' })
    }
  })

  const deleteEmployeeMutation = useMutation<unknown, Error, string>({
    mutationFn: async (id) => api.delete(`/employees/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'], exact: false })
      await queryClient.refetchQueries({ queryKey: ['employees'], exact: false })
      setNotification({ message: 'Employee deleted successfully.', severity: 'success' })
    },
    onError: () => {
      setNotification({ message: 'Unable to delete employee.', severity: 'error' })
    }
  })

  const rows = useMemo(
    () => employeesQuery.data?.items ?? [],
    [employeesQuery.data]
  )

  const rowCount = employeesQuery.data?.count ?? 0

  const openDialog = (mode: 'create' | 'edit' | 'view', employee?: Employee) => {
    if (employee) {
      setCurrentEmployee(employee)
    } else {
      setCurrentEmployee(null)
    }

    setDialogMode(mode)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setCurrentEmployee(null)
  }

  const handleCreate = async (values: EmployeeFormValues) => {
    await createEmployeeMutation.mutateAsync(values)
  }

  const handleUpdate = async (values: EmployeeFormValues) => {
    if (!currentEmployee) return
    await updateEmployeeMutation.mutateAsync({ id: currentEmployee.id, data: values })
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete employee? This action cannot be undone.')
    if (!confirmed) return
    await deleteEmployeeMutation.mutateAsync(id)
  }

  const columns = [
    { field: 'fullName', headerName: 'Full Name', flex: 1, minWidth: 180 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
    { field: 'country', headerName: 'Country', flex: 1, minWidth: 120 },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 130 },
    { field: 'jobTitle', headerName: 'Job Title', flex: 1, minWidth: 150 },
    {
      field: 'salary',
      headerName: 'Salary',
      flex: 1,
      minWidth: 120,
      renderCell: (params: any) => {
        const salaryValue = params.row?.salary ?? params.value
        const salary = Number(salaryValue)
        return (
          <span>
            {Number.isFinite(salary)
              ? `$${salary.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : '-'}
          </span>
        )
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 260,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => openDialog('view', params.row as Employee)}
          >
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => openDialog('edit', params.row as Employee)}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => handleDelete(String(params.row.id))}
          >
            Delete
          </Button>
        </Stack>
      )
    }
  ]

  return (
    <Box component="div">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Employees
          </Typography>
          <Typography color="text.secondary">
            Browse team members, update compensation, and monitor payroll at a glance.
          </Typography>
        </Box>

        <Button variant="contained" size="large" onClick={() => openDialog('create')}>
          Add Employee
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.8, mb: 1 }}>
              Total employees
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {rowCount.toLocaleString()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.8, mb: 1 }}>
              Current page
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {paginationModel.page + 1}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.8, mb: 1 }}>
              Page size
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {paginationModel.pageSize}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, boxShadow: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: 'center'
          }}
        >
          <TextField
            label="Search employees"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={() => setSearch('')}>
            Clear
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ height: 700, width: '100%', overflow: 'hidden', boxShadow: 4 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={rowCount}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={employeesQuery.isLoading}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          initialState={{ pagination: { paginationModel } }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'primary.main',
              color: '#fff',
              borderBottom: 'none',
              fontSize: '0.95rem'
            },
            '& .MuiDataGrid-columnSeparator': {
              display: 'none'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(224, 224, 224, 0.85)'
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(38, 92, 241, 0.05)'
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid rgba(224, 224, 224, 0.85)'
            },
            '& .MuiDataGrid-virtualScrollerRenderZone': {
              backgroundColor: '#f7f9ff'
            }
          }}
        />
      </Paper>

      {dialogOpen && (
        <EmployeeDialog
          open={dialogOpen}
          mode={dialogMode}
          employee={
            dialogMode === 'create' || !currentEmployee
              ? defaultEmployeeData
              : {
                  fullName: currentEmployee.fullName,
                  email: currentEmployee.email,
                  country: currentEmployee.country,
                  jobTitle: currentEmployee.jobTitle,
                  department: currentEmployee.department,
                  salary: currentEmployee.salary
                }
          }
          onClose={closeDialog}
          onSubmit={dialogMode === 'edit' ? handleUpdate : handleCreate}
        />
      )}

      {notification && (
        <Snackbar
          open={Boolean(notification)}
          autoHideDuration={4000}
          onClose={() => setNotification(null)}
        >
          <Alert severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  )
}

export default EmployeesPage