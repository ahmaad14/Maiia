import { useSelector } from 'react-redux';
import { useState } from 'react';
import { practitionersSelectors } from 'store/practitioners';

// types
import AppointmentFormValues from 'types/AppointmentFormValues';
import { FormikContextType } from 'formik';

// utils
import filterByName from '../../utils/filterByName';
import debounce from '../../utils/debounce';

// components
import { Grid, Radio, InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CustomTable from '../CustomTable';

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

  const handleSearch = (value, setValue: (value: string) => any) => {
    setValue(value);
  };
  const debouncedHandleSearch = debounce(handleSearch, 500);

  return (
    <Grid item>
      <h4> Practitioners </h4>
      <p className={errorClassName} datacy="practitionerId-err">
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
        onChange={(e) =>
          debouncedHandleSearch(e.target.value, setPractitionerFilter)
        }
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
  );
};

export default PractitionersTable;
