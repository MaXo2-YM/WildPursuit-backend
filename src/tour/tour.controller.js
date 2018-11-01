const launchDice = require('../dice/dice.controller.js');
const readlineSync = require('readline-sync');
const {
  NormalBox,
  CheeseBox,
  ReplayBox,
  CenterBox,
} = require('./../board/box.class.js');

function pickAQuestion(questions, theme) {
  let themedQuestions = [];
  let pickedIndex;
  let theQuestion;
  questions.map((question) => {
    if (question.content.themeName === theme) {
      themedQuestions.push(question.content);
    }
  });
  pickedIndex = Math.floor(Math.random() * themedQuestions.length);
  theQuestion = themedQuestions[pickedIndex];
  questions.map((question) => {
    if (question.content.id === theQuestion.id) {
      question.isAlreadyUsed = true; //ça c'est complètement fou, ça modifie carrément le tableau originel passé en paramètre -_-
    }
  });
  // TODO: ne pas choisir la question si elle a déja été utilisée
  return theQuestion;
}

function displayQuestion(id) {
  return new Promise((resolve, reject) => {
    getQuestion().then((theQuestion) => {
      //id a ajouter en parametre de la fonction des la modif de getQuestion()
      console.log('[' + theQuestion.theme + '] ' + theQuestion.question);
      const answers = theQuestion.answers;
      let i = 1;
      answers.forEach((answer) => {
        console.log('\t' + i + '. ' + answer);
        i++;
      });
      resolve();
    });
  });
}

function resolveQuestion(id, reponseUser) {
  return new Promise((resolve, reject) => {
    getQuestion().then((theQuestion) => {
      //id a ajouter en parametre de la fonction des la modif de getQuestion()
      if (theQuestion.correctAnswer === theQuestion.answers[reponseUser - 1]) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
}

function gameRound(player, questions, board) {
  console.info(player.name + ' joue !');
  let result = launchDice();
  console.info(player.name + ' lance le dé et fait ' + result);
  console.info(
    'Les cases à ' + result + ' déplacements de ' + player.name + ' sont : '
  );

  let voisins = board.getNeighbors(board.boxes[player.position], result);
  let indexVoisins = [];
  let casesVoisines = [];
  voisins.forEach((voisin) => {
    indexVoisins.push(voisin._id);
    if (voisin instanceof CheeseBox) {
      casesVoisines.push(
        'Case #' +
          voisin._id +
          ' [CASE CAMEMBERT] : Theme "' +
          voisin._theme.name +
          '"'
      );
    } else if (voisin instanceof ReplayBox) {
      casesVoisines.push('Case #' + voisin._id + ' [CASE REPLAY]');
    } else if (voisin instanceof CenterBox) {
      casesVoisines.push('Case #' + voisin._id + ' [CASE CENTRALE]');
    } else {
      casesVoisines.push(
        'Case #' + voisin._id + ' : Theme "' + voisin._theme.name + '"'
      );
    }
  });

  player.position =
    indexVoisins[
      readlineSync.keyInSelect(
        casesVoisines,
        'Sur quelle case ' + player.name + ' souhaite-t-il se deplacer ?',
        {
          cancel: false,
        }
      )
    ]; //CHOIX UTILISATEUR
  if (
    board.boxes[player.position] instanceof NormalBox ||
    board.boxes[player.position] instanceof CheeseBox ||
    board.boxes[player.position] instanceof CenterBox
  ) {
    let theme;
    if (board.boxes[player.position] instanceof CenterBox) {
      theme =
        board.themes[Math.floor(Math.random() * board.themes.length)].name;
      console.info(
        player.name +
          ' se déplace sur la case Centrale dont la catégorie aléatoire est "' +
          theme +
          '"'
      );
    } else {
      theme = board.boxes[player.position].theme.name;
      console.info(
        player.name +
          ' se déplace sur la case n°' +
          player.position +
          ' dont la catégories est "' +
          theme +
          '"'
      );
    }
    let question = pickAQuestion(questions, theme);
    console.log('[' + question.themeName + '] ' + question.question);
    console.log("[Bonne réponse : '" + question.correctAnswer + "']");
    let inputUser = readlineSync.keyInSelect(
      question.answers,
      'Quelle est la bonne réponse ?',
      {
        cancel: false,
      }
    );
    if (question.answers[inputUser] === question.correctAnswer) {
      console.log('Bien ouèj, gros !!');
      return true;
    } else {
      console.log('looser !');
      return false;
    }
  } else {
    return true;
  }
}

module.exports = {
  pickAQuestion,
  displayQuestion,
  resolveQuestion,
  gameRound,
};

//Getquestions(theme)
//pickQuestion(questions)
//GetQuestion(id)
//afficherQuestion(id)
//attendre la réponse utilisateur
//repondreQuestion(reponseUser)
