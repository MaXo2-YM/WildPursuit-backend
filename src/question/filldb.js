const Sequelize = require('sequelize');
const datas = require('./datas/');

const sequelize = new Sequelize('wildpursuit', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgresql',
  operatorsAliases: false,
  logging: false,
});

const Theme = sequelize.define('theme', {
  name: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
});

const Question = sequelize.define('question', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  question: {
    type: Sequelize.STRING,
  },
  response: {
    type: Sequelize.STRING,
  },
  responses: {
    type: Sequelize.JSON,
  },
});
Question.belongsTo(Theme);

//console.log(datas);
//Question.create({});
/* datas.forEach(function(theme) {
  console.log(theme);
}); */

console.info('On vide la DB');
Question.destroy({
  where: {},
  truncate: true,
})
  .then(() => {
    console.info('La DB est vide');
    for (theme in datas) {
      datas[theme].forEach(function(question) {
        Question.create(question).catch((err) => {
          console.error(err);
        });
      });
      console.info(
        'la catégorie ' +
          theme +
          ' contient ' +
          datas[theme].length +
          ' questions'
      );
    }
    let themesLength = Object.keys(datas).length;
    console.info('La DB contient donc ' + themesLength + ' catégories,');

    let questionsLength = 0;
    for (let i = 0; i < themesLength; i++) {
      questionsLength += datas[theme].length;
    }
    console.info('pour un total de ' + questionsLength + ' questions');
    console.info('La base de données a bien été remplie (cette tchoin)');
    console.info('Appuyez sur ctrlC pour arreter le script.');
  })
  .catch((err) => {
    console.error(err);
  });
