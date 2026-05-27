import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/api'

type CountryInsights = {
  _count: {
    _all: number
  }
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
  _count: {
    _all: number
  }
  _avg: {
    salary: number | null
  }
}

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
    <Box component="div">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Salary Insights
      </Typography>

      <Box component="div" sx={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Country salary metrics
            </Typography>

            <TextField
              label="Country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              fullWidth
              margin="normal"
              placeholder="e.g. United States"
            />

            {countryInsightsQuery.error && (
              <Alert severity="error">Unable to load country insights.</Alert>
            )}

            {countryInsightsQuery.isSuccess && (
              <Box component="div" sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Country: {country}</Typography>
                <Typography>Employees: {countryInsightsQuery.data._count._all || 0}</Typography>
                <Typography>Average salary: {formatCurrency(countryInsightsQuery.data._avg.salary)}</Typography>
                <Typography>Minimum salary: {formatCurrency(countryInsightsQuery.data._min.salary)}</Typography>
                <Typography>Maximum salary: {formatCurrency(countryInsightsQuery.data._max.salary)}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Job title salary benchmark
            </Typography>

            <TextField
              label="Job title"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              fullWidth
              margin="normal"
              placeholder="e.g. Software Engineer"
            />

            <Button
              sx={{ mt: 1 }}
              variant="contained"
              disabled={!country || !jobTitle}
              onClick={() => {
                jobTitleInsightsQuery.refetch()
              }}
            >
              Refresh
            </Button>

            {jobTitleInsightsQuery.error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Unable to load job title insights.
              </Alert>
            )}

            {jobTitleInsightsQuery.isSuccess && (
              <Box component="div" sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                  {jobTitle} in {country}
                </Typography>
                <Typography>
                  Employees: {jobTitleInsightsQuery.data._count._all || 0}
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
