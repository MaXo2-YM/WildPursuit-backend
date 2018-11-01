const fetch = require('node-fetch');

module.exports = {
  getNewQuestions() {
    return new Promise((resolve, reject) => {
      fetch(
        `https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple`
      )
        .then((res) => res.json())
        .then((json) => resolve(json.results));
    });
  },
};
