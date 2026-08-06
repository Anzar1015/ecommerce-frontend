export function extractErrorMessage(error: unknown): string {
  const anyErr = error as { response?: { data?: { message?: string } } };
  return anyErr?.response?.data?.message ?? 'Something went wrong';
}
