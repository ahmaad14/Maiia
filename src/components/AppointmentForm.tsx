import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addAppointment, getAppointments } from 'store/appointments';
import { getPatients } from 'store/patients';
import { getPractitioners } from 'store/practitioners';
import Form from './appointment/Form';

const AppointmentForm = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPractitioners());
    dispatch(getPatients());
    dispatch(getAppointments());
  }, []);
  const handleSubmit = (values) => {
    dispatch(addAppointment(values));
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} />
    </div>
  );
};

export default AppointmentForm;
