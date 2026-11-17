export type DataMode = 'auto' | 'api' | 'mock';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  dataMode: 'auto' as DataMode,
};
