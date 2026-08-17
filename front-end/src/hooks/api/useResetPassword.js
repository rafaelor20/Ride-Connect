import useAsync from "../useAsync";

import * as resetPasswordApi from "../../services/resetPassword";

export default function useResetPassword() {
  const {
    loading: resetPasswordLoading,
    error: resetPasswordError,
    act: resetPassword,
  } = useAsync(resetPasswordApi.resetPassword, false);

  return {
    resetPasswordLoading,
    resetPasswordError,
    resetPassword,
  };
}
