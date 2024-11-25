import useAsync from '../useAsync';
import useToken from '../useToken';

import * as getRidesApi from '../../services/getRides';

export default function useGetRides() {
  const token = useToken();
  const {
    loading: getRidesLoading,
    error: getRidesError,
    act: getRides,
  } = useAsync((data) => getRidesApi.getRides(data, token), false);

  return {
    getRidesLoading,
    getRidesError,
    getRides,
  };
}
