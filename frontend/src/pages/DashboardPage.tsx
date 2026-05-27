import { useMemo } from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/api'

function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      const response = await api.get('/insights/dashboard')
      return response.data.data
    }
  })

  const totalEmployees = useMemo(() => {
    if (!data) return 0
    return data.employeesByCountry.reduce(
      (sum: number, item: { _count: { _all: number } }) => sum + item._count._all,
      0
    )
  }, [data])

  const averageSalary = useMemo(() => {
    if (!data || totalEmployees === 0) return 0
    const totalSalary = data.employeesByCountry.reduce(
      (sum: number, item: { _count: { _all: number }; _avg: { salary: number | null } }) => {
        const avgSalary = item._avg.salary ?? 0
        return sum + avgSalary * item._count._all
      },
      0
    )

    return totalSalary / totalEmployees
  }, [data, totalEmployees])

  const topCountries = useMemo(() => {
    if (!data) return []
    return [...data.employeesByCountry]
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 5)
  }, [data])

  const formatCurrency = (value: number | null | undefined) =>
    value == null ? '$0' : `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  return (
    <>
      <Typography variant="h4" mb={3}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h4">{isLoading ? 'Loading…' : totalEmployees}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Salary</Typography>
              <Typography variant="h4">
                {isLoading ? 'Loading…' : `$${averageSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Highest Paying Roles
              </Typography>
              {error ? (
                <Typography color="error">Unable to load roles.</Typography>
              ) : (
                <List>
                  {isLoading
                    ? [1, 2, 3].map((value) => (
                        <ListItem key={value} divider>
                          <ListItemText primary="Loading…" />
                        </ListItem>
                      ))
                    : data.highestPayingRoles.map((role: { jobTitle: string; _avg: { salary: number | null } }) => (
                        <ListItem key={role.jobTitle} divider>
                          <ListItemText
                            primary={role.jobTitle}
                            secondary={`Avg salary: $${(role._avg.salary ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                          />
                        </ListItem>
                      ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default DashboardPage