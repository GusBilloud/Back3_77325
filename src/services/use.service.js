import { faker } from "@faker-js/faker"

export function generateFakerUser(count = 5, fakerClient = faker) {
    if (!Number.isInteger(count) || count < 0) {
        throw new Error("count debe ser un entero mayor o igual a 0")
    }
    const users = [];

    for (let i = 0; i < count; i++) {
        users.push({
            id: fakerClient.string.uuid(),
            name: fakerClient.person.fullName(),
            email: fakerClient.internet.email()
        })
    }
    return users;

}