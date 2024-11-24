import useAsync from '../useAsync';

import * as estimateApi from '../../services/estimateApi';

export default function useEstimate() {
  const {
    loading: estimateLoading,
    error: estimateError,
    act: estimate,
  } = useAsync(estimateApi.estimate, false);

  return {
    estimateLoading,
    estimateError,
    estimate,
  };
}
