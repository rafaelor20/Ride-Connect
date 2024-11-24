import useAsync from '../useAsync';
import useToken from '../useToken';

import * as estimateApi from '../../services/estimateApi';

export default function useEstimate() {
  const token = useToken();
  const {
    loading: estimateLoading,
    error: estimateError,
    act: estimate,
  } = useAsync((data) => estimateApi.estimate(data, token), false);

  return {
    estimateLoading,
    estimateError,
    estimate,
  };
}
