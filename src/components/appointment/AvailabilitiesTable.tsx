// types
import { FormikContextType } from 'formik';
import AppointmentFormValues from 'types/AppointmentFormValues';

// utils
import useFetchAvailabilities from 'utils/useFetchAvailabilities';
import { formatDateRange } from 'utils/date';

// components
import CustomTable from '../CustomTable';
import { Radio } from '@material-ui/core';

type Props = {
  formik: FormikContextType<AppointmentFormValues>;
  errorClassName?: string;
};

const AvailabilitiesTable = ({ formik, errorClassName }: Props) => {
  const { practitionerId, availabilityId } = formik.values;
  const availabilities = useFetchAvailabilities(practitionerId?.toString());

  return (
    <>
      <h4> Availabilities </h4>
      <p className={errorClassName} datacy="availabilityId-err">
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
    </>
  );
};

export default AvailabilitiesTable;
