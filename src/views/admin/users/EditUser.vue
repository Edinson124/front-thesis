<script setup>
import InputPhone from '@/components/utils/InputPhone.vue';
import { Cities, Districts, Regions } from '@/enums/Locations';
import { computed, reactive, ref } from 'vue';

const info = reactive({
  id_type: '',
  id_number: '',
  first_names: '',
  last_name: '',
  second_last_name: '',
  birthday: null,
  email: '',
  phone: '',
  region: '',
  city: '',
  district: '',
  status: '',
  blood_bank: '',
  blood_bank_role: ''
});

function calculateAge(birthday) {
  const today = new Date();
  const birthDate = new Date(birthday);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += lastDayOfMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

const years = computed(() => {
  if (!info.birthday) return '';
  const age = calculateAge(info.birthday);
  return `${age.years} años ${age.months} meses ${age.days} días`;
});

const maxDate = ref(new Date());
</script>

<template>
  <div class="card">
    <div class="page-title | mb-8">
      <h3>Registro de nuevo usuario</h3>
    </div>
    <Fluid>
      <div class="flex flex-col md:flex-row gap-8 mb-8 md:mb-0">
        <div class="md:w-1/5">
          <div class="flex flex-col justify-center w-full gap-4 mb-8">
            <Image class="w-full aspect-square" alt="Image">
              <template #image>
                <img class="w-full object-cover aspect-square" src="/src/assets/images/profile.png" alt="Image" />
              </template>
            </Image>
            <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Editar Imagen" severity="info" />
          </div>
          <Message severity="error">
            <div class="flex flex-col">
              <h5 class="text-inherit text-center mb-6">Reestablecimiento de contraseña</h5>
              <span class="flex justify-center items-center gap-4 mb-6">
                <span class="p-message-icon pi pi-exclamation-triangle" data-pc-section="icon"> </span>
                <span>Se enviaará una contraseña generada al correro registrado del usuario, podrá cambiarla al ingresar</span>
              </span>
              <Button class="h-8 w-full md:mr-2 mb-2 md:mb-0" label="Enviar contraseña" severity="danger" />
            </div>
          </Message>
        </div>
        <div class="md:grow">
          <div class="flex flex-col gap-4 w-full | mb-8">
            <div class="font-semibold text-xl">Información personal</div>
            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-2 md:mb-0">
                <Select id="id_type" v-model="info.id_type" :options="[]" optionLabel="label" optionValue="value" showClear />
                <label for="id_type">Tipo Documento</label>
              </FloatLabel>
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputText id="id_number" v-model="info.id_number" aria-describedby="dni number" />
                <label for="id_number">Nro Documento</label>
              </FloatLabel>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputText id="first_names" v-model="info.first_names" aria-describedby="nombres" />
                <label for="first_names">Nombres</label>
              </FloatLabel>

              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputText id="last_name" v-model="info.last_name" aria-describedby="apellido paterno" />
                <label for="last_name">Apellido paterno</label>
              </FloatLabel>

              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputText id="second_last_name" v-model="info.second_last_name" aria-describedby="apellido materno" />
                <label for="second_last_name">Apellido materno</label>
              </FloatLabel>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-2 md:mb-0">
                <DatePicker id="birthday" v-model="info.birthday" showIcon iconDisplay="input" dateFormat="dd/mm/yy" :maxDate="maxDate" />
                <label for="birthday">Fecha de nacimiento</label>
              </FloatLabel>

              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-2 md:mb-0">
                <InputText id="years" v-model="years" aria-describedby="edad" disabled />
                <label for="years">Edad</label>
              </FloatLabel>
            </div>

            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <InputText id="email" v-model="info.email" aria-describedby="email" />
                <label for="email">Email</label>
              </FloatLabel>

              <InputPhone class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0" id="phone" label="Teléfono" code_label="Código" v-model="info.phone" />
            </div>

            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <Select id="id_type" v-model="info.region" :options="Regions" optionLabel="name" optionValue="id" showClear filter />
                <label for="id_type">Departamento</label>
              </FloatLabel>

              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <Select id="id_type" v-model="info.city" :options="Cities" optionLabel="name" optionValue="id" showClear filter />
                <label for="id_type">Provincia</label>
              </FloatLabel>

              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <Select id="id_type" v-model="info.district" :options="Districts" optionLabel="name" optionValue="id" showClear filter />
                <label for="id_type">Distrito</label>
              </FloatLabel>
            </div>

            <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:mb-0">
              <InputText id="email" v-model="info.email" aria-describedby="email" />
              <label for="email">Dirección</label>
            </FloatLabel>

            <div class="grid grid-cols-12 gap-4">
              <FloatLabel variant="on" class="w-full col-span-12 mb-2 md:col-span-4 md:mb-0">
                <Select id="id_type" v-model="info.status" :options="[]" optionLabel="label" optionValue="value" disabled />
                <label for="id_type">Estado</label>
              </FloatLabel>
            </div>
          </div>
          <div class="flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Lugar de trabajo</div>
            <div class="grid grid-cols-12 gap-2">
              <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Banco de sangre donde trabaja</label>
              <div class="col-span-12 md:col-span-4">
                <Select class="" v-model="info.blood_bank" :options="[]" optionLabel="label" optionValue="value" showClear />
              </div>
            </div>
            <div class="grid grid-cols-12 gap-2">
              <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0">Rol que desempeña</label>
              <div class="col-span-12 md:col-span-4">
                <Select class="" v-model="info.blood_bank_role" :options="[]" optionLabel="label" optionValue="value" showClear />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fluid>
    <div class="w-full flex items-denter justify-end mb-4 gap-4">
      <Button class="min-w-40" label="Cancelar" text />
      <Button class="min-w-40 p-button-success" label="Guardar" />
    </div>
  </div>
</template>
