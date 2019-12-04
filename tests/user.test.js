const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db')
beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Bruno',
        email: 'bbigotto@gmail.com',
        password: '123456789'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Bruno',
            email: 'bbigotto@gmail.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('123456789')
})

test('Shout not signup user with invalid email', async () => {
    await request(app).post('/users/').send({
        name: 'Bruno',
        email: 'bruno',
        password: '123456789'
    }).expect(400)
})

test('Shout not signup user with invalid password', async () => {
    await request(app).post('/users/').send({
        name: 'Bruno',
        email: 'bruno',
        password: '123'
    }).expect(400)
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'campogrande'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauth', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ age: 10 })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.age).toBe(10)
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'Jales' })
        .expect(400)
})

test('Should not update user if unauthenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send({ age: 15 })
        .expect(401)
})

test('Should not update user with invalid email', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ email: 'campogrande' })
        .expect(500)
})

test('Should not update user with invalid email', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ password: '123' })
        .expect(500)
})
