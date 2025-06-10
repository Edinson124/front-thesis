<script setup>
import { ref } from 'vue';
import ConfirmModal from '@/components/utils/ConfirmModal.vue';

const showConfirmLink = ref(false);
const bloodBankSelected = ref(null);

const showModal = defineModel({ type: Boolean, required: true });
defineProps({
  bloodBanks: Array,
  loading: Boolean,
  currentPage: Number,
  totalRecords: Number,
  idsInNetwork: Array
});

const emit = defineEmits(['selected', 'search', 'changePage']);

const textSearch = ref('');

const close = () => {
  showModal.value = false;
};

const openModalConfirm = (bloodbank) => {
  bloodBankSelected.value = bloodbank;
  showConfirmLink.value = true;
};
const saveLink = () => {
  emit('selected', bloodBankSelected.value);
  bloodBankSelected.value = null;
  close();
};

const search = () => {
  emit('search', textSearch.value);
};

const onPage = (event) => {
  emit('changePage', event.page);
};
</script>
<template>
  <Dialog v-model:visible="showModal" modal header="Añadir banco de sangre" class="banco-sangre-modal h-[88%] w-[850px]">
    <div class="p-4">
      <!-- Búsqueda -->
      <div class="flex flex-wrap gap-2 mb-4">
        <FloatLabel variant="on">
          <InputText id="name" v-model="textSearch" class="w-64 mr-2" />
          <label for="name">Nombre</label>
        </FloatLabel>
        <Button label="Buscar" severity="info" @click="search" class="min-w-28" />
      </div>

      <!-- Tabla con paginador -->
      <DataTable :value="bloodBanks" :loading="loading" paginator :rows="6" :totalRecords="totalRecords" @page="onPage" lazy class="mb-2">
        <Column field="id" header="ID" style="width: 10%" />
        <Column field="name" header="Banco de sangre" style="width: 45%" />
        <Column header="Ubicación" style="width: 35%">
          <template #body="slotProps"> {{ slotProps.data.region }} / {{ slotProps.data.province }} / {{ slotProps.data.district }} </template>
        </Column>
        <Column header="Acciones" style="width: 10%">
          <template #body="{ data }">
            <Button v-if="!idsInNetwork.includes(data.id)" label="Seleccionar" class="h-8 btn-view" @click="openModalConfirm(data)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </Dialog>
  <ConfirmModal id="linkBloodBankDialog" v-model="showConfirmLink" header="¿Estás seguro de vincular este banco de sangre a la red?" accept-text="Guardar" @accept="saveLink" />
</template>
