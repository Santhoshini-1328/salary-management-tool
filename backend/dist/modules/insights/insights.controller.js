"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMetricsController = exports.getJobTitleInsightsController = exports.getCountryInsightsController = void 0;
const insights_service_1 = require("./insights.service");
const getCountryInsightsController = async (req, res) => {
    const country = req.params.country;
    const insights = await (0, insights_service_1.getCountrySalaryInsights)(country);
    res.json({
        success: true,
        data: insights
    });
};
exports.getCountryInsightsController = getCountryInsightsController;
const getJobTitleInsightsController = async (req, res) => {
    const country = String(req.query.country);
    const title = String(req.query.title);
    const insights = await (0, insights_service_1.getJobTitleInsights)(country, title);
    res.json({
        success: true,
        data: insights
    });
};
exports.getJobTitleInsightsController = getJobTitleInsightsController;
const getDashboardMetricsController = async (_req, res) => {
    const metrics = await (0, insights_service_1.getDashboardMetrics)();
    res.json({
        success: true,
        data: metrics
    });
};
exports.getDashboardMetricsController = getDashboardMetricsController;
//# sourceMappingURL=insights.controller.js.map