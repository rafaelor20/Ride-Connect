import useAsync from '../useAsync';
import useToken from '../useToken';

import * as forgotPasswordApi from '../../services/forgotPassword';

export default function useForgotPassword() {
  const token = useToken();
  const {
    loading: forgotPasswordLoading,
    error: forgotPasswordError,
    act: forgotPassword,
  } = useAsync((data) => forgotPasswordApi.forgotPassword(data, token), false);

  return {
    forgotPasswordLoading,
    forgotPasswordError,
    forgotPassword,
  };
}