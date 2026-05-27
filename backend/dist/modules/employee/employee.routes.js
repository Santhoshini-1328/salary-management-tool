"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("./employee.controller");
const router = (0, express_1.Router)();
router.get('/', employee_controller_1.getEmployeesController);
router.post('/', employee_controller_1.createEmployeeController);
router.put('/:id', employee_controller_1.updateEmployeeController);
router.delete('/:id', employee_controller_1.deleteEmployeeController);
exports.default = router;
//# sourceMappingURL=employee.routes.js.map