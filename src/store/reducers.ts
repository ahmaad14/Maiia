import timeslots from './timeslots';
import practitioners from './practitioners';
import patients from './patients';
import appointments from './appointments';
import availabilities from './availabilities';

export default {
  timeslots: timeslots.reducer,
  practitioners: practitioners.reducer,
  patients: patients.reducer,
  appointments: appointments.reducer,
  availabilities: availabilities.reducer,
};
