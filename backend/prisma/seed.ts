import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_EMPLOYEE_COUNT = 10_000
const DEFAULT_BATCH_SIZE = 2_000
const DEFAULT_RANDOM_SEED = 20260527

type WeightedItem = { weight: number }

type Country = WeightedItem & {
  name: string
  salaryMultiplier: number
}

type Role = WeightedItem & {
  title: string
  department: string
  baseSalary: number
  variance: number
}

type EmployeeSeedRow = {
  fullName: string
  email: string
  country: string
  jobTitle: string
  department: string
  salary: number
}

type SeedOptions = {
  truncate: boolean
  employeeCount: number
  batchSize: number
  randomSeed: number
}

const COUNTRIES: Country[] = [
  { name: 'United States', weight: 18, salaryMultiplier: 1.35 },
  { name: 'Canada', weight: 8, salaryMultiplier: 1.2 },
  { name: 'Germany', weight: 9, salaryMultiplier: 1.18 },
  { name: 'United Kingdom', weight: 10, salaryMultiplier: 1.22 },
  { name: 'Netherlands', weight: 6, salaryMultiplier: 1.15 },
  { name: 'India', weight: 20, salaryMultiplier: 0.62 },
  { name: 'Singapore', weight: 7, salaryMultiplier: 1.28 },
  { name: 'Australia', weight: 7, salaryMultiplier: 1.25 },
  { name: 'Brazil', weight: 8, salaryMultiplier: 0.82 },
  { name: 'South Africa', weight: 7, salaryMultiplier: 0.75 }
]

const ROLES: Role[] = [
  { title: 'Software Engineer', department: 'Engineering', weight: 20, baseSalary: 85000, variance: 20000 },
  { title: 'Senior Software Engineer', department: 'Engineering', weight: 14, baseSalary: 115000, variance: 25000 },
  { title: 'Engineering Manager', department: 'Engineering', weight: 4, baseSalary: 145000, variance: 30000 },
  { title: 'Data Analyst', department: 'Data', weight: 9, baseSalary: 70000, variance: 15000 },
  { title: 'Data Scientist', department: 'Data', weight: 8, baseSalary: 102000, variance: 22000 },
  { title: 'Product Manager', department: 'Product', weight: 8, baseSalary: 110000, variance: 22000 },
  { title: 'UX Designer', department: 'Design', weight: 7, baseSalary: 78000, variance: 17000 },
  { title: 'HR Business Partner', department: 'HR', weight: 6, baseSalary: 72000, variance: 14000 },
  { title: 'Recruiter', department: 'HR', weight: 6, baseSalary: 65000, variance: 12000 },
  { title: 'Sales Executive', department: 'Sales', weight: 8, baseSalary: 74000, variance: 18000 },
  { title: 'Finance Analyst', department: 'Finance', weight: 5, baseSalary: 76000, variance: 14000 },
  { title: 'Customer Support Specialist', department: 'Support', weight: 5, baseSalary: 52000, variance: 9000 }
]

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function loadNameList(filePath: string): string[] {
  const raw = fs.readFileSync(filePath, 'utf8')
  const uniqueNames = new Set(
    raw
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean)
  )

  if (uniqueNames.size === 0) {
    throw new Error(`No names found in ${filePath}`)
  }

  return Array.from(uniqueNames)
}

function normalizeForEmail(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

function pickWeighted<T extends WeightedItem>(items: T[], random: () => number): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  let threshold = random() * totalWeight

  for (const item of items) {
    threshold -= item.weight
    if (threshold <= 0) {
      return item
    }
  }

  return items[items.length - 1]!
}

function randomInRange(min: number, max: number, random: () => number): number {
  return min + (max - min) * random()
}

function toRoundedCurrency(amount: number): number {
  return Math.round(amount * 100) / 100
}

function chunkArray<T>(values: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < values.length; i += chunkSize) {
    chunks.push(values.slice(i, i + chunkSize))
  }
  return chunks
}

