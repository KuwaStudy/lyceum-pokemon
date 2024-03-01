import { useFetch, useRuntimeConfig } from "#app";

export default (key) => {
  const config = useRuntimeConfig();
  const response = useFetch(`/api/trainer/${key.replace(/\.json$/,"")}`, {
      default: () => [],
      server: false,
      baseURL: config.public.backendOrigin,
    });
  return response;
};
