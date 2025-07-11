<script setup>
import globalVariablesService from '@/services/admin/globalVariables';
import { useConfirm } from 'primevue';
import { computed, onMounted, ref } from 'vue';

const confirm = useConfirm();

const groupedVariables = ref({});
const initialValues = ref(null);
const showModal = ref(false);
const variableSelected = ref(null);
const variableInitialSelected = ref(null);

const showConfirmDialog = () => {
  confirm.require({
    group: 'edit',
    header: 'Confirmar edición',
    message: '',
    accept: confirmEdition,
    reject: cancelEdition
  });
};

// Llamamos a la API cuando el componente se monta
const getVariables = async () => {
  try {
    const response = await globalVariablesService.getGroupedGlobalVariables();
    groupedVariables.value = response.groupedVariables;
  } catch (error) {
    console.error('Error obteniendo variables:', error);
  }
};

onMounted(async () => {
  await getVariables();
  initialValues.value = Object.values(groupedVariables.value)
    .flat()
    .reduce((acc, { id, value }) => {
      acc[id] = value;
      return acc;
    }, {});
});

// Computed para obtener los nombres de los grupos
const groupNames = computed(() => Object.keys(groupedVariables.value));

// Función para abrir el modal y almacenar la variable seleccionada
const edit = (item) => {
  if (item.value.toString() !== initialValues.value[item.id].toString()) {
    variableSelected.value = item;
    variableInitialSelected.value = initialValues.value[item.id];
    showConfirmDialog();
  }
};

// Función para confirmar la edición
const confirmEdition = async () => {
  try {
    await globalVariablesService.updateVariable(variableSelected.value.id, variableSelected.value.value);

    // Actualizar valores locales después de la actualización exitosa
    initialValues.value[variableSelected.value.id] = variableSelected.value.value;
    showModal.value = false;
  } catch (error) {
    console.error('Error en la actualización:', error);
  }
};

const cancelEdition = () => {
  variableSelected.value.value = initialValues.value[variableSelected.value.id];
  showModal.value = false;
};
</script>
<template>
  <div class="card">
    <div class="users-title | mb-8">
      <h3>Configuración de variables</h3>
    </div>
    <Tabs value="0">
      <TabList>
        <Tab v-for="(groupName, index) in groupNames" :key="groupName" :value="index.toString()">
          {{ groupName }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="(groupName, index) in groupNames" :key="groupName" :value="index.toString()">
          <div class="pt-4 w-full lg:w-[65%]">
            <div v-for="item in groupedVariables[groupName]" :key="item.id" class="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 mb-3">
              <div class="w-full md:w-[55%]">
                <label>{{ item.name }}</label>
              </div>
              <div class="flex flex-wrap sm:flex-nowrap w-full md:w-[40%] gap-2">
                <div class="w-full md:w-[80%]">
                  <InputNumber v-model="item.value" inputId="time" suffix=" días" class="w-full" :useGrouping="false" />
                </div>
                <div class="w-full md:w-[25%] flex justify-end">
                  <Button label="Editar" class="px-3 py-1 btn-edit h-8 rounded-md w-full md:w-auto" @click="edit(item)" />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <!-- MODAL DE CONFIRMACIÓN -->
    <!-- <Dialog v-model:visible="showModal" :modal="true" :closable="false" header="Confirmar edición">
      <p>
        ¿Está seguro que desea modificar el valor de <b>{{ variableSelected?.name }}</b
        >?
      </p>
      <p>
        Valor actual: <b>{{ variableInitialSelected }} días</b>
      </p>
      <p>
        Nuevo valor: <b>{{ variableSelected?.value }} días</b>
      </p>
      <div class="flex justify-end mt-4 gap-2">
        <Button label="Cancelar" class="btn-clean" @click="cancelEdition" />
        <Button label="Confirmar" severity="success" @click="confirmEdition" />
      </div>
    </Dialog> -->
    <ConfirmDialog group="edit">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-primary text-white inline-flex justify-center items-center h-24 w-24 -mt-20">
            <i class="pi pi-question !text-4xl"></i>
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">Confirmar edición</span>
          <p>
            ¿Está seguro que desea modificar el valor de <b>{{ variableSelected?.name + message }}</b
            >?
          </p>
          <p>
            Valor actual: <b>{{ variableInitialSelected }} días</b>
          </p>
          <p>
            Nuevo valor: <b>{{ variableSelected?.value }} días</b>
          </p>
          <div class="flex justify-center mt-6 gap-2">
            <Button label="Cancelar" class="btn-clean" @click="rejectCallback" />
            <Button label="Confirmar" severity="success" @click="acceptCallback" />
          </div>
        </div>
      </template>
    </ConfirmDialog>
  </div>
</template>
