import { useState } from 'react';
import { useSelector } from 'react-redux';
import { patientsSelectors } from 'store/patients';

// types
import AppointmentFormValues from 'types/AppointmentFormValues';
import { FormikContextType } from 'formik';

// utils
import filterByName from '../../utils/filterByName';
import debounce from '../../utils/debounce';

// components
import { Radio } from '@material-ui/core';
import CustomTable from '../CustomTable';
import SearchInput from 'components/SearchInput';

type Props = {
  formik: FormikContextType<AppointmentFormValues>;
  errorClassName?: string;
};

const PatientsTable = ({ formik, errorClassName }: Props) => {
  const [patientFilter, setPatientFilter] = useState('');

  const patients = useSelector((state) =>
    patientsSelectors.selectAll(state.patients),
  );

  const { patientId } = formik.values;

  const handleSearch = (value: string) => {
    setPatientFilter(value);
  };
  const debouncedHandleSearch = debounce(handleSearch, 500);

  return (
    <>
      <h4> Patients </h4>
      <p className={errorClassName} datacy="patientId-err">
        {formik.errors.patientId}
      </p>
      <SearchInput onChange={(value) => debouncedHandleSearch(value)} />

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
    </>
  );
};

export default PatientsTable;
