import { describe, expect, jest } from '@jest/globals';
import { generateFakerUser } from '../services/use.service.js';

describe('generateFakerUser con stub', () => {
    it('Permite generar datos fijos para test unitario', () => {
        const fakerStub = {
            string: { uuid: jest.fn(() => 'id-fijo') },
            person: { fullName: jest.fn(() => 'Nombre Fijo') },
            internet: { email: jest.fn(() => 'fijo@test.com') }
        };
        const users = generateFakerUser(1, fakerStub);
        expect(users).toEqual([
            { id: 'id-fijo', name: 'Nombre Fijo', email: 'fijo@test.com' },
        ]);
    });
})