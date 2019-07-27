require('dotenv').config();
const app = require('../src/app');
const knex = require('knex');
const notes = require('./notes.fixtures')();
const folders = require('./folder.fixtures')();
describe('server responses properly',()=>{
  let db;
  before(()=>{
    db = knex({
      client:'pg',
      connection:process.env.DATABASE_URL_TEST
    });
    app.set('db',db);
   
  });
  before(()=>db.raw('TRUNCATE TABLE notes RESTART IDENTITY').then(()=>db.raw('TRUNCATE TABLE folders RESTART IDENTITY CASCADE')));
  

  after(()=>db.destroy);

  beforeEach(()=>db('folders').insert(folders).then(()=>db('notes').insert(notes)));

  afterEach(()=>db.raw('TRUNCATE TABLE notes RESTART IDENTITY ').then(()=>db.raw('TRUNCATE TABLE folders RESTART IDENTITY CASCADE')));

  it('resonse with a 200 code',()=>{
    return request(app).get('/').expect(200);
  });
  context('all endpoints',()=>{
    context('GET request',()=>{
      it('returns 200 on success',()=>{
        return request(app)
          .get('/folders')//check if is correct endpoint
          .expect(200);
      });
      it('return a 404 for unknown resource',()=>{
        return request(app)
          .get('/test')
          .expect(404);
      });
      it('return a 200  and a array of folders',()=>{
        return request(app)
          .get('/folders')
          .expect(200)
          .expect(res=>{
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.gte(1);
          });
      });
      it('return a 200  and a single note',()=>{
        return request(app)
          .get('/notes/1')
          .expect(200);
      });
      it('returns all notes',()=>{
        return request(app)
          .get('/notes')
          .expect(200)
          .expect((res)=>{
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.gte(1);
          });
      });
    });
    context('POST request',()=>{
      context('if request is invalid',()=>{
        it('returns 400 if body is invalid',()=>{
          return request(app)
            .post('/folders')
            .set('Content-Type','application/json')
            .send({test:'this is a test'})
            .expect(400);
        });
        it('returns 400 if not json',()=>{
          return request(app)
            .post('/folders')
            .set('Content-type','text/plain')
            .send('title=user1')
            .expect(400);
        });
       
      });
      context('if body is valid',()=>{
        it('returns 201 when adding a note to folder',()=>{
          return request(app)
            .post('/folders/1')
            .set({'Content-type':'application/json'})
            .send({name:'testing',content:'this is a test of adding notes',folder_id:1})
            .expect(201);
        });
        it('returns 201 on success for folders',()=>{
          return request(app)
            .get('/folders')
            .set({'Content-Type':'application/json'})
            .send({name:'test folder'});
        });
      });
      
    });
    context('PATCH request',()=>{
      it('can change notes name',()=>{
        return request(app)
          .patch('/notes/1')
          .set('Content-type','application/json')
          .send({name:'changed name'})
          .expect(201)
          .expect((results)=>{
            expect(results.body.name==='changed name');
          });
      });
      it('can change folders name',()=>{
        return request(app)
          .patch('/folders/1')
          .set('Content-type','application/json')
          .send({name:'changed name'})
          .expect(201)
          .expect((results)=>{
            expect(results.body.name==='changed name');
          });
      });
      it('responses 404 if invalid folder',()=>{
        return request(app)
          .patch('/folders/asd')
          .set('Content-type','application/json')
          .send({name:'changed name'})
          .expect(404);
      });
      it('responses 404 if invalid note',()=>{
        return request(app)
          .patch('/folders/asd')
          .set('Content-type','application/json')
          .send({name:'changed name'})
          .expect(404);
      });
    });
    context('DELETE request',()=>{
      it('delete note success',()=>{
        return request(app)
          .delete('/notes/1')
          .expect(204);
      });
      it('delete folder success',()=>{
        return request(app)
          .delete('/folders/1')
          .expect(204);
      });
      it('returns 404 if note doesnt exist',()=>{
        return request(app)
          .delete('/notes/asd')
          .expect(404).then(()=>request(app)
            .delete('/folders/asd')
            .expect(404));
      });
    });
  });
});