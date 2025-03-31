import * as v from '@vuelidate/validators';

export const required = (fieldName) => v.helpers.withMessage(`El campo "${fieldName}" es obligatorio`, v.required);

export const requiredIf = (fieldName, condition) => v.helpers.withMessage(`El campo "${fieldName}" es obligatorio`, v.requiredIf(condition));

export const email = (fieldName) => v.helpers.withMessage(`"${fieldName}" no es un correo válido`, v.email);

export const numeric = (fieldName) => v.helpers.withMessage(`"${fieldName}" debe contener solo números`, v.numeric);

export const minLength = (fieldName, length) => v.helpers.withMessage(`"${fieldName}" debe tener al menos ${length} caracteres`, v.minLength(length));

export const maxLength = (fieldName, length) => v.helpers.withMessage(`"${fieldName}" no puede exceder ${length} caracteres`, v.maxLength(length));
