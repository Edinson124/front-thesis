import NetworksAssociated from '@/views/networks/NetworksAssociated.vue';
import ShipmentsRequest from '@/views/networks/ShipmentsRequest.vue';
import StockNetworkAssociated from '@/views/networks/StockNetworkAssociated.vue';

export default [
  {
    path: '/networks',
    name: 'networks-associated',
    component: NetworksAssociated
  },
  {
    path: '/networks/stock',
    name: 'networks-associated-stock',
    component: StockNetworkAssociated
  },
  {
    path: '/networks/shipments',
    name: 'networks-shipments',
    component: ShipmentsRequest
  }
];
