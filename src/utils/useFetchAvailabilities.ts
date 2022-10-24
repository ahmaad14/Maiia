import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getAvailabilities,
  availabilitiesActions,
  availabilitiesSelectors,
} from 'store/availabilities';

const useFetchAvailabilities = (practitionerId: string) => {
  const cache = useRef({});
  const dispatch = useDispatch();
  const availabilities = useSelector((state) =>
    availabilitiesSelectors.selectAll(state.availabilities),
  );

  useEffect(() => {
    if (availabilities.length)
      cache.current[availabilities[0].practitionerId] = availabilities;
  }, [availabilities]);

  useEffect(() => {
    if (!practitionerId) return;
    let isCurrent = true;

    const fetchData = async () => {
      if (cache.current[practitionerId]) {
        const data = cache.current[practitionerId];
        if (isCurrent) {
          dispatch(availabilitiesActions.setAvailabilities(data));
        }
      } else {
        if (isCurrent) {
          dispatch(getAvailabilities(practitionerId));
        }
      }
    };
    fetchData();
    return () => {
      isCurrent = false;
    };
  }, [practitionerId]);

  return availabilities;
};

export default useFetchAvailabilities;
