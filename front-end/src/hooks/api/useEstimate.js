import useAsync from '../useAsync';

import * as estimateApi from '../../services/estimateApi';

export default function useEstimate() {
  const {
    loading: estimateLoading,
    error: estimateError,
    act: estimate,
  } = useAsync((data) => estimateApi.estimate(data), false);

  return {
    estimateLoading,
    estimateError,
    estimate,
  };
}
