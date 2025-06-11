import ListShipmentsRequest from '@/views/networks/ListShipmentsRequest.vue';
import MyShipmentsRequest from '@/views/networks/MyShipmentsRequest.vue';
import NetworksAssociated from '@/views/networks/NetworksAssociated.vue';
import ShipmentRequestEdit from '@/views/networks/ShipmentRequestEdit.vue';
import ShipmentRequestNew from '@/views/networks/ShipmentRequestNew.vue';
import ShipmentRequestView from '@/views/networks/ShipmentRequestView.vue';
import ShipmentRequestViewResponse from '@/views/networks/ShipmentRequestViewResponse.vue';
import StockNetworkAssociated from '@/views/networks/StockNetworkAssociated.vue';
import ViewUnitNetwork from '@/views/networks/ViewUnitNetwork.vue';

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
    path: '/networks/stock/unit',
    name: 'networks-associated-unit',
    component: ViewUnitNetwork
  },
  {
    path: '/networks/shipments',
    name: 'networks-shipments',
    component: ListShipmentsRequest
  },
  {
    path: '/networks/myShipments',
    name: 'networks-my-shipments',
    component: MyShipmentsRequest
  },
  {
    path: '/networks/shipment/new',
    name: 'networks-shipment-new',
    component: ShipmentRequestNew
  },
  {
    path: '/networks/my/shipment/edit/:id',
    name: 'networks-my-shipment-edit',
    component: ShipmentRequestEdit
  },
  {
    path: '/networks/my/shipment/view/:id',
    name: 'networks-my-shipment-view',
    component: ShipmentRequestView
  },
  {
    path: '/networks/shipment/view/:id',
    name: 'networks-shipment-view',
    component: ShipmentRequestViewResponse
  }
];
