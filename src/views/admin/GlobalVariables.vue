<script setup>
import { Button, InputNumber, Tab, TabList, TabPanel, TabPanels, Tabs } from 'primevue';
import { reactive } from 'vue';

const vidaUtil = reactive([
  { id: 1, label: 'Vida útil de Sangre Total', value: '' },
  { id: 2, label: 'Vida útil de Concentrado de eritrocitos (CE)', value: '' },
  { id: 3, label: 'Vida útil de Plasma Fresco Congelado', value: '' },
  { id: 4, label: 'Vida útil de Crioprecipitados', value: '' },
  { id: 5, label: 'Vida útil de Plaquetas', value: '' },
  { id: 6, label: 'Vida útil de Aféresis de Plaquetas', value: '' },
  { id: 7, label: 'Vida útil de Aféresis de Glóbulos Rojos', value: '' },
  { id: 8, label: 'Vida útil de Aféresis de Plasma', value: '' }
]);
</script>
<template>
  <div class="card">
    <div class="users-title | mb-8">
      <h3>Configuración de variables</h3>
    </div>
    <Tabs value="0">
      <TabList>
        <Tab value="0">Vida útil de unidades</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div class="pt-4 w-full lg:w-[65%]">
            <div v-for="item in vidaUtil" :key="item.id" class="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 mb-3">
              <div class="w-full md:w-[55%]">
                <label>{{ item.label }}</label>
              </div>
              <div class="flex flex-wrap sm:flex-nowrap w-full md:w-[40%] gap-2">
                <div class="w-full md:w-[80%]">
                  <InputNumber v-model="item.value" inputId="time" suffix=" días" class="w-full" :useGrouping="false" />
                </div>
                <div class="w-full md:w-[25%] flex justify-end">
                  <Button label="Editar" class="px-3 py-1 btn-edit h-8 rounded-md w-full md:w-auto" @click="editar(item)" />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
