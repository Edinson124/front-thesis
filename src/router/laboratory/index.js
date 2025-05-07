import hematologicalTestRoutes from './hematologicalTest';
import serologyTestRoutes from './serologyTest';
import unitsQuarantinedRoutes from './unitsQuarantined';

export default [...serologyTestRoutes, ...hematologicalTestRoutes, ...unitsQuarantinedRoutes];
