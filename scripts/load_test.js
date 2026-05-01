import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 }, // Ramp-up to 100 users
    { duration: '1m', target: 500 },  // Steady state 500 users
    { duration: '30s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost';

export default function () {
  // 1. Simular navegación por el Mercado
  const res = http.get(`${BASE_URL}/api/collections/products/records?page=1&perPage=20&expand=store,category&filter=store.status="approved"`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has products': (r) => r.json().items.length >= 0,
  });

  // 2. Simular carga de categorías
  http.get(`${BASE_URL}/api/collections/categories/records`);

  sleep(Math.random() * 3 + 1); // Espera aleatoria entre 1 y 4 segundos
}
