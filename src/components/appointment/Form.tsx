import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useFormik } from 'formik';

// types
import AppointmentFormValues from 'types/AppointmentFormValues';

// utils
import useFetchAvailabilities from 'utils/useFetchAvailabilities';

// components
import { Button, Grid } from '@material-ui/core';
import PractitionersTable from './PractitionersTable';
import PatientsTable from './PatientsTable';
import AvailabilitiesTable from './AvailabilitiesTable';

type Props = {
  onSubmit: (formValues: AppointmentFormValues) => void;
  defaultValues?: AppointmentFormValues;
};
const useStyles = makeStyles({
  layout: {
    justifyContent: 'space-between',
    marginBlock: 20,
    '&.MuiGrid-container': {
      alignItems: 'flex-start !important',
    },
    '& > .MuiGrid-item': {
      minWidth: '50%',
    },

    '& td .MuiRadio-colorSecondary.Mui-checked': {
      color: 'black',
    },
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBlock: 5,
  },
});

const AppointmentForm = ({ onSubmit, defaultValues }: Props) => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      ...defaultValues,
      availabilityId: '',
    },
    validate,
    validateOnChange: false,
    onSubmit: (data) => {
      const selectedAvailability = availabilities.find(
        (availability) => availability.id === +data.availabilityId,
      );
      const newAppointment = {
        ...defaultValues,
        patientId: +data.patientId,
        practitionerId: +data.practitionerId,
        startDate: selectedAvailability.startDate,
        endDate: selectedAvailability.endDate,
      };
      onSubmit(newAppointment);
    },
  });

  const { practitionerId, availabilityId } = formik.values;
  const availabilities = useFetchAvailabilities(practitionerId);

  // get availability Id default value
  useEffect(() => {
    if (!availabilityId && practitionerId === defaultValues?.practitionerId) {
      const defaultAvailability = availabilities.find(
        (availability) =>
          availability.practitionerId === practitionerId &&
          availability.startDate === defaultValues.startDate &&
          availability.endDate === defaultValues.endDate,
      );
      formik.setFieldValue('availabilityId', defaultAvailability?.id);
    }
  }, [availabilities]);

  useEffect(() => {
    formik.setFieldValue('availabilityId', '');
  }, [practitionerId]);

  function validate(values) {
    const errors = {};
    const requiredFields = ['practitionerId', 'patientId', 'availabilityId'];
    requiredFields.forEach((field) => {
      if (!values[field]) errors[field] = 'Required';
    });
    return errors;
  }
  return (
    <form onSubmit={formik.handleSubmit} datacy="appointmentForm">
      <Grid className={classes.layout} container spacing={4}>
        <Grid item>
          <PractitionersTable formik={formik} errorClassName={classes.error} />
        </Grid>

        <Grid item>
          <PatientsTable formik={formik} errorClassName={classes.error} />
        </Grid>

        <Grid item>
          <AvailabilitiesTable formik={formik} errorClassName={classes.error} />
        </Grid>
      </Grid>
      <Button
        fullWidth={true}
        type="submit"
        variant="contained"
        color="primary"
      >
        Submit
      </Button>
    </form>
  );
};

export default AppointmentForm;
