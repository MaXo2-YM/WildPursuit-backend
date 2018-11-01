const Code = require('code');
const expect = Code.expect;
const sequelize = require('./../db.js');
const Question = require('./../question/question.model');
const { getNewQuestions } = require('./tour.helper.js');
const { getQuestions } = require('./../game/game.controller.js');
const {
  pickAQuestion,
  displayQuestion,
  resolveQuestion,
} = require('./tour.controller.js');

let readline = require('readline');

describe('Round related Tests', () => {
  beforeEach((done) => {
    console.info('Deleting questions...');
    Question.destroy({
      where: {},
      truncate: true,
    })
      .then(() => {
        console.info('Questions deleted');
        const { themes } = require('./../question/theme/theme.data.js');
        getNewQuestions().then((questions) => {
          Promise.all(
            questions.map((question) => {
              const theQuestion = {
                themeName:
                  themes[Math.floor(Math.random() * themes.length)].name,
                question: question.question,
                response: question.correct_answer,
                responses: question.incorrect_answers,
              };
              return Question.create(theQuestion);
            })
          ).then(() => {
            console.info('Database filled');
            done();
          });
        });
      })
      .catch(done);
  });

  it('Should get all the questions and set them to Unused', (done) => {
    const themes = [
      { name: 'Histoire' },
      { name: 'Géographie' },
      { name: 'Science & Nature' },
      { name: 'Télévision' },
      { name: 'Théatre' },
      { name: 'Sport' },
    ];
    getQuestions(themes)
      .then((theQuestions) => {
        expect(theQuestions).to.be.an.array();
        theQuestions.map((question) => {
          expect(question.isAlreadyUsed).to.be.false();
          expect(question.content).to.include([
            'id',
            'themeName',
            'question',
            'correctAnswer',
            'answers',
          ]);
          expect(question.content.answers)
            .to.be.an.array()
            .and.to.include(question.content.correctAnswer);
          expect(question.content.answers.length).to.be.at.least(2);
          expect(question.content.id).to.be.not.null();
          expect(question.content.themeName).to.be.not.null();
          expect(question.content.correctAnswer).to.be.not.null();

          let themeNames = themes.map((theme) => theme.name);
          expect(themeNames).to.include(question.content.themeName);
          expect(question.content.themeName).not.to.be.equal('Littérature');
          expect(question.content.themeName).not.to.be.equal('People');
        });

        done();
      })
      .catch(done);
  });

  it('Should pick One Question who was not already used and in the right theme and set it to used', (done) => {
    const themes = [
      { name: 'Histoire' },
      { name: 'Géographie' },
      { name: 'Science & Nature' },
      { name: 'Télévision' },
      { name: 'Théatre' },
      { name: 'Sport' },
    ];
    getQuestions(themes)
      .then((questions) => {
        let question = pickAQuestion(questions, 'Géographie');
        expect(question, '#0').to.include([
          'id',
          'themeName',
          'question',
          'correctAnswer',
          'answers',
        ]);
        expect(question.answers, '#1')
          .to.be.an.array()
          .and.to.include(question.correctAnswer);
        expect(question.answers.length, '#2').to.be.at.least(2);
        questions.map((aQuestion) => {
          if (aQuestion.content.id === question.id) {
            expect(aQuestion.isAlreadyUsed, '#3').to.be.true();
          } else {
            expect(aQuestion.isAlreadyUsed, '#4').to.be.false();
          }
        });
        done();
      })
      .catch(done);
  });
});
