/**
 * Converts a flat values object into multipart FormData, so admin
 * create/update forms can send file uploads alongside regular fields
 * in a single request.
 */
export function buildFormData(values: object): FormData {
  const formData = new FormData();

  Object.entries(values as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (value instanceof FileList) {
      Array.from(value).forEach((file) => formData.append(key, file));
    } else if (Array.isArray(value)) {
      formData.append(key, value.join(','));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}
