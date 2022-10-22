import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid, Radio } from '@material-ui/core';
import { getPractitioners, practitionersSelectors } from 'store/practitioners';
import { getPatients, patientsSelectors } from 'store/patients';
import { useEffect, useState } from 'react';
import { formatDateRange } from 'utils/date';
import CustomTable from '../CustomTable';
import { makeStyles } from '@material-ui/core';
import { useFormik } from 'formik';
import config from 'config';
import AppointmentFormValues from 'types/AppointmentFormValues';

type Props = {
  onSubmit: (formValues: AppointmentFormValues) => void;
  defaultValues?: AppointmentFormValues;
};
const useStyles = makeStyles({
  layout: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBlock: 20,
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
  const [availabilities, setAvailabilities] = useState([]);
  const dispatch = useDispatch();
  const classes = useStyles();

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

  useEffect(() => {
    dispatch(getPractitioners());
    dispatch(getPatients());
  }, []);

  useEffect(() => {
    let isCurrent = true;
    const getAvailabilities = async () => {
      if (!practitionerId) return [];
      const SERVER_API_ENDPOINT = config.get('SERVER_API_ENDPOING', '/api');
      const response = await fetch(
        `${SERVER_API_ENDPOINT}/availabilities?practitionerId=${+practitionerId}`,
      );
      const parsedResponse = await response.json();
      setAvailabilities(parsedResponse);

      return parsedResponse;
    };

    if (isCurrent) getAvailabilities();

    return () => {
      isCurrent = false;
    };
  }, [practitionerId]);

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

  function validate(values) {
    const errors = {};
    const requiredFields = ['practitionerId', 'patientId', 'availabilityId'];
    requiredFields.forEach((field) => {
      if (!values[field]) errors[field] = 'Required';
    });
    return errors;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid className={classes.layout} container spacing={4}>
        <Grid item>
          <h4> Practitioners </h4>
          <p className={classes.error}> {formik.errors.practitionerId} </p>
          <CustomTable
            columns={['select', 'id', 'first name', 'last name', 'speciality']}
            rows={practitioners.map((practitioner) => [
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
          <p className={classes.error}> {formik.errors.patientId} </p>
          <CustomTable
            columns={['select', 'id', 'first name', 'last name']}
            rows={patients.map((patient) => [
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
          <p className={classes.error}> {formik.errors.availabilityId} </p>
          <CustomTable
            columns={['select', 'id', 'date']}
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
