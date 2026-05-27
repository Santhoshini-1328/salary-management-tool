"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMetrics = exports.getJobTitleInsights = exports.getCountrySalaryInsights = void 0;
const prisma_1 = require("../../lib/prisma");
const getCountrySalaryInsights = async (country) => {
    const result = await prisma_1.prisma.employee.aggregate({
        where: {
            country
        },
        _avg: {
            salary: true
        },
        _min: {
            salary: true
        },
        _max: {
            salary: true
        },
        _count: true
    });
    return result;
};
exports.getCountrySalaryInsights = getCountrySalaryInsights;
const getJobTitleInsights = async (country, jobTitle) => {
    return prisma_1.prisma.employee.aggregate({
        where: {
            country,
            jobTitle
        },
        _avg: {
            salary: true
        },
        _count: true
    });
};
exports.getJobTitleInsights = getJobTitleInsights;
const getDashboardMetrics = async () => {
    const employeesByCountry = await prisma_1.prisma.employee.groupBy({
        by: ['country'],
        _count: true,
        _avg: {
            salary: true
        }
    });
    const highestPayingRoles = await prisma_1.prisma.employee.groupBy({
        by: ['jobTitle'],
        _avg: {
            salary: true
        },
        orderBy: {
            _avg: {
                salary: 'desc'
            }
        },
        take: 5
    });
    return {
        employeesByCountry,
        highestPayingRoles
    };
};
exports.getDashboardMetrics = getDashboardMetrics;
//# sourceMappingURL=insights.service.js.map