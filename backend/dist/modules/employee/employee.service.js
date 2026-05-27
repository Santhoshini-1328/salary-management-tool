"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getEmployees = void 0;
const prisma_1 = require("../../lib/prisma");
const getEmployees = async (page, limit, search) => {
    const skip = (page - 1) * limit;
    return prisma_1.prisma.employee.findMany({
        where: {
            OR: [
                {
                    fullName: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        },
        skip,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        }
    });
};
exports.getEmployees = getEmployees;
const createEmployee = async (data) => {
    return prisma_1.prisma.employee.create({
        data
    });
};
exports.createEmployee = createEmployee;
const updateEmployee = async (id, data) => {
    return prisma_1.prisma.employee.update({
        where: { id },
        data
    });
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = async (id) => {
    return prisma_1.prisma.employee.delete({
        where: { id }
    });
};
exports.deleteEmployee = deleteEmployee;
//# sourceMappingURL=employee.service.js.map