import useAsync from '../useAsync';
import useToken from '../useToken';

import * as confirmApi from '../../services/confirmApi';

export default function useConfirm() {
  const token = useToken();
  const {
    loading: confirmLoading,
    error: confirmError,
    act: confirm,
  } = useAsync((data) => confirmApi.confirm(data, token), false);

  return {
    confirmLoading,
    confirmError,
    confirm,
  };
}
