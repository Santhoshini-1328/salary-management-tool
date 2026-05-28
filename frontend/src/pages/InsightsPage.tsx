import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/api'

type CountryInsights = {
  _count: number | { _all: number }
  _avg: {
    salary: number | null
  }
  _min: {
    salary: number | null
  }
  _max: {
    salary: number | null
  }
}

type JobTitleInsights = {
  _count: number | { _all: number }
  _avg: {
    salary: number | null
  }
}

const COUNTRIES = [
  'United States',
  'Canada',
  'Germany',
  'United Kingdom',
  'Netherlands',
  'India',
  'Singapore',
  'Australia',
  'Brazil',
  'South Africa'
]

const ROLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Engineering Manager',
  'Data Analyst',
  'Data Scientist',
  'Product Manager',
  'UX Designer',
  'HR Business Partner',
  'Recruiter',
  'Sales Executive',
  'Finance Analyst',
  'Customer Support Specialist'
]

function InsightsPage() {
  const [country, setCountry] = useState('')
  const [jobTitle, setJobTitle] = useState('')

  const formatCurrency = (value: number | null | undefined) =>
    value == null ? '$0' : `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  const countryInsightsQuery = useQuery<CountryInsights, Error>({
    queryKey: ['countryInsights', country],
    queryFn: async () => {
      const response = await api.get(`/insights/country/${encodeURIComponent(country)}`)
      return response.data.data as CountryInsights
    },
    enabled: country.length > 0
  })

  const jobTitleInsightsQuery = useQuery<JobTitleInsights, Error>({
    queryKey: ['jobTitleInsights', country, jobTitle],
    queryFn: async () => {
      const response = await api.get('/insights/job-title', {
        params: {
          country,
          title: jobTitle
        }
      })
      return response.data.data as JobTitleInsights
    },
    enabled: country.length > 0 && jobTitle.length > 0
  })

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Salary Insights
      </Typography>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Country salary metrics
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel id="country-select-label">Country</InputLabel>
              <Select
                labelId="country-select-label"
                value={country}
                label="Country"
                onChange={(e) => setCountry(String(e.target.value))}
              >
                {COUNTRIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {countryInsightsQuery.error && (
              <Alert severity="error">{countryInsightsQuery.error.message || 'Unable to load country insights.'}</Alert>
            )}

            {countryInsightsQuery.isSuccess && (
              <Box component="div" sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Country: {country}</Typography>
                <Typography>
                  Employees: {typeof countryInsightsQuery.data._count === 'number' ? countryInsightsQuery.data._count : countryInsightsQuery.data._count._all ?? 0}
                </Typography>
                <Typography>Average salary: {formatCurrency(countryInsightsQuery.data._avg.salary)}</Typography>
                <Typography>Minimum salary: {formatCurrency(countryInsightsQuery.data._min.salary)}</Typography>
                <Typography>Maximum salary: {formatCurrency(countryInsightsQuery.data._max.salary)}</Typography>

                {(typeof countryInsightsQuery.data._count !== 'number' ? countryInsightsQuery.data._count._all === 0 : countryInsightsQuery.data._count === 0) && (countryInsightsQuery.data._avg.salary != null || countryInsightsQuery.data._min.salary != null || countryInsightsQuery.data._max.salary != null) && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    The API returned salary metrics but reported zero employees for this country. Please refresh or re-seed if you expect data to exist.
                  </Alert>
                )}

                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" onClick={() => countryInsightsQuery.refetch()}>
                    Refresh
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Job title salary benchmark
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel id="title-select-label">Job title</InputLabel>
              <Select
                labelId="title-select-label"
                value={jobTitle}
                label="Job title"
                onChange={(e) => setJobTitle(String(e.target.value))}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button sx={{ mt: 1 }} variant="contained" disabled={!country || !jobTitle} onClick={() => jobTitleInsightsQuery.refetch()}>
              Refresh
            </Button>

            {jobTitleInsightsQuery.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {jobTitleInsightsQuery.error.message || 'Unable to load job title insights.'}
              </Alert>
            )}

            {jobTitleInsightsQuery.isSuccess && (
              <Box component="div" sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  {jobTitle} in {country}
                </Typography>
                <Typography>
                  Employees: {typeof jobTitleInsightsQuery.data._count === 'number' ? jobTitleInsightsQuery.data._count : jobTitleInsightsQuery.data._count._all || 0}
                </Typography>
                <Typography>
                  Average salary: {formatCurrency(jobTitleInsightsQuery.data._avg.salary)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default InsightsPage
