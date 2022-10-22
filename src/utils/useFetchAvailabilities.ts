import config from 'config';
import { useEffect, useRef, useState } from 'react';
const useFetchAvailabilities = (practitionerId: string) => {
  const cache = useRef({});
  const [availabilities, setAvailabilities] = useState([]);

  useEffect(() => {
    if (!practitionerId) return;
    let isCurrent = true;

    const fetchData = async () => {
      if (cache.current[practitionerId]) {
        const data = cache.current[practitionerId];
        setAvailabilities(data);
      } else {
        const SERVER_API_ENDPOINT = config.get('SERVER_API_ENDPOING', '/api');

        const response = await fetch(
          `${SERVER_API_ENDPOINT}/availabilities?practitionerId=${+practitionerId}`,
        );
        const data = await response.json();

        cache.current[practitionerId] = data;
        if (isCurrent) setAvailabilities(data);
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
