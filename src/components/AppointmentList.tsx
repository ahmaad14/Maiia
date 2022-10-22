import { Button, Dialog, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  appointmentSelectors,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from 'store/appointments';
import { practitionersSelectors } from 'store/practitioners';
import { formatDateRange } from 'utils/date';
import CustomTable from './CustomTable';
import Form from './appointment/Form';
import AppointmentFormValues from 'types/AppointmentFormValues';

import DeleteIcon from '@material-ui/icons/DeleteForever';
import UpdateIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles({
  dialogueContent: {
    padding: 20,
  },
  closeBtn: {
    marginTop: 10,
  },
});

const AppointmentList = () => {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateFormDefaultValues, setUpdateFormDefaultValues] = useState();
  const dispatch = useDispatch();
  const classes = useStyles();
  const appointments = useSelector((state) =>
    appointmentSelectors.selectAll(state.appointments),
  );
  const practioners = useSelector((state) => state.practitioners);
  useEffect(() => {
    dispatch(getAppointments());
  }, []);
  const getPractitionerName = (id) => {
    const practitioner = practitionersSelectors.selectById(practioners, id);
    return `${practitioner?.firstName} ${practitioner?.lastName}`;
  };
  const handleDelete = (id: number) => {
    dispatch(deleteAppointment(id));
  };
  const handleUpdate = (appointment: AppointmentFormValues) => {
    dispatch(updateAppointment(appointment));
    setOpenUpdateDialog(false);
  };

  return (
    <div>
      <CustomTable
        columns={[
          'Id',
          'Practitioner Name',
          'Practitioner Id',
          'Patient Id',
          'Date',
          'Actions',
        ]}
        rows={appointments.map((appointment) => [
          appointment.id,
          getPractitionerName(appointment.practitionerId),
          appointment.practitionerId,
          appointment.patientId,
          formatDateRange({
            from: appointment.startDate,
            to: appointment.endDate,
          }),
          <>
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(appointment.id)}
            />
            <Button
              startIcon={<UpdateIcon />}
              onClick={() => {
                setOpenUpdateDialog(true);
                setUpdateFormDefaultValues(appointment);
              }}
            />
          </>,
        ])}
      />
      <Dialog open={openUpdateDialog}>
        <div className={classes.dialogueContent}>
          <Form
            onSubmit={handleUpdate}
            defaultValues={updateFormDefaultValues}
          />
          <Button
            className={classes.closeBtn}
            fullWidth={true}
            variant="outlined"
            onClick={() => setOpenUpdateDialog(false)}
          >
            Close
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default AppointmentList;
