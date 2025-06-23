<script setup>
import { isInternalOptions } from '@/enums/BloodBank';
import { useBloodBanksStore } from '@/stores/admin/blodd-banks';
import { useNetworCollaborationStore } from '@/stores/networks/networks';
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Services
const networkCollaborationStore = useNetworCollaborationStore();
const bloodBanksStore = useBloodBanksStore();

// State
const loading = ref(false);
const loadingBlooBanks = ref(false);
const first = ref(0);
const networks = computed(() => networkCollaborationStore.networks);
const activeIndexes = ref([]);

//Filters
const filters = reactive({
  name: null,
  idBloodBank: null
});

// Dialog states
const networkDialog = ref({
  visible: false,
  isNew: true,
  submitted: false,
  network: { id: null, name: '', bloodBanks: [] }
});

const bloodBankDialog = ref({
  visible: false,
  submitted: false,
  network: null,
  bloodBank: { id: null, name: '' }
});

const viewStockNetwork = async (networkId) => {
  router.push({ path: '/networks/stock', query: { network: networkId } });
};

const rowClass = (data) => {
  return data.isInternal === false ? 'row-external' : '';
};

const searchNetwork = async (event) => {
  loading.value = true;
  const page = event ? event.page + 1 : networkCollaborationStore.currentPage;

  const params = {
    name: filters.name,
    idBloodBank: filters.idBloodBank
  };

  // Inicia ambas promesas en paralelo
  await Promise.all([
    networkCollaborationStore.getNetworks(params, page),
    new Promise((resolve) => setTimeout(resolve, 500)) // mínimo 0.5s para mostrar el spinner
  ]);
  loading.value = false;
};

// Sample data for demonstration
onMounted(async () => {
  loadingBlooBanks.value = true;
  await Promise.all([searchNetwork(), bloodBanksStore.getBloodBanksOptions()]);
  loadingBlooBanks.value = false;
});

const preventCollapse = () => {
  setTimeout(() => {
    activeIndexes.value = networks.value.map((network) => network.id);
  }, 0);
};

watchEffect(() => {
  //Keeps accordions open
  if (networks.value.length > 0) {
    activeIndexes.value = networks.value.map((network) => network.id);
  }
});
</script>

<template>
  <div class="p-4 mx-auto card">
    <div class="mb-4">
      <h3>Redes asociadas</h3>
    </div>

    <!-- Search and Add Network Controls -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
        <div>
          <FloatLabel variant="on" class="w-full">
            <InputText class="w-full" id="name" v-model="filters.name" aria-describedby="username-help" />
            <label for="name">Nombre</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on" class="w-full">
            <Select id="idBloodBank" v-model="filters.idBloodBank" :options="bloodBanksStore.bloodBanksOptions" optionLabel="name" optionValue="id" class="w-full" showClear filter :loading="loadingBlooBanks" />
            <label for="idBloodBank">Banco de sangre</label>
          </FloatLabel>
        </div>
      </div>
      <div class="col-span-12 md:col-span-4 flex flex-col md:flex-row items-center">
        <Button class="h-8 w-full md:w-[30%] md:mr-2 mb-2 md:mb-0" label="Buscar" severity="info" @click="searchNetwork()" />
      </div>
    </div>

    <div class="dataviewSpinner">
      <!-- Networks Accordion -->
      <div v-if="loading" class="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
        <ProgressSpinner style="width: 50px; height: 50px" />
      </div>
      <div v-else>
        <div v-if="networkCollaborationStore.networks.length > 0">
          <Accordion :value="activeIndexes" @update:value="preventCollapse" multiple class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4" :expandIcon="''" :collapseIcon="''">
            <template #expandicon></template>
            <template #collapseicon></template>
            <AccordionPanel v-for="network in networks" :key="network.id" :value="network.id">
              <AccordionHeader>
                <div class="flex items-center justify-between w-full">
                  <div class="flex" @click.stop>
                    <span>{{ network.name }}</span>
                  </div>
                  <div class="flex ml-1" @click.stop>
                    <Button class="h-8 btn-view" label="Visualizar" @click="viewStockNetwork(network.id)" />
                  </div>
                </div>
              </AccordionHeader>
              <AccordionContent>
                <!-- Blood Banks Table -->
                <DataTable
                  :value="network.bloodBankDetails"
                  :paginator="true"
                  :rows="5"
                  :paginatorTemplate="{
                    '420px': 'PrevPageLink CurrentPageReport NextPageLink',
                    default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
                  }"
                  responsiveLayout="scroll"
                  class="p-datatable-sm"
                  :rowClass="rowClass"
                  v-if="network.bloodBankDetails.length > 0"
                >
                  <Column field="id" header="ID" style="width: 10%"></Column>
                  <Column field="isInternal" header="Alcance" style="width: 10%">
                    <template #body="slotProps">{{ isInternalOptions.find((opt) => opt.value === slotProps.data.isInternal)?.label || '-' }} </template>
                  </Column>
                  <Column field="name" header="Nombre" style="width: 70%"></Column>
                </DataTable>
                <div v-else class="text-center py-4 text-gray-500">No hay bancos de sangre en esta red</div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>

          <!-- Networks Pagination -->
          <Paginator :rows="6" :totalRecords="networkCollaborationStore.totalRecords" v-model:first="first" template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" class="p-paginator-sm" />
        </div>
        <div v-else class="text-center py-8 text-gray-500">No se encontraron redes de banco de sangre asociadas con los filtros seleccionados</div>
      </div>
    </div>
    <!-- New/Edit Network Dialog -->
    <Dialog v-model:visible="networkDialog.visible" :header="networkDialog.isNew ? 'Nueva Red' : 'Editar Red'" :modal="true" class="w-full md:w-1/2">
      <div class="p-fluid">
        <div class="field mb-4">
          <label for="name" class="font-bold mb-2 block">Nombre</label>
          <InputText id="name" v-model="networkDialog.network.name" required="true" autofocus :class="{ 'p-invalid': networkDialog.submitted && !networkDialog.network.name }" />
          <small v-if="networkDialog.submitted && !networkDialog.network.name" class="p-error"> El nombre es requerido. </small>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="closeNetworkDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-success" @click="saveNetwork" />
      </template>
    </Dialog>

    <!-- Add Blood Bank Dialog -->
    <Dialog v-model:visible="bloodBankDialog.visible" header="Agregar Banco de Sangre" :modal="true" class="w-full md:w-1/2">
      <div class="p-fluid">
        <div class="field mb-4">
          <label for="bloodBankName" class="font-bold mb-2 block">Nombre del Banco de Sangre</label>
          <InputText id="bloodBankName" v-model="bloodBankDialog.bloodBank.name" required="true" autofocus :class="{ 'p-invalid': bloodBankDialog.submitted && !bloodBankDialog.bloodBank.name }" />
          <small v-if="bloodBankDialog.submitted && !bloodBankDialog.bloodBank.name" class="p-error"> El nombre es requerido. </small>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="closeBloodBankDialog" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-success" @click="saveBloodBank" />
      </template>
    </Dialog>
  </div>
</template>

<style>
.row-external {
  background-color: #fbd7d7 !important;
  color: #d70229 !important;
}
/* Any custom styles beyond Tailwind can go here */
.p-accordion .p-accordion-header .p-accordion-header-link {
  padding: 1rem;
}

.p-accordion .p-accordion-content {
  padding: 1.25rem;
}

/* Ensure proper spacing in mobile view */
@media (max-width: 640px) {
  .p-dialog {
    width: 90vw !important;
  }
}
</style>
