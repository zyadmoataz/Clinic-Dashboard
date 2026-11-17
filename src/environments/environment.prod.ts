export type DataMode = 'auto' | 'api' | 'mock';

export const environment = {
  production: true,
  apiUrl: 'http://localhost:5000/api',
  dataMode: 'mock' as DataMode,
};
