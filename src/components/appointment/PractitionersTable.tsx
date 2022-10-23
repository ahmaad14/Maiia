import { useSelector } from 'react-redux';
import { useState } from 'react';
import { practitionersSelectors } from 'store/practitioners';

// types
import AppointmentFormValues from 'types/AppointmentFormValues';
import { FormikContextType } from 'formik';

// utils
import searchFilter from '../../utils/searchFilter';
import debounce from '../../utils/debounce';

// components
import { Grid, Radio } from '@material-ui/core';
import CustomTable from '../CustomTable';
import SearchInput from 'components/SearchInput';

type Props = {
  formik: FormikContextType<AppointmentFormValues>;
  errorClassName: string;
};

const PractitionersTable = ({ formik, errorClassName }: Props) => {
  const [practitionerFilter, setPractitionerFilter] = useState('');

  //selectors
  const practitioners = useSelector((state) =>
    practitionersSelectors.selectAll(state.practitioners),
  );

  const { practitionerId } = formik.values;

  const handleSearch = (value: string) => {
    setPractitionerFilter(value);
  };
  const debouncedHandleSearch = debounce(handleSearch, 500);

  const handleChange = (e) => {
    formik.setFieldValue('availabilityId', '');
    formik.handleChange(e);
  };

  return (
    <Grid item>
      <h4> Practitioners </h4>
      <p className={errorClassName} datacy="practitionerId-err">
        <span> {formik.errors.practitionerId} </span>
      </p>
      <SearchInput
        placeHolder="search by name"
        onChange={(value) => debouncedHandleSearch(value)}
      />

      <CustomTable
        columns={['Select', 'Id', 'First name', 'Last name', 'Speciality']}
        rows={practitioners
          .filter((practitioner) =>
            searchFilter(
              `${practitioner.firstName} ${practitioner.lastName}`,
              practitionerFilter,
            ),
          )
          .map((practitioner) => [
            <Radio
              key={practitioner.id}
              name="practitionerId"
              onChange={handleChange}
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
  );
};

export default PractitionersTable;
