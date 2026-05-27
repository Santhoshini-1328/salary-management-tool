"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeSchema = void 0;
const zod_1 = require("zod");
exports.employeeSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    country: zod_1.z.string().min(2),
    jobTitle: zod_1.z.string().min(2),
    department: zod_1.z.string().min(2),
    salary: zod_1.z.number().positive()
});
//# sourceMappingURL=employee.validation.js.map