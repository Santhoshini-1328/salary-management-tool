export declare const getEmployees: (page: number, limit: number, search: string) => Promise<{
    id: string;
    fullName: string;
    email: string;
    country: string;
    jobTitle: string;
    department: string;
    salary: number;
    createdAt: Date;
}[]>;
export declare const createEmployee: (data: any) => Promise<{
    id: string;
    fullName: string;
    email: string;
    country: string;
    jobTitle: string;
    department: string;
    salary: number;
    createdAt: Date;
}>;
export declare const updateEmployee: (id: string, data: any) => Promise<{
    id: string;
    fullName: string;
    email: string;
    country: string;
    jobTitle: string;
    department: string;
    salary: number;
    createdAt: Date;
}>;
export declare const deleteEmployee: (id: string) => Promise<{
    id: string;
    fullName: string;
    email: string;
    country: string;
    jobTitle: string;
    department: string;
    salary: number;
    createdAt: Date;
}>;
//# sourceMappingURL=employee.service.d.ts.map