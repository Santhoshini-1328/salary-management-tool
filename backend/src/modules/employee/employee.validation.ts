import { z } from 'zod'

export const employeeSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  country: z.string().min(2),
  jobTitle: z.string().min(2),
  department: z.string().min(2),
  salary: z.number().positive()
})