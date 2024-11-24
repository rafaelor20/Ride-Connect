import useAsync from '../useAsync';

import * as confirmApi from '../../services/confirmApi';

export default function useConfirm() {
  const {
    loading: confirmLoading,
    error: confirmError,
    act: confirm,
  } = useAsync(confirmApi.confirm, false);

  return {
    confirmLoading,
    confirmError,
    confirm,
  };
}
