import { Box, Typography } from '@mui/material'

type DataPoint = { label: string; value: number }

type Props = {
  data: DataPoint[]
}

export default function SimpleBarChart({ data }: Props) {
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gap: 2 }}>
        {data.map((d) => {
          const pct = Math.round((d.value / max) * 100)
          return (
            <Box key={d.label} sx={{ display: 'grid', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 64, textAlign: 'right' }}>
                  {d.value.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: 10, backgroundColor: 'rgba(15, 23, 42, 0.06)', borderRadius: 5 }}>
                <Box sx={{ width: `${pct}%`, height: '100%', backgroundColor: '#4d78ff', borderRadius: 5 }} />
              </Box>
            </Box>
          )
        })}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Top values
      </Typography>
    </Box>
  )
}
