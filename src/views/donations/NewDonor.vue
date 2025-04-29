<script setup>
import { ref } from 'vue';

// Datos del formulario
const tipoDocumento = ref(null);
const nroDocumento = ref('');
const nombres = ref('');
const apellidoPaterno = ref('');
const apellidoMaterno = ref('');
const fechaNacimiento = ref('');
const edad = ref('');
const sexo = ref(null);
const lugarNacimiento = ref('');
const procedencia = ref('');
const departamento = ref('');
const provincia = ref('');
const distrito = ref(null);
const domicilio = ref('');
const ocupacion = ref('');
const estadoCivil = ref(null);
const email = ref('');
const telefono = ref('');
const viajes = ref('');

// Opciones para los dropdowns
const tiposDocumento = ref([
  { name: 'DNI', code: 'dni' },
  { name: 'Pasaporte', code: 'pasaporte' },
  { name: 'Carnet de Extranjería', code: 'carnet' }
]);

const sexoOptions = ref([
  { name: 'Masculino', code: 'M' },
  { name: 'Femenino', code: 'F' },
  { name: 'Otro', code: 'O' }
]);

const estadoCivilOptions = ref([
  { name: 'Soltero(a)', code: 'soltero' },
  { name: 'Casado(a)', code: 'casado' },
  { name: 'Viudo(a)', code: 'viudo' },
  { name: 'Divorciado(a)', code: 'divorciado' }
]);
</script>

<template>
  <div class="card">
    <div class="border border-gray-300 rounded-md p-5 bg-white">
      <h2 class="text-lg font-semibold border-b pb-2 mb-4">Datos generales</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div class="flex">
            <div class="flex justify-center items-center">
              <label class="block mb-1 mr-4">Identificación:</label>
            </div>
            <span class="w-full mr-2">
              <FloatLabel variant="on">
                <Dropdown v-model="tipoDocumento" :options="tiposDocumento" optionLabel="name" id="tipo_documento" class="w-full" />
                <label for="tipo_documento">Tipo Documento</label>
              </FloatLabel>
            </span>
          </div>
        </div>
        <div>
          <div class="flex">
            <span class="w-full mr-2">
              <FloatLabel variant="on">
                <InputText v-model="nroDocumento" id="nro_documento" class="w-full" />
                <label for="nro_documento">Nro Documento</label>
              </FloatLabel>
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <InputText v-model="nombres" id="nombres" class="w-full" />
            <label for="nombres">Nombres</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on">
            <InputText v-model="apellidoPaterno" id="apellido_paterno" class="w-full" />
            <label for="apellido_paterno">Apellido Paterno</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on">
            <InputText v-model="apellidoMaterno" id="apellido_materno" class="w-full" />
            <label for="apellido_materno">Apellido Materno</label>
          </FloatLabel>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div class="p-inputgroup">
            <span class="w-full">
              <FloatLabel variant="on">
                <DatePicker id="fecha_nacimiento" class="w-full" v-model="fechaNacimiento" showIcon fluid />
                <label for="fecha_nacimiento">Fecha nacimiento</label>
              </FloatLabel>
            </span>
          </div>
        </div>
        <div>
          <FloatLabel variant="on">
            <InputText v-model="edad" id="edad" class="w-full" />
            <label for="edad">Edad</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on">
            <Dropdown v-model="sexo" :options="sexoOptions" optionLabel="name" id="sexo" class="w-full" />
            <label for="sexo">Sexo</label>
          </FloatLabel>
        </div>
      </div>

      <div class="mb-4">
        <FloatLabel variant="on">
          <InputText v-model="lugarNacimiento" id="lugar_nacimiento" class="w-full" />
          <label for="lugar_nacimiento">Lugar de Nacimiento</label>
        </FloatLabel>
      </div>

      <div class="mb-4">
        <FloatLabel variant="on">
          <InputText v-model="procedencia" id="procedencia" class="w-full" />
          <label for="procedencia">Procedencia</label>
        </FloatLabel>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <InputText v-model="departamento" id="departamento" class="w-full" />
            <label for="departamento">Departamento</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on">
            <InputText v-model="provincia" id="provincia" class="w-full" />
            <label for="provincia">Provincia</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on">
            <Dropdown v-model="distrito" :options="distritoOptions" optionLabel="name" id="distrito" class="w-full" />
            <label for="distrito">Distrito</label>
          </FloatLabel>
        </div>
      </div>

      <div class="mb-4">
        <FloatLabel variant="on">
          <InputText v-model="domicilio" id="domicilio" class="w-full" />
          <label for="domicilio">Domicilio</label>
        </FloatLabel>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <InputText v-model="ocupacion" id="ocupacion" class="w-full" />
            <label for="ocupacion">Ocupación</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on">
            <Dropdown v-model="estadoCivil" :options="estadoCivilOptions" optionLabel="name" id="estado_civil" class="w-full" />
            <label for="estado_civil">Estado civil</label>
          </FloatLabel>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <FloatLabel variant="on">
            <InputText v-model="email" id="email" class="w-full" />
            <label for="email">Email</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel variant="on">
            <InputText v-model="telefono" id="telefono" class="w-full" />
            <label for="telefono">Teléfono</label>
          </FloatLabel>
        </div>
      </div>

      <div class="mb-4">
        <FloatLabel variant="on">
          <Textarea v-model="viajes" id="viajes" rows="5" class="w-full" />
          <label for="viajes">Viajes</label>
        </FloatLabel>
      </div>
    </div>

    <div class="flex justify-end mt-4 gap-2">
      <Button label="Cancelar" class="p-button-secondary" />
      <Button label="Guardar" class="p-button-success" />
    </div>
  </div>
</template>
