import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const timeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('reservationTimeStart')?.value;
  const end = control.get('reservationTimeEnd')?.value;

  if (!start || !end) {
    return null; // Otro validador se encargará
  }

  // Convertir HH:mm a minutos absolutos
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  return startMinutes < endMinutes ? null : { timeRangeInvalid: true };
};
