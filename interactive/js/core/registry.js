import { mount as mountCourseCatalog } from '../components/course-catalog.js';
import { mount as mountAnalyticsPipeline } from '../components/analytics-pipeline.js';
import { mount as mountDataQualityLab } from '../components/data-quality-lab.js';
import { mount as mountKnowledgeCheck } from '../components/knowledge-check.js';

export const registry = {
  'course-catalog': mountCourseCatalog,
  'analytics-pipeline': mountAnalyticsPipeline,
  'data-quality-lab': mountDataQualityLab,
  'knowledge-check': mountKnowledgeCheck,
};
