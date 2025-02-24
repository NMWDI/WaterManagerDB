export const formatQueryParams = (queryParams: Record<string, any>): string => {
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) {
      return; // Skip empty, null, undefined
    }

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
};
