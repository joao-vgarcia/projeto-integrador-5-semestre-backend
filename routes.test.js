const supertest = require('supertest')
const app = require('./index')

describe('Unit tests', () => {
  it('Should get on / endpoint', async () => {
    const {res} = await supertest(app).get('/') 
    expect(res.statusCode).toBe(200)
    expect(res.text).toBe("{\"res\":\"funcionando\"}")
  })
})