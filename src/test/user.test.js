import { expect, jest } from '@jest/globals';
import request from 'supertest';
import { generateFakerUser } from '../services/use.service.js';

describe('GET /users con mocks de `faker`', () => {
    const originalUserCount = process.env.USER_COUNT;
    beforeEach(() => {
        jest.resetModules();
    });
    afterEach(() => {
        if (originalUserCount === undefined) {
            delete process.env.USER_COUNT;
        } else {
            process.env.USER_COUNT = originalUserCount;
        }
    });
    it('Usar el mock del servicio', async () => {
        jest.unstable_mockModule('../services/use.service.js', () => ({
            generateFakerUser: () => [
                { id: '1', name: 'Usuario Mock', email: 'test@email' }
            ]
        }))
        const app = (await import('../app.js')).default;
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: 'usuarios generados con faker',
            users: [
                { id: '1', name: 'Usuario Mock', email: 'test@email' }
            ]
        })
    })
    it('Mockea process.env para cambiar USER_COUNT', async () => {
        const userMock = jest.fn(() => []);
        jest.unstable_mockModule('../services/use.service.js', () => ({
            generateFakerUser: userMock,
        }))

        process.env.USER_COUNT = '2';
        const app = (await import('../app.js')).default;
        const res = await request(app).get('/users');

        expect(res.statusCode).toBe(200);
        expect(userMock).toHaveBeenCalledWith(2);
    })
    it('Responde 500 si el servicio falla', async () => {
        jest.unstable_mockModule('../services/use.service.js', () => ({
            generateFakerUser: () => {
                throw new Error('Falla en el servidor!')
            }
        }))
        const app = (await import('../app.js')).default;
        const res = await request(app).get('/users');

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error');
    })

})

