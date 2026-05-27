import { Request, Response } from 'express';
export declare const getEmployeesController: (req: Request, res: Response) => Promise<void>;
export declare const createEmployeeController: (req: Request, res: Response) => Promise<void>;
export declare const updateEmployeeController: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const deleteEmployeeController: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
//# sourceMappingURL=employee.controller.d.ts.map