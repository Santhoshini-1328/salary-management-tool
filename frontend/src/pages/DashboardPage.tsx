import {
    Card,
    CardContent,
    Grid,
    Typography
  } from '@mui/material'
  
  function DashboardPage() {
    return (
      <>
        <Typography variant="h4" mb={3}>
          Dashboard
        </Typography>
  
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Total Employees
                </Typography>
  
                <Typography variant="h4">
                  10,000
                </Typography>
              </CardContent>
            </Card>
          </Grid>
  
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Avg Salary
                </Typography>
  
                <Typography variant="h4">
                  $120K
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    )
  }
  
export default DashboardPage