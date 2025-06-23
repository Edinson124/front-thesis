<script setup>
import BloodStockCards from '@/components/interoperability/BloodStockCards.vue';
import ConfirmModal from '@/components/utils/ConfirmModal.vue';
import ErrorModal from '@/components/utils/ErrorModal.vue';
import SuccessModal from '@/components/utils/SuccessModal.vue';
import { useStockInteroperabilityStore } from '@/stores/interoperability/stockInteroperability';
import { onMounted, ref } from 'vue';

const stockInteroperabilityStore = useStockInteroperabilityStore();

// Variables reactivas
const networkSelected = ref(null);
const stockResult = ref([]);

const bloodBankSelected = ref(null);
const bloodBanksOption = ref([]);
const loadingNetwork = ref(false);

const loadingGetStock = ref(false);
const showConfirmGetStockModal = ref(false);
const showSuccessGetStockModal = ref(false);
const showErrorGetStockModal = ref(false);

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

const getStockExternal = async () => {
  loadingGetStock.value = true;

  try {
    const response = await stockInteroperabilityStore.getStockInteroperability(bloodBankSelected.value.id);
    if (response) {
      stockResult.value = response;
      showSuccessGetStockModal.value = true;
    } else {
      stockResult.value = null;
      showErrorGetStockModal.value = true;
    }
    console.log(response);
  } catch (error) {
    console.error(error);
    showErrorGetStockModal.value = true;
  } finally {
    loadingGetStock.value = false;
  }
};

const closeSuccesGetStockModal = () => {
  showSuccessGetStockModal.value = false;
};

const handleGet = async (bloodBankExternal) => {
  bloodBankSelected.value = bloodBankExternal;
  showConfirmGetStockModal.value = true;
};

onMounted(async () => {
  loadingNetwork.value = true;
  await stockInteroperabilityStore.getNetworkToInteroperability();
  loadingNetwork.value = false;
});
</script>
<template>
  <div class="card">
    <h1 class="text-2xl font-bold mb-6">Consultar stock de bancos externos</h1>

    <!-- Campos de Red y Banco de sangre -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <FloatLabel variant="on">
          <Select v-model="networkSelected" :options="stockInteroperabilityStore.networkOptions" optionLabel="name" id="network" class="w-full" :loading="loadingNetwork" showClear @change="onNetworkChange" />
          <label for="network">Red</label>
        </FloatLabel>
      </div>
    </div>

    <!-- LISTADO EN TABLA-->
    <div class="bloodbanks-table mt-8">
      <DataTable :value="bloodBanksOption" tableStyle="min-width: 50rem" paginator :rows="3" :totalRecords="bloodBanksOption.length" showGridlines :currentPageReportTemplate="'{currentPage} de {totalPages}'">
        <template #empty>
          <p class="text-gray-600 text-lg py-4">No encontramos coincidencias. Intenta con otros términos o ajusta los filtros.</p>
        </template>

        <Column field="id" header="Código" style="width: 5%" />
        <Column field="name" header="Nombre" style="width: 20%" />
        <Column field="address" header="Dirección" style="width: 22%" />
        <Column field="ubication" header="Ubicación" style="width: 22%" />
        <Column field="type" header="Tipo" style="width: 10%" />
        <Column header="Acciones">
          <template #body="slotProps">
            <div class="flex flex-wrap w-full justify-center">
              <Button v-if="slotProps.data.canConnect" class="h-8 w-[6rem] my-1 !bg-blue-700 hover:!bg-blue-800 text-white" label="Consultar" @click="handleGet(slotProps.data)" />
              <span v-else class="text-gray-500 text-sm">No Disponible</span>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Resultado de Stock: cards o mensaje de no disponibilidad -->
    <div class="text-xl font-bold mt-6">Resultado de consulta</div>
    <div class="mt-6">
      <BloodStockCards :data="stockResult" />
    </div>
  </div>
  <ConfirmModal
    id="confirmGetStockExternal"
    v-model="showConfirmGetStockModal"
    severity="warn"
    header="Consultar stock de banco de sangre externo"
    :message="`¿Estás seguro de consultar el stock de este banco de sangre?`"
    :moreMessage="`Esta acción puede tardar algunos minutos`"
    accept-text="Consultar"
    @accept="getStockExternal"
  />

  <SuccessModal v-model="showSuccessGetStockModal" message="La consulta ha sido realizada con exito" @close="closeSuccesGetStockModal" />
  <ErrorModal v-model="showErrorGetStockModal" />

  <Dialog v-model:visible="loadingGetStock" modal :closable="false" header=" ">
    <div class="flex flex-col items-center p-4">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="6" />
      <p class="mt-3">Consultando stock, por favor espere…</p>
    </div>
  </Dialog>
</template>
