import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 50, // Número de usuários virtuais simultâneos
    duration: '30s', // Duração do teste
};

export default function () {
    let res = http.get('http://localhost:3000/');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time is < 200ms': (r) => r.timings.duration < 200,
    });
    sleep(1); // Espera de 1 segundo entre as requisições
}
