import hematologicalTestRoutes from './hematologicalTest';
import serologyTestRoutes from './serologyTest';
import unitsQuarantinedRoutes from './unitsQuarantined';
import unitTransformationRoutes from './unitTransformation';

export default [...serologyTestRoutes, ...hematologicalTestRoutes, ...unitsQuarantinedRoutes, ...unitTransformationRoutes];
