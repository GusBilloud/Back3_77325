import { jest } from 'jest/globals';
import { request } from 'supertest';
import { generateFakerUser } from '../services/use.service';

describe('GET /users con mocks de `faker`', () => {
    const originalUserCount = process.env.USERS_COUNT;
    beforeEach(() => {
        jest.resetModules();
    });
    afterEach(() => {
        if (originalUserCount === undefined) {
            delete process.env.USERS_COUNT;
        } else {
            process.env.USERS_COUNT = originalUserCount;
        }
    });
    it('Usar el mock del servicio', async () => {
        jest.unstable_mockModule('../services/user.service.js', () => ({
            generateFakerUser: () => [
                { id: '1', name: 'Usuario Mock', email: 'test@email' }
            ]
        }))
        const app = (await import('../app.js')).default;
        const res = await request(app).get('/users');
    })

})

