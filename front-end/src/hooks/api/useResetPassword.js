import useAsync from '../useAsync';
import useToken from '../useToken';

import * as resetPasswordApi from '../../services/resetPassword';

export default function useResetPassword() {
  const token = useToken();
  const {
    loading: resetPasswordLoading,
    error: resetPasswordError,
    act: resetPassword,
  } = useAsync((data) => resetPasswordApi.resetPassword(data, token), false);

  return {
    resetPasswordLoading,
    resetPasswordError,
    resetPassword,
  };
}