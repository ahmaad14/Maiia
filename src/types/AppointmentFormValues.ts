type AppointmentFormValues = {
  id?: number;
  practitionerId: number;
  patientId: number;
  availabilityId?: number;
  startDate: string;
  endDate: string;
};

export default AppointmentFormValues;
