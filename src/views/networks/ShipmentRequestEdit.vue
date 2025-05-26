<script setup>
import BloodBankInfo from '@/components/network/BloodBankInfo.vue';
import { useShipmentStore } from '@/stores/networks/shipments';
import { onMounted, ref } from 'vue';

const shipmentStore = useShipmentStore();

// Variables reactivas
const networkSelected = ref(null);

const bloodBankSelected = ref(null);
const bloodBanksOption = ref([]);

const motivoSeleccionado = ref(null);
const detalle = ref('');
const mostrarModalUnidad = ref(false);
const loadingNetwork = ref(false);

const unidadesSolicitadas = ref([{ codigo: 41, unidad: 'Plaquetas', grupoSanguineo: 'O+', fechaVencimiento: '15/05/2025' }]);

const nuevaUnidad = ref({
  codigo: '',
  unidad: null,
  grupoSanguineo: null,
  fechaVencimiento: null
});

const motivos = ref([
  { name: 'Emergencia médica', code: 'EM' },
  { name: 'Cirugía programada', code: 'CP' },
  { name: 'Tratamiento oncológico', code: 'TO' },
  { name: 'Accidente de tránsito', code: 'AT' }
]);

const tiposUnidad = ref([
  { name: 'Plaquetas', code: 'PLQ' },
  { name: 'Glóbulos Rojos', code: 'GR' },
  { name: 'Plasma', code: 'PLS' },
  { name: 'Sangre Total', code: 'ST' }
]);

const gruposSanguineos = ref([
  { name: 'A+', code: 'A+' },
  { name: 'A-', code: 'A-' },
  { name: 'B+', code: 'B+' },
  { name: 'B-', code: 'B-' },
  { name: 'AB+', code: 'AB+' },
  { name: 'AB-', code: 'AB-' },
  { name: 'O+', code: 'O+' },
  { name: 'O-', code: 'O-' }
]);

// Métodos
const onNetworkChange = () => {
  if (networkSelected.value) {
    bloodBanksOption.value = networkSelected.value.bloodBankDetails ?? [];
    bloodBankSelected.value = null;
  } else {
    bloodBanksOption.value = [];
    bloodBankSelected.value = null;
  }
};

const asignarUnidad = () => {
  if (nuevaUnidad.value.codigo && nuevaUnidad.value.unidad && nuevaUnidad.value.grupoSanguineo && nuevaUnidad.value.fechaVencimiento) {
    // Formatear fecha
    const fecha = nuevaUnidad.value.fechaVencimiento;
    const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;

    unidadesSolicitadas.value.push({
      codigo: nuevaUnidad.value.codigo,
      unidad: nuevaUnidad.value.unidad.name,
      grupoSanguineo: nuevaUnidad.value.grupoSanguineo.name,
      fechaVencimiento: fechaFormateada
    });

    // Limpiar formulario
    nuevaUnidad.value = {
      codigo: '',
      unidad: null,
      grupoSanguineo: null,
      fechaVencimiento: null
    };

    mostrarModalUnidad.value = false;
  }
};

const eliminarUnidad = (index) => {
  unidadesSolicitadas.value.splice(index, 1);
};

const confirmarRecepcion = () => {
  console.log('Confirmando recepción...');
  // Aquí iría la lógica para confirmar la recepción
};

const cancelar = () => {
  console.log('Operación cancelada');
  // Aquí iría la lógica para cancelar
};

const guardar = () => {
  console.log('Guardando solicitud de transferencia...');
  // Aquí iría la lógica para guardar
};

