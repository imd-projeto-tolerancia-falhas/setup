import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const FT = true;

const errors = new Counter('errors_total');

export const options = {
  stages: [
    { duration: "30s", vus: 10 },
    { duration: "30s", vus: 50 },
    { duration: "30s", vus: 100 },
    { duration: "30s", vus: 200 },
    { duration: "30s", vus: 300 },
    { duration: "30s", vus: 400 },
  ]
};

export default function () {
  const res = http.post(
    'http://host.docker.internal:8080/buyTicket',
    JSON.stringify({
      user: "1",
      flight: "AB123",
      day: "10/12/2025",
      ft: FT
    }),
    {
      headers: { "Content-Type": "application/json" },
      timeout: "30s"
    }
  );

  const ok = check(res, {
    "status 200": r => r.status === 200
  });

  if (!ok) errors.add(1);

  sleep(1);
}