function buildEmployees({
  count,
  offset,
  firstNames,
  lastNames,
  random
}: {
  count: number
  offset: number
  firstNames: string[]
  lastNames: string[]
  random: () => number
}): EmployeeSeedRow[] {
  const employees: EmployeeSeedRow[] = new Array(count)

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(random() * firstNames.length)]!
    const lastName = lastNames[Math.floor(random() * lastNames.length)]!
    const role = pickWeighted(ROLES, random)
    const country = pickWeighted(COUNTRIES, random)

    const salaryBase = randomInRange(
      role.baseSalary - role.variance,
      role.baseSalary + role.variance,
      random
    )
    const salary = toRoundedCurrency(salaryBase * country.salaryMultiplier)
    const uniqueId = offset + i + 1

    const firstForEmail = normalizeForEmail(firstName) || 'employee'
    const lastForEmail = normalizeForEmail(lastName) || 'user'

    employees[i] = {
      fullName: `${firstName} ${lastName}`,
      email: `${firstForEmail}.${lastForEmail}.${uniqueId}@acme-hr.com`,
      country: country.name,
      jobTitle: role.title,
      department: role.department,
      salary
    }
  }

  return employees
}

function parseOptions(): SeedOptions {
  const args = new Set(process.argv.slice(2))
  const appendMode = args.has('--append')
  const resetMode = args.has('--reset')
  const truncate = resetMode || !appendMode

  return {
    truncate,
    employeeCount: Number(process.env.SEED_EMPLOYEE_COUNT || DEFAULT_EMPLOYEE_COUNT),
    batchSize: Number(process.env.SEED_BATCH_SIZE || DEFAULT_BATCH_SIZE),
    randomSeed: Number(process.env.SEED_RANDOM_SEED || DEFAULT_RANDOM_SEED)
  }
}

async function main(): Promise<void> {
  const startedAt = process.hrtime.bigint()
  const options = parseOptions()

  if (!Number.isInteger(options.employeeCount) || options.employeeCount <= 0) {
    throw new Error('SEED_EMPLOYEE_COUNT must be a positive integer')
  }

  if (!Number.isInteger(options.batchSize) || options.batchSize <= 0) {
    throw new Error('SEED_BATCH_SIZE must be a positive integer')
  }

  const firstNameFile = path.join(__dirname, 'data', 'first_names.txt')
  const lastNameFile = path.join(__dirname, 'data', 'last_names.txt')
  const firstNames = loadNameList(firstNameFile)
  const lastNames = loadNameList(lastNameFile)

  console.log(`Seeding ${options.employeeCount.toLocaleString()} employees...`)
  console.log(
    `Configuration: batchSize=${options.batchSize}, seed=${options.randomSeed}, truncate=${options.truncate}`
  )

  let offset = 0
  if (options.truncate) {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Employee";')
    console.log('Existing employees truncated.')
  } else {
    offset = await prisma.employee.count()
    console.log(`Append mode enabled. Starting from existing count ${offset}.`)
  }

  const random = createSeededRandom(options.randomSeed)
  const generationStartedAt = process.hrtime.bigint()
  const employees = buildEmployees({
    count: options.employeeCount,
    offset,
    firstNames,
    lastNames,
    random
  })
  const generationMs = Number(process.hrtime.bigint() - generationStartedAt) / 1_000_000
  console.log(`Generated data in ${generationMs.toFixed(2)}ms.`)

  const batches = chunkArray(employees, options.batchSize)
  const insertStartedAt = process.hrtime.bigint()

  for (const [index, batch] of batches.entries()) {
    await prisma.employee.createMany({ data: batch })
    if ((index + 1) % 5 === 0 || index === batches.length - 1) {
      console.log(
        `Inserted ${Math.min((index + 1) * options.batchSize, employees.length).toLocaleString()} / ${employees.length.toLocaleString()}`
      )
    }
  }

  const insertMs = Number(process.hrtime.bigint() - insertStartedAt) / 1_000_000
  const totalMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000
  const throughput = options.employeeCount / Math.max(totalMs / 1000, 0.0001)

  console.log(`Insert phase completed in ${insertMs.toFixed(2)}ms.`)
  console.log(
    `Total completed in ${totalMs.toFixed(2)}ms (~${Math.round(throughput).toLocaleString()} rows/sec).`
  )
}

main()
  .catch((error: unknown) => {
    console.error('Seeding failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
