import request from "supertest";
import app from "../app";

describe('Get /', () => {
    it('Devuelve mensaje de servidor activo', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Servidor funcionando correctamente');
    })
})