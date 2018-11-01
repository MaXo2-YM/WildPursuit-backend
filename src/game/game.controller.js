const Game = require('./game.class.js');

const { gameRound } = require('../tour/tour.controller.js');
const Question = require('./../question/question.model.js');
const Op = require('sequelize').Op;

const { CheeseBox, CenterBox } = require('./../board/box.class.js');

function getQuestions(themes) {
  let themeNames = [];
  themes.forEach((theme) => {
    themeNames.push(theme.name);
  });
  return new Promise((resolve, reject) => {
    Question.findAll({ where: { themeName: { [Op.or]: themeNames } } }).then(
      (questions) => {
        let theQuestions = [];
        let questionsCount = 0;
        questions.map((question, i) => {
          const answers = question.responses;
          const answerTrue = question.response;
          answers.push(answerTrue);
          answers.sort(function() {
            return 0.5 - Math.random(); //un sort qui prend en paramètre entre -0.5 et 0.5
          }); //donc random à chaque élèment
          const theQuestion = {
            id: question.id,
            themeName: question.themeName,
            question: question.question,
            correctAnswer: question.response,
            answers: answers,
          };
          theQuestions.push({ content: theQuestion, isAlreadyUsed: false });
          questionsCount = i;
        });
        console.info(
          'Les ' + questionsCount + ' questions ont bien été chargées'
        );
        resolve(theQuestions);
      }
    );
  });
}

function pickAPlayer(players) {
  return players[Math.floor(Math.random() * players.length)];
}

function getNextPlayer(player, players) {
  const nextPlayerIndex = (players.indexOf(player) + 1) % players.length;
  return players[nextPlayerIndex];
}

function launchGame(id, nbCat, nbMaxPlayers, countDownBeforeGame) {
  let aGame = new Game(id, nbCat, nbMaxPlayers);
  aGame.init().then(() => {
    getQuestions(aGame.board.themes).then((questions) => {
      aGame.newPlayer(); //simulation d'une connection d'un joueur
      aGame.newPlayer(); //simulation d'une connection d'un joueur
      aGame.newPlayer(); //simulation d'une connection d'un joueur
      let player = pickAPlayer(aGame.players);

      let endGame = false;
      while (!endGame) {
        console.log('### NOUVEAU TOUR ###');
        let round = gameRound(player, questions, aGame.board);
        if (!round) {
          player = getNextPlayer(player, aGame.players);
          console.log('Le joueur change.');
        } else if (
          round &&
          aGame.board.boxes[player.position] instanceof CheeseBox
        ) {
          player.winACheese(aGame.board.boxes[player.position].theme.name);
          console.log(player.name + ' gagne un camembert');
          console.log(
            player.name + ' a ' + player.nbCheeses + ' camenberts qui sont :'
          );
          console.log(player.cheeses);
        } else if (
          round &&
          aGame.board.boxes[player.position] instanceof CenterBox &&
          player.nbCheeses === nbCat
        ) {
          console.log('### LA PARTIE EST TERMINEE ###');
          console.log(
            '### LE GAGNANT DE LA PARTIE EST : ' + player.name + ' ###'
          );
          endGame = true;
        }
      }
    });
  });
}

module.exports = { getQuestions, pickAPlayer, getNextPlayer, launchGame };
