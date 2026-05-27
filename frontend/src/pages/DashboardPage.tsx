import { useMemo } from 'react'
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  SvgIcon
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/api'
import SimpleBarChart from '../components/SimpleBarChart'

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

  const statCards = isLoading || !data
    ? [1,2,3,4,5,6,7,8].map((i) => ({ key: String(i), label: 'Loading…', value: '—', icon: 'loading' }))
    : [
        { key: 'totalEmployees', label: 'Total Employees', value: data.totalEmployees?.toLocaleString() ?? totalEmployees.toLocaleString(), icon: 'people' },
        { key: 'averageSalary', label: 'Average Salary', value: formatCurrency(data.averageSalary ?? averageSalary), icon: 'dollar' },
        { key: 'highestSalary', label: 'Highest Salary', value: formatCurrency(data.highestSalary), icon: 'arrowUp' },
        { key: 'lowestSalary', label: 'Lowest Salary', value: formatCurrency(data.lowestSalary), icon: 'arrowDown' },
        { key: 'totalCountries', label: 'Total Countries', value: data.totalCountries ?? (data.employeesByCountry?.length ?? 0), icon: 'globe' },
        { key: 'totalDepartments', label: 'Total Departments', value: data.totalDepartments ?? '—', icon: 'building' },
        { key: 'highestPayingCountry', label: 'Highest Paying Country', value: data.highestPayingCountry ? `${data.highestPayingCountry.country} (${formatCurrency(data.highestPayingCountry._avg?.salary)})` : '—', icon: 'flag' },
        { key: 'highestPayingRole', label: 'Highest Paying Role', value: data.highestPayingRole ? `${data.highestPayingRole.jobTitle} (${formatCurrency(data.highestPayingRole._avg?.salary)})` : '—', icon: 'briefcase' }
      ]

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'people':
        return (
          <SvgIcon fontSize="small">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C13 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C22 14.17 17.33 13 15 13z" />
          </SvgIcon>
        )
      case 'dollar':
        return (
          <SvgIcon fontSize="small">
            <path d="M12 1C5.92 1 1 5.92 1 12s4.92 11 11 11 11-4.92 11-11S18.08 1 12 1zm1 17.93V20h-2v-1.07C8.14 18.45 6 16.24 6 13h2c0 2.21 1.79 4 4 4v-4H9v-2h4V9c-2.21 0-4-1.79-4-4h2c0 2.21 1.79 4 4 4v4h-4v2h4v4c2.21 0 4-1.79 4-4h-2c0 2.24-2.14 4.45-5 4.93z" />
          </SvgIcon>
        )
      case 'arrowUp':
        return (
          <SvgIcon fontSize="small">
            <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z" />
          </SvgIcon>
        )
      case 'arrowDown':
        return (
          <SvgIcon fontSize="small">
            <path d="M4 12l1.41-1.41L11 16.17V4h2v12.17l5.59-5.58L20 12l-8 8-8-8z" />
          </SvgIcon>
        )
      case 'globe':
        return (
          <SvgIcon fontSize="small">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 14.9c-1.18.8-2.58 1.27-4 1.34V16h-2v2.24c-1.42-.07-2.82-.54-4-1.34 1.12-.9 2.55-1.46 4-1.65V12H8v-2h3V7.75c-1.45-.19-2.88-.75-4-1.65 1.18-.8 2.58-1.27 4-1.34V8h2V4.75c1.42.07 2.82.54 4 1.34-1.12.9-2.55 1.46-4 1.65V10h3v2h-3v4.24c1.45.19 2.88.75 4 1.65z" />
          </SvgIcon>
        )
      case 'building':
        return (
          <SvgIcon fontSize="small">
            <path d="M6 2h12v20H6V2zm2 2v4h2V4H8zm4 0v4h2V4h-2zm4 0v4h2V4h-2zM8 10v4h2v-4H8zm4 0v4h2v-4h-2zm4 0v4h2v-4h-2zM8 16v4h2v-4H8zm4 0v4h2v-4h-2z" />
          </SvgIcon>
        )
      case 'flag':
        return (
          <SvgIcon fontSize="small">
            <path d="M6 22V2h2v8h10l-2 4 2 4H8v4H6z" />
          </SvgIcon>
        )
      case 'briefcase':
        return (
          <SvgIcon fontSize="small">
            <path d="M4 7V5c0-1.1.9-2 2-2h3V2h6v1h3c1.1 0 2 .9 2 2v2H4zm0 2h20v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V9zm6 2h8v2H10v-2z" />
          </SvgIcon>
        )
      default:
        return (
          <SvgIcon fontSize="small">
            <path d="M12 4C7.03 4 3 8.03 3 13s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" />
          </SvgIcon>
        )
    }
  }

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {statCards.map((s: any) => (
            <Card key={s.key} sx={{ minHeight: 140, display: 'flex', alignItems: 'center', p: 2 }}>
              <CardContent sx={{ width: '100%', display: 'flex', gap: 2, alignItems: 'center', p: 2 }}>
                <Box sx={{ width: 50, height: 50, borderRadius: 2, background: 'rgba(77,120,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderIcon(s.icon)}
                </Box>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8, mb: 0.5 }}>
                    {s.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Employees by Country
              </Typography>
              {isLoading || !data ? (
                <Typography>Loading…</Typography>
              ) : (
                <SimpleBarChart
                  data={topCountries.map((c: any) => ({ label: c.country ?? c.name ?? 'Unknown', value: c._count?._all ?? 0 }))}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Highest Paying Roles
              </Typography>
              {error ? (
                <Typography color="error">Unable to load roles.</Typography>
              ) : (
                <List disablePadding>
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
        </Box>
      </Box>
    </>
  )
}

export default DashboardPage