onMounted(async () => {
  loadingNetwork.value = true;
  await shipmentStore.getShipmentsNetwork();
  loadingNetwork.value = false;
});
</script>
<template>
  <div class="card">
    <h1 class="text-2xl font-bold mb-6">Solicitar Tranferencia</h1>

    <!-- Campos de Red y Banco de sangre -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <FloatLabel variant="on">
          <Select v-model="networkSelected" :options="shipmentStore.networkOptions" optionLabel="name" id="network" class="w-full" filter showClear @change="onNetworkChange" />
          <label for="network">Red</label>
        </FloatLabel>
      </div>
      <div>
        <FloatLabel variant="on">
          <Select v-model="bloodBankSelected" :options="bloodBanksOption" optionLabel="name" id="bloodBank" class="w-full" filter showClear :disabled="!networkSelected" />
          <label for="bloodBank">Banco de sangre</label>
        </FloatLabel>
      </div>
    </div>

    <!-- Datos del banco de sangre -->
    <BloodBankInfo :blood-bank="bloodBankSelected" />

    <!-- Unidades solicitadas -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <h4>Unidades solicitadas</h4>
        <Button label="Asignar Unidad" icon="pi pi-plus" class="p-button-success" @click="mostrarModalUnidad = true" />
      </div>

      <DataTable :value="unidadesSolicitadas" responsiveLayout="scroll" stripedRows class="p-datatable-sm">
        <template #empty>
          <div class="text-center py-4">
            <p class="text-gray-500">No hay unidades solicitadas</p>
          </div>
        </template>

        <Column field="codigo" header="Código" style="width: 15%"></Column>
        <Column field="unidad" header="Unidad" style="width: 25%"></Column>
        <Column field="grupoSanguineo" header="Grupo sanguíneo" style="width: 20%"></Column>
        <Column field="fechaVencimiento" header="Fecha de vencimiento" style="width: 25%"></Column>
        <Column header="Acciones" style="width: 15%">
          <template #body="slotProps">
            <Button label="Eliminar" class="p-button-danger p-button-sm" @click="eliminarUnidad(slotProps.index)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Motivo -->
    <div class="mb-6">
      <h4 class="mb-3">Motivo</h4>

      <div class="space-y-4">
        <div>
          <FloatLabel variant="on">
            <Dropdown v-model="motivoSeleccionado" :options="motivos" optionLabel="name" id="motivo" class="w-full md:w-64" />
            <label for="motivo">Motivo</label>
          </FloatLabel>
        </div>

        <div>
          <FloatLabel variant="on">
            <Textarea v-model="detalle" id="detalle" rows="4" class="w-full resize-none" />
            <label for="detalle">Detalle</label>
          </FloatLabel>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="flex flex-col sm:flex-row justify-between gap-2">
      <Button label="Confirmar recepción" class="p-button-success" @click="confirmarRecepcion" />
      <div class="flex gap-2">
        <Button label="Cancelar" class="p-button-secondary" @click="cancelar" />
        <Button label="Guardar" class="p-button-success" @click="guardar" />
      </div>
    </div>

    <!-- Modal para asignar unidad (simulado) -->
    <Dialog v-model:visible="mostrarModalUnidad" header="Asignar Unidad" :style="{ width: '500px' }" :modal="true">
      <div class="p-fluid space-y-4">
        <div>
          <label for="codigo_unidad" class="font-medium mb-2 block">Código de Unidad</label>
          <InputText v-model="nuevaUnidad.codigo" id="codigo_unidad" />
        </div>
        <div>
          <label for="tipo_unidad" class="font-medium mb-2 block">Tipo de Unidad</label>
          <Dropdown v-model="nuevaUnidad.unidad" :options="tiposUnidad" optionLabel="name" />
        </div>
        <div>
          <label for="grupo_sanguineo_unidad" class="font-medium mb-2 block">Grupo Sanguíneo</label>
          <Dropdown v-model="nuevaUnidad.grupoSanguineo" :options="gruposSanguineos" optionLabel="name" />
        </div>
        <div>
          <label for="fecha_vencimiento_unidad" class="font-medium mb-2 block">Fecha de Vencimiento</label>
          <Calendar v-model="nuevaUnidad.fechaVencimiento" dateFormat="dd/mm/yy" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="mostrarModalUnidad = false" />
        <Button label="Asignar" icon="pi pi-check" class="p-button-success" @click="asignarUnidad" />
      </template>
    </Dialog>
  </div>
</template>
