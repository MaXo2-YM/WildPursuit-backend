const Code = require('code');
const expect = Code.expect;
const server = require('../app.js');
const Question = require('./question.model');
const sequelize = require('./../db.js');
const uuidv4 = require('uuid/v4');




//Avant ébut des test on suppr toutes les données
beforeEach((done) => {
  console.info('deleting questions ...');
  Question.destroy({
    where: {},
    truncate: true,
  })
    .then(() => {
      console.info('questions deleted');
      done();
    })
    .catch(done);
});





// un test pour voir si lorsqu'on crée une question on a bien un uuid qui lui est affecté
// en verifiant directement dans la base sql

//Test la création de la question
describe('CRUD /questions', () => {
  describe('Create', () => {
    it('Should create a question and respond 201', (done) => {
      const request = {
        method: 'POST',
        url: '/questions',
        payload: {
          id: uuidv4(),
          theme: 'geographie',
          question: 'Quelle est la capitale de la France',
          responses: ['Bayonne', 'Toulouse', 'Bordeaux', 'Londres'],
          response: 'Paris',
        },
      };

      const expectedResponseBody = {
        theme: 'geographie',
        question: 'Quelle est la capitale de la France',
        responses: ['Bayonne', 'Toulouse', 'Bordeaux', 'Londres'],
        response: 'Paris',
      };

      server
        .inject(request)
        .then((response) => {
          expect(response.statusCode).to.be.equal(201);
          expect(response.result).to.include('id');
          expect(response.result).to.include(expectedResponseBody);
          done();
        })
        .catch(done);
    });
  });





  //Test la lecture des questions
  describe('Read', () => {
    // read one
    it('Should get a question and respond 200', (done) => {
      const question = {
        theme: 'geographie',
        question: 'Quelle est la capitale de la France',
        response: 'Paris',
        responses: ['Bayonne', 'Toulouse', 'Bordeaux', 'Londres'],
      };
      Question.create(question)
        .then((createdQuestion) => {
          const request = {
            method: 'GET',
            url: `/questions/${createdQuestion.id}`,
          };
          const expectedResponseBody = {
            id: createdQuestion.id,
            ...question,
          };
          return server.inject(request).then((response) => {
            expect(response.statusCode).to.be.equal(200);
            expect(response.result).to.include(expectedResponseBody);
            done();
          });
        })
        .catch(done);
    });





    //Read all
    it('Should get all questions and respond 200', (done) => {
      const questionA = {
        id: uuidv4(),
        theme: 'maman',
        question: 'manger?',
        response: 'sushi',
        responses: ['riz', 'pates', 'pizza', 'patate'],
      };
      const questionB = {
        id: uuidv4(),
        theme: 'blalbla',
        question: 'blobloblo ?',
        response: 'oui',
        responses: ['aa', 'bb', 'jj', 'aaz'],
      };

      Question.create(questionA)
        .then(() => {
          Question.create(questionB) //creation de la question A et B
            .then(() => {
              const request = {
                method: 'GET',
                url: `/questions`, // plus de id pour ne pas cibler une seule question
              };
              const expectedResponseBody = {
                0: { ...questionA },
                1: { ...questionB },
              };
              return server.inject(request).then((response) => {
                expect(response.statusCode).to.be.equal(200); // quand l'on arrive à lire toutes les questions
                expect(response.result).to.include(expectedResponseBody); // les questions apparaissent
                done();
              }).catch(done);
            })
            .catch(done);
        })
        .catch(done);
    });
  });






  //Test de la mise à jour d'une question
  describe('Update', () => {
    it('Should update a question and respond 200', (done) => {
      const requestCreate = {
        // on post une question
        method: 'POST',
        url: '/questions',
        payload: {
          theme: 'geographie',
          question: 'Quelle est la capitale de la France',
          responses: ['Bayonne', 'Toulouse', 'Bordeaux', 'Londres'],
          response: 'Paris',
        },
      };

      const expectedResponseBody = {
        // on attend que la modif soie prise en compte
        theme: 'geographie',
        question: 'Quelle est la capitale de la France ?',
        responses: ['Tokyo', 'Toulouse', 'Bordeaux', 'Londres'],
        response: 'Pau',
      };

      server
        .inject(requestCreate)
        .then((res) => {
          
          const requestUpdate = {
            // on la modifie
            method: 'PUT',
            url: `/questions/${res.result.id}`, // on sait pas trop quelle cela modifie
            payload: {
              theme: 'geographie',
              question: 'Quelle est la capitale de la France ?',
              responses: ['Tokyo', 'Toulouse', 'Bordeaux', 'Londres'],
              response: 'Pau',
            },
          };
          server
            .inject(requestUpdate)
            .then((response) => {
              
              expect(response.statusCode).to.be.equal(200);
              expect(response.result).to.include('id');
              expect(response.result).to.include(expectedResponseBody);
              done();
            })
            .catch(done);
        })
        .catch(done);
    });
  });




  
  //Test de la suppression d'une question
  describe('Destroy', () => {
    it('Should destroy a question and respond 200', (done) => {
      const question = {
        theme: 'geographie',
        question: 'Quelle est la capitale de la France',
        responses: ['Bayonne', 'Toulouse', 'Bordeaux', 'Londres'],
        response: 'Paris',
      };
      Question.create(question)
        .then((createdQuestion) => {
          const request = {
            method: 'DELETE',
            url: `/questions/${createdQuestion.id}`,
          };
          return server
            .inject(request)
            .then((response) => {
              expect(response.statusCode).to.be.equal(200); // on attend que la reponse et 200
              expect(response.result).to.be.equal(null); // on attend que l'objet que l'on a detruit soit null ou undefined
              done(); 
            })
            .catch(done);
        })  
        .catch(done);
    });
  });
});
