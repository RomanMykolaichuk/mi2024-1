import { mount as mountCourseCatalog } from '../components/course-catalog.js';
import { mount as mountAnalyticsPipeline } from '../components/analytics-pipeline.js';
import { mount as mountDataQualityLab } from '../components/data-quality-lab.js';
import { mount as mountKnowledgeCheck } from '../components/knowledge-check.js';
import { mount as mountStorageModelExplorer } from '../components/storage-model-explorer.js';
import { mount as mountSchemaNormalizationLab } from '../components/schema-normalization-lab.js';
import { mount as mountSqlQueryLab } from '../components/sql-query-lab.js';
import { mount as mountStorageDecisionLab } from '../components/storage-decision-lab.js';
import { mount as mountRelationalSchemaBuilder } from '../components/relational-schema-builder.js';
import { mount as mountSqlMissionLab } from '../components/sql-mission-lab.js';
import { mount as mountEdaExplorer } from '../components/eda-explorer.js';
import { mount as mountWorkflowMissionLab } from '../components/workflow-mission-lab.js';
import { mount as mountTransformationLab } from '../components/transformation-lab.js';
import { mount as mountSplitLeakageLab } from '../components/split-leakage-lab.js';
import { mount as mountReadinessScorecard } from '../components/readiness-scorecard.js';

export const registry = {
  'course-catalog': mountCourseCatalog,
  'analytics-pipeline': mountAnalyticsPipeline,
  'data-quality-lab': mountDataQualityLab,
  'knowledge-check': mountKnowledgeCheck,
  'storage-model-explorer': mountStorageModelExplorer,
  'schema-normalization-lab': mountSchemaNormalizationLab,
  'sql-query-lab': mountSqlQueryLab,
  'storage-decision-lab': mountStorageDecisionLab,
  'relational-schema-builder': mountRelationalSchemaBuilder,
  'sql-mission-lab': mountSqlMissionLab,
  'eda-explorer': mountEdaExplorer,
  'workflow-mission-lab': mountWorkflowMissionLab,
  'transformation-lab': mountTransformationLab,
  'split-leakage-lab': mountSplitLeakageLab,
  'readiness-scorecard': mountReadinessScorecard,
};
