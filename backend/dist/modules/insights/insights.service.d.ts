export declare const getCountrySalaryInsights: (country: string) => Promise<import("@prisma/client").Prisma.GetEmployeeAggregateType<{
    where: {
        country: string;
    };
    _avg: {
        salary: true;
    };
    _min: {
        salary: true;
    };
    _max: {
        salary: true;
    };
    _count: true;
}>>;
export declare const getJobTitleInsights: (country: string, jobTitle: string) => Promise<import("@prisma/client").Prisma.GetEmployeeAggregateType<{
    where: {
        country: string;
        jobTitle: string;
    };
    _avg: {
        salary: true;
    };
    _count: true;
}>>;
export declare const getDashboardMetrics: () => Promise<{
    employeesByCountry: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.EmployeeGroupByOutputType, "country"[]> & {
        _count: number;
        _avg: {
            salary: number | null;
        };
    })[];
    highestPayingRoles: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.EmployeeGroupByOutputType, "jobTitle"[]> & {
        _avg: {
            salary: number | null;
        };
    })[];
}>;
//# sourceMappingURL=insights.service.d.ts.map