"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployeeController = exports.updateEmployeeController = exports.createEmployeeController = exports.getEmployeesController = void 0;
const employee_service_1 = require("./employee.service");
const employee_validation_1 = require("./employee.validation");
const getEmployeesController = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || '');
    const employees = await (0, employee_service_1.getEmployees)(page, limit, search);
    res.json({
        success: true,
        data: employees
    });
};
exports.getEmployeesController = getEmployeesController;
const createEmployeeController = async (req, res) => {
    const validatedData = employee_validation_1.employeeSchema.parse(req.body);
    const employee = await (0, employee_service_1.createEmployee)(validatedData);
    res.status(201).json({
        success: true,
        data: employee
    });
};
exports.createEmployeeController = createEmployeeController;
const updateEmployeeController = async (req, res) => {
    const validatedData = employee_validation_1.employeeSchema.parse(req.body);
    const employee = await (0, employee_service_1.updateEmployee)(req.params.id, validatedData);
    res.json({
        success: true,
        data: employee
    });
};
exports.updateEmployeeController = updateEmployeeController;
const deleteEmployeeController = async (req, res) => {
    await (0, employee_service_1.deleteEmployee)(req.params.id);
    res.json({
        success: true,
        message: 'Employee deleted successfully'
    });
};
exports.deleteEmployeeController = deleteEmployeeController;
//# sourceMappingURL=employee.controller.js.map