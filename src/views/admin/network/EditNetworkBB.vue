<script setup>
import SelectBloodBankModal from '@/components/network/SelectBloodBankModal.vue';
import { useNetworkStore } from '@/stores/admin/network';
import { required } from '@/validation/validators';
import useVuelidate from '@vuelidate/core';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Services
const networkStore = useNetworkStore();
const router = useRouter();
const route = useRoute();

const isNewNetwork = ref(true);
const showSelectedBBModal = ref(false);
const loadingModal = ref(false);
const currentSearchModal = ref('');

// Variables reactivas
const networkBB = reactive({
  name: '',
  description: '',
  idBloodBanks: []
});

const rules = computed(() => ({
  name: { required: required('Nombre') }
}));
const v$ = useVuelidate(rules, networkBB);

const bloodBankInNetwork = ref([]);
const idBloodBanks = ref([]);

const showConfirmUnlinkModal = ref(false);
const bloodBankDelete = ref(null);

const unlinkShowModal = (banco) => {
  bloodBankDelete.value = banco;
  showConfirmUnlinkModal.value = true;
};

const showModalSelectBB = async () => {
  await networkStore.getBloodBanksOptionsAddNetwork();
  showSelectedBBModal.value = true;
};

const addBloodBank = (banco) => {
  const yaExiste = idBloodBanks.value.includes(banco.id);
  if (!yaExiste) {
    // Fecha actual
    const hoy = new Date();
    const fechaFormateada = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;

    // Agregar a la lista de bancos asociados
    bloodBankInNetwork.value.push({
      ...banco,
      fechaAsociacion: fechaFormateada
    });
    idBloodBanks.value.push(banco.id);
  }

  // Cerrar el modal
  showSelectedBBModal.value = false;
};

const deletedBloodBank = () => {
  if (!bloodBankDelete.value) return;

  const id = bloodBankDelete.value.id;

  // Filtrar ambos arreglos
  bloodBankInNetwork.value = bloodBankInNetwork.value.filter((b) => b.id !== id);
  idBloodBanks.value = idBloodBanks.value.filter((i) => i !== id);

  // Cerrar modal
  showConfirmUnlinkModal.value = false;
  bloodBankDelete.value = null;
};

const onChangePage = (page) => {
  networkStore.getBloodBanksOptionsAddNetwork({ name: currentSearchModal.value }, page);
};

const onSearch = (term) => {
  currentSearchModal.value = term;
  networkStore.getBloodBanksOptionsAddNetwork({ name: term }, 0);
};
const handleSave = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  networkBB.idBloodBanks = bloodBankInNetwork.value.map((bank) => bank.id);

  const saveMethod = isNewNetwork.value ? networkStore.newNetwork : networkStore.editNetwork;
  const success = await saveMethod(networkBB);
  if (success) {
    router.push('/admin/network');
  }
};
onMounted(async () => {
  await networkStore.getBloodBanksOptionsAddNetwork();
  const networkId = route.params.id;
  if (networkId) {
    isNewNetwork.value = false;
    const networkResponse = await networkStore.getNetworkById(networkId);
    Object.assign(networkBB, { ...networkBB, ...networkResponse });
    bloodBankInNetwork.value = networkResponse.bloodBanks || [];
    idBloodBanks.value = bloodBankInNetwork.value.map((bank) => bank.id);
  }
});
</script>
<template>
  <div class="card">
    <h1 class="text-2xl font-bold mb-4">Red de banco de sangre</h1>

    <!-- Campo de nombre -->
    <div class="mb-6">
      <FloatLabel variant="on">
        <InputText v-model="networkBB.name" id="name" class="w-full md:w-[80%]" :invalid="v$.name?.$error" />
        <label for="name">Nombre</label>
      </FloatLabel>
      <Message v-if="v$.name?.$error" severity="error" size="small" variant="simple" class="pt-1">{{ v$.name.$errors[0].$message }}</Message>
    </div>
    <div class="mb-6">
      <FloatLabel variant="on">
        <Textarea v-model="networkBB.description" id="description" class="w-full md:w-[80%] resize-none" />
        <label for="description">Descripción</label>
      </FloatLabel>
    </div>

    <!-- Sección de bancos asociados -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-lg font-medium">Bancos de sangre asociado</h2>
        <Button label="Añadir Banco" icon="pi pi-plus" class="p-button-success" @click="showModalSelectBB()" />
      </div>

      <DataTable :value="bloodBankInNetwork" class="p-datatable-sm" responsiveLayout="scroll" stripedRows :rowHover="true">
        <Column field="id" header="ID" style="width: 10%"></Column>
        <Column field="name" header="Banco de sangre" style="width: 40%"></Column>
        <Column field="fechaAsociacion" header="Fecha de asociación" style="width: 25%"></Column>
        <Column header="Acciones" style="width: 25%">
          <template #body="slotProps">
            <Button label="Desvincular" class="p-button-danger p-button-sm" @click="unlinkShowModal(slotProps.data)" />
          </template>
        </Column>
        <template #empty>
          <p class="text-gray-600 text-lg py-4">No hay bancos de sangre asociados</p>
        </template>
      </DataTable>
    </div>

    <!-- Botones de acción -->
    <div class="w-full flex items-denter justify-end mb-4 gap-4">
      <Button class="min-w-40 btn-clean" label="Cancelar" @click.prevent="router.back()" />
      <Button class="min-w-40 p-button-success" label="Guardar" @click="handleSave()" />
    </div>

    <SelectBloodBankModal
      v-model="showSelectedBBModal"
      :bloodBanks="networkStore.bloodBanksOptions"
      :currentPage="networkStore.currentPageBloodBanks"
      :totalRecords="networkStore.totalRecordsBloodBanks"
      :loading="loadingModal"
      :idsInNetwork="idBloodBanks"
      @selected="addBloodBank"
      @changePage="onChangePage"
      @search="onSearch"
    />

    <Dialog v-model:visible="showConfirmUnlinkModal" modal header="Confirmar desvinculación" :style="{ width: '400px' }">
      <div class="p-4">
        <p>
          ¿Estás seguro que deseas desvincular el banco <strong>{{ bloodBankDelete?.nombre }}</strong
          >?
        </p>

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" severity="secondary" @click="showConfirmUnlinkModal = false" />
          <Button label="Desvincular" severity="danger" @click="deletedBloodBank" />
        </div>
      </div>
    </Dialog>
  </div>
</template>
