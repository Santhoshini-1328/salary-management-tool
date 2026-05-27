"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insights_controller_1 = require("./insights.controller");
const router = (0, express_1.Router)();
router.get('/country/:country', insights_controller_1.getCountryInsightsController);
router.get('/job-title', insights_controller_1.getJobTitleInsightsController);
router.get('/dashboard', insights_controller_1.getDashboardMetricsController);
exports.default = router;
//# sourceMappingURL=insights.routes.js.map