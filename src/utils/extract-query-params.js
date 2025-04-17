export function extractQueryParams(url) {
  const queryString = url.split('?')[1];
  const queryParams = new URLSearchParams(queryString);
  const params = Object.fromEntries(queryParams);

  return params;
}
