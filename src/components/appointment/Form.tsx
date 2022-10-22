import { useSelector } from 'react-redux';

import {
  Button,
  Grid,
  Radio,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { practitionersSelectors } from 'store/practitioners';
import { patientsSelectors } from 'store/patients';
import { useEffect, useState } from 'react';
import { formatDateRange } from 'utils/date';
import CustomTable from '../CustomTable';
import { makeStyles } from '@material-ui/core';
import { useFormik } from 'formik';
import useFetchAvailabilities from 'utils/useFetchAvailabilities';
import AppointmentFormValues from 'types/AppointmentFormValues';
import filterByName from '../../utils/filterByName';
type Props = {
  onSubmit: (formValues: AppointmentFormValues) => void;
  defaultValues?: AppointmentFormValues;
};
const useStyles = makeStyles({
  layout: {
    alignItems: 'flex-start !important',
    justifyContent: 'space-between',
    marginBlock: 20,
    '& > div': {
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

  const [practitionerFilter, setPractitionerFilter] = useState('');
  const [patientFilter, setPatientFilter] = useState('');

  //selectors
  const practitioners = useSelector((state) =>
    practitionersSelectors.selectAll(state.practitioners),
  );
  const patients = useSelector((state) =>
    patientsSelectors.selectAll(state.patients),
  );

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

  const { practitionerId, patientId, availabilityId } = formik.values;
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
          <h4> Practitioners </h4>
          <p className={classes.error} datacy="practitionerId-err">
            <span> {formik.errors.practitionerId} </span>
          </p>
          <TextField
            type="search"
            variant="outlined"
            margin="normal"
            placeholder="search by name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setPractitionerFilter(e.target.value)}
          />

          <CustomTable
            columns={['Select', 'Id', 'First name', 'Last name', 'Speciality']}
            rows={filterByName(
              practitioners,
              practitionerFilter,
            ).map((practitioner) => [
              <Radio
                key={practitioner.id}
                name="practitionerId"
                onChange={formik.handleChange}
                value={practitioner.id}
                checked={practitioner.id === +practitionerId}
              />,
              practitioner.id,
              practitioner.firstName,
              practitioner.lastName,
              practitioner.speciality,
            ])}
          />
        </Grid>

        <Grid item>
          <h4> Patients </h4>
          <p className={classes.error} datacy="patientId-err">
            {formik.errors.patientId}
          </p>
          <TextField
            type="search"
            variant="outlined"
            margin="normal"
            placeholder="search by name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setPatientFilter(e.target.value)}
          />
          <CustomTable
            columns={['Select', 'Id', 'First Name', 'Last Name']}
            rows={filterByName(patients, patientFilter).map((patient) => [
              <Radio
                key={patient.id}
                name="patientId"
                value={patient.id}
                onChange={formik.handleChange}
                checked={patient.id === +patientId}
              />,
              patient.id,
              patient.firstName,
              patient.lastName,
            ])}
          />
        </Grid>

        <Grid item>
          <h4> Availabilities </h4>
          <p className={classes.error} datacy="availabilityId-err">
            {formik.errors.availabilityId}
          </p>
          <CustomTable
            columns={['Select', 'Id', 'Date']}
            rows={availabilities.map((availability) => [
              <Radio
                key={availability.id}
                name="availabilityId"
                value={availability.id}
                onChange={formik.handleChange}
                checked={availability.id === +availabilityId}
              />,
              availability.id,
              formatDateRange({
                from: availability.startDate,
                to: availability.endDate,
              }),
            ])}
          />
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
