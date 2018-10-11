require('./db'); // init the db connection
const Hapi = require('hapi');
const server = Hapi.server({ port: 5000 });
const io = require('socket.io')(server.listener);
const { launchGame } = require('./game/game.controller.js');

// require('./syncModels.js'); //Pour synchroniser les models avec la BDD

async function start() {
  try {
    if (!module.parent) {
      await server.start((error) => {
        process.exit(1);
      });
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  console.log('Server running at : ', server.info.uri);
}
start().then(() => {
  let id = Math.ceil(Math.random() * 10000);
  let infos = { nbPlayers: 6, countDown: 10 };

  launchGame(id, 6, infos.nbPlayers, infos.countDown);
});

server.route(require('./question/question.routes'));

module.exports = server;
