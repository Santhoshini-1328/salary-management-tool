import { z } from 'zod';
export declare const employeeSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    country: z.ZodString;
    jobTitle: z.ZodString;
    department: z.ZodString;
    salary: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=employee.validation.d.ts.map