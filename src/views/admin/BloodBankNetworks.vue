<script setup>
import Accordion from 'primevue/accordion';
import AccordionContent from 'primevue/accordioncontent';
import AccordionHeader from 'primevue/accordionheader';
import AccordionPanel from 'primevue/accordionpanel';
import Button from 'primevue/button';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watchEffect } from 'vue';

// Services
const toast = useToast();

// State
const networks = ref([]);
const searchQuery = ref('');
const first = ref(0);
const networksPerPage = ref(6);
const name = ref('');

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

// Sample data for demonstration
onMounted(() => {
  // In a real application, this would be fetched from an API
  networks.value = [
    {
      id: 1,
      name: 'Red Nacional de Bancos de Sangre',
      bloodBanks: [
        { id: 1, name: 'Banco de Sangre Central' },
        { id: 2, name: 'Banco de Sangre Hospital General' }
      ]
    },
    {
      id: 2,
      name: 'Red Regional Norte',
      bloodBanks: [
        { id: 3, name: 'Banco de Sangre Hospital Norte' },
        { id: 4, name: 'Banco de Sangre Clínica San José' },
        { id: 24, name: 'Banco de Sangre Clínica San José' },
        { id: 41, name: 'Banco de Sangre Clínica San José' },
        { id: 40, name: 'Banco de Sangre Clínica San José' },
        { id: 42, name: 'Banco de Sangre Clínica San José' }
      ]
    },
    {
      id: 3,
      name: 'Red Regional Sur',
      bloodBanks: [{ id: 5, name: 'Banco de Sangre Hospital Sur' }]
    },
    {
      id: 4,
      name: 'Red de Clínicas Privadas',
      bloodBanks: [
        { id: 6, name: 'Banco de Sangre Clínica Santa María' },
        { id: 7, name: 'Banco de Sangre Clínica San Carlos' },
        { id: 8, name: 'Banco de Sangre Clínica La Esperanza' }
      ]
    },
    {
      id: 5,
      name: 'Red de Hospitales Universitarios',
      bloodBanks: [
        { id: 9, name: 'Banco de Sangre Hospital Universitario' },
        { id: 10, name: 'Banco de Sangre Facultad de Medicina' }
      ]
    },
    {
      id: 6,
      name: 'Red Internacional',
      bloodBanks: []
    }
  ];
});

// Computed properties
const filteredNetworks = computed(() => {
  if (!searchQuery.value) return networks.value;
  return networks.value.filter((network) => network.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const paginatedNetworks = computed(() => {
  const start = first.value;
  const end = Math.min(start + networksPerPage.value, filteredNetworks.value.length);
  return filteredNetworks.value.slice(start, end);
});

// Methods

const closeNetworkDialog = () => {
  networkDialog.value.visible = false;
  networkDialog.value.submitted = false;
};

const saveNetwork = () => {
  networkDialog.value.submitted = true;

  if (networkDialog.value.network.name.trim()) {
    if (networkDialog.value.isNew) {
      // Generate a new ID (in a real app, this would be handled by the backend)
      const newId = Math.max(0, ...networks.value.map((n) => n.id)) + 1;
      networks.value.push({
        id: newId,
        name: networkDialog.value.network.name,
        bloodBanks: []
      });
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Red creada', life: 3000 });
    } else {
      // Find and update the existing network
      const index = networks.value.findIndex((n) => n.id === networkDialog.value.network.id);
      if (index !== -1) {
        networks.value[index].name = networkDialog.value.network.name;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Red actualizada', life: 3000 });
      }
    }
    closeNetworkDialog();
  }
};

const closeBloodBankDialog = () => {
  bloodBankDialog.value.visible = false;
  bloodBankDialog.value.submitted = false;
};

const saveBloodBank = () => {
  bloodBankDialog.value.submitted = true;

  if (bloodBankDialog.value.bloodBank.name.trim()) {
    const network = networks.value.find((n) => n.id === bloodBankDialog.value.network.id);
    if (network) {
      // Generate a new ID (in a real app, this would be handled by the backend)
      const newId = Math.max(0, ...network.bloodBanks.map((b) => b.id), ...networks.value.flatMap((n) => n.bloodBanks.map((b) => b.id))) + 1;

      network.bloodBanks.push({
        id: newId,
        name: bloodBankDialog.value.bloodBank.name
      });

      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Banco de sangre agregado', life: 3000 });
      closeBloodBankDialog();
    }
  }
};

const preventCollapse = () => {
  setTimeout(() => {
    activeIndexes.value = networks.value.map((network) => network.id);
  }, 0);
};
const activeIndexes = ref([]);

watchEffect(() => {
  if (networks.value.length > 0) {
    activeIndexes.value = networks.value.map((network) => network.id);
  }
});
</script>

<template>
  <div class="network-container | p-4 mx-auto card">
    <div class="network-title | mb-4">
      <h3>Administración de Redes de Bancos de Sangre</h3>
    </div>

    <!-- Search and Add Network Controls -->
    <div class="flex flex-col md:flex-row gap-2 md:gap-4 mb-6">
      <div class="network-filters | flex flex-wrap gap-2 w-full md:w-[50%] mb-2 md:mb-0">
        <div class="network-filter | w-full">
          <FloatLabel variant="on" class="w-full">
            <InputText class="w-full" id="name" v-model="name" aria-describedby="username-help" />
            <label for="name">Nombre</label>
          </FloatLabel>
        </div>
      </div>
      <div class="bloodbank-filters-buttons mb-4 w-full md:w-[50%] flex flex-col md:flex-row md:grow gap-1 items-center">
        <Button class="h-8 w-full md:w-[30%]" label="Buscar" severity="info" />
        <Button class="h-8 w-full md:w-[30%] md:max-w-[16rem] md:min-w-[9rem]" label="Nueva Red" icon="pi pi-plus" severity="success" />
      </div>
    </div>

    <!-- Networks Accordion -->
    <div v-if="filteredNetworks.length > 0">
      <Accordion :value="activeIndexes" @update:value="preventCollapse" multiple class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4" :expandIcon="''" :collapseIcon="''">
        <template #expandicon></template>
        <template #collapseicon></template>
        <AccordionPanel v-for="network in paginatedNetworks" :key="network.id" :value="network.id" class="transition-transform duration-300">
          <AccordionHeader>
            <div class="flex items-center justify-between w-full">
              <div class="flex" @click.stop>
                <span>{{ network.name }}</span>
              </div>
              <div class="flex ml-1" @click.stop>
                <Button class="h-8 btn-view" label="Visualizar" tooltip="Editar nombre" />
              </div>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <!-- Blood Banks Table -->
            <DataTable
              :value="network.bloodBanks"
              :paginator="true"
              :rows="5"
              :paginatorTemplate="{
                '420px': 'PrevPageLink CurrentPageReport NextPageLink',
                default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
              }"
              responsiveLayout="scroll"
              class="p-datatable-sm"
              v-if="network.bloodBanks.length > 0"
            >
              <Column field="id" header="ID" style="width: 10%"></Column>
              <Column field="name" header="Nombre" style="width: 70%"></Column>
            </DataTable>
            <div v-else class="text-center py-4 text-gray-500">No hay bancos de sangre en esta red</div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>

      <!-- Networks Pagination -->
      <Paginator
        :rows="networksPerPage"
        :totalRecords="filteredNetworks.length"
        v-model:first="first"
        :rowsPerPageOptions="[6, 10, 20]"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        class="p-paginator-sm"
      />
    </div>
    <div v-else class="text-center py-8 text-gray-500">No se encontraron redes de banco de sangre</div>

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

    <!-- Confirmation Dialog -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<style>
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
