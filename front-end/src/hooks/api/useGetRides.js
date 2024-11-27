import useAsync from '../useAsync';

import * as getRidesApi from '../../services/getRides';

export default function useGetRides() {
  const {
    loading: getRidesLoading,
    error: getRidesError,
    act: getRides,
  } = useAsync((data) => getRidesApi.getRides(data), false);

  return {
    getRidesLoading,
    getRidesError,
    getRides,
  };
}
