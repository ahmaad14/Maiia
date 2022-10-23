import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  appointmentSelectors,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from 'store/appointments';
import { practitionersSelectors } from 'store/practitioners';

// types
import AppointmentFormValues from 'types/AppointmentFormValues';

//utils
import debounce from 'utils/debounce';
import { formatDateRange } from 'utils/date';

// components
import { Button, Dialog, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import UpdateIcon from '@material-ui/icons/Edit';
import Form from './appointment/Form';
import CustomTable from './CustomTable';
import SearchInput from './SearchInput';
import searchFilter from 'utils/searchFilter';

const useStyles = makeStyles({
  dialogueContent: {
    padding: 20,
  },
  closeBtn: {
    marginTop: 10,
  },
});

const AppointmentList = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [filter, setFilter] = useState('');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateFormDefaultValues, setUpdateFormDefaultValues] = useState();

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

  const handleSearch = (value: string) => {
    setFilter(value);
  };
  const debouncedHandleSearch = debounce(handleSearch, 500);

  const getFilteredAppointments = (appointments) => {
    return appointments.filter((appointment) =>
      searchFilter(getPractitionerName(appointment.practitionerId), filter),
    );
  };

  return (
    <div datacy="appointmentList">
      <SearchInput
        placeHolder="seach by practitioner name"
        onChange={(value) => debouncedHandleSearch(value)}
      />
      <CustomTable
        columns={[
          'Id',
          'Practitioner Name',
          'Practitioner Id',
          'Patient Id',
          'Date',
          'Actions',
        ]}
        rows={getFilteredAppointments(appointments).map((appointment) => [
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
              datacy={`appointmentDelete-${appointment.id}`}
            />
            <Button
              startIcon={<UpdateIcon />}
              onClick={() => {
                setOpenUpdateDialog(true);
                setUpdateFormDefaultValues(appointment);
              }}
              datacy={`appointmentUpdate-${appointment.id}`}
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
