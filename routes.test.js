const supertest = require('supertest')
const app = require('./index')

jest.mock('./database/connection', () => ({
  tryDatabaseConnection: () => {
    return true
  },
  isDatabaseConnected: () => {
    return true
  },
  createDummyData: () => {
    return true
  }
}))

jest.mock('./database/index', () => ({
  query: (any) => {
    return 'key'
  },
  define: (any) => { 
    return 'result'
  },
  create: () => {
    return true
  },
  literal: () => {
    return true
  },
  col: () => {
    return ''
  },
  fn: () => {
    return ''
  }
}))

jest.mock('./models/paciente', () => ({
  create: () => {
    return true
  }
}))

jest.mock('./models/prontuario', () => ({
  create: () => {
    return true
  }
}))

jest.mock('./models/atendimento', () => ({
  create: () => {
    return true
  },
  findAll: () => {
    return ''
  }
}))

jest.mock('./models/usuario', () => ({
  create: () => {
    return true
  }
}))

const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

describe('Teste unitários', () => {
  beforeEach(() => {
    consoleSpy.mockClear()
  })

  it('Deve fazer um GET no endpoint /', async () => {
    const {res} = await supertest(app).get('/') 
    expect(res.statusCode).toBe(200)
    expect(res.text).toBe("{\"res\":\"funcionando\"}")
  })
  
  it('Deve fazer um GET no endpoint /is-database-connected', async () => {
    const {res} = await supertest(app).get('/is-database-connected')
    expect(res.text).toBe('true')
    expect(res.req.method).toBe('GET')
    expect(res.req.path).toBe('/is-database-connected')
  })
  
  it('Deve fazer um GET no endpoint /tables', async () => {
    const {res} = await supertest(app).get('/tables')
    expect(res.statusCode).toBe(200)
    expect(res.text).not.toBeNull()
    expect(res.req.method).toBe('GET')
    expect(res.req.path).toBe('/tables')
  })
  
  it('Deve fazer um POST no endpoint /create-dummy-data', async () => {
    const {res} = await supertest(app).post('/create-dummy-data')
    expect(res.statusCode).toBe(200)
    expect(res.req.method).toBe('POST')
    expect(res.req.path).toBe('/create-dummy-data')
  })
 
  it('Deve fazer um POST no endpoint /new-record', async () => {
    const {res} = await supertest(app).post('/new-record').send({body: 'any'})
    expect(res.statusCode).toBe(200)
    expect(res.req.method).toBe('POST')
    expect(res.req.path).toBe('/new-record')
  })
  
  it('Deve fazer um GET no endpoint /permanence', async () => {
    const {res} = await supertest(app).get('/permanence')
    expect(res.statusCode).toBe(200)
    expect(res.req.method).toBe('GET')
    expect(res.req.path).toBe('/permanence')
  })
  
  it('Deve fazer um GET no endpoint /severity-and-permanence', async () => {
    const {res} = await supertest(app).get('/severity-and-permanence')
    expect(res.statusCode).toBe(200)
    expect(res.req.method).toBe('GET')
    expect(res.req.path).toBe('/severity-and-permanence')
  })
  
  it('Deve fazer um POST no endpoint /signup e retornar 400 sem parametros no body', async () => {
    const {res} = await supertest(app).post('/signup')
    expect(res.statusCode).toBe(400)
    expect(res.req.method).toBe('POST')
    expect(res.req.path).toBe('/signup')
  })
  
  it('Deve fazer um POST no endpoint /login" e retornar 400 sem parametros no body', async () => {
    const {res} = await supertest(app).post('/login"')
    expect(res.statusCode).toBe(404)
    expect(res.req.method).toBe('POST')
    expect(res.req.path).toBe('/login"')
  })
})