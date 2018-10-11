const Code = require('code');
const expect = Code.expect;

const {
  NormalBox,
  CheeseBox,
  ReplayBox,
  CenterBox,
} = require('./box.class.js');
const { createBoxes, createPaths } = require('./board.helpers.js');
const { NormalBoard } = require('./board.class.js');

describe('Generate a board', () => {
  it('Should generate an array of boxes with a pattern', (done) => {
    const themes = [
      { name: 'Histoire' },
      { name: 'Géographie' },
      { name: 'Science' },
      { name: 'Télévision' },
      { name: 'Théatre' },
      { name: 'Sport' },
    ];
    const boxes = createBoxes(themes);
    expect(boxes).to.be.an.array();
    expect(boxes).to.have.length(themes.length * themes.length * 2 + 1);
    expect(boxes[0], 'Objet').to.be.an.instanceOf(CenterBox);
    expect(boxes[themes.length], 'Objet').to.be.an.instanceOf(CheeseBox);
    expect(
      boxes[themes.length * themes.length + 2],
      'Objet'
    ).to.be.an.instanceOf(ReplayBox);

    //CATEGORIES :
    //Première branche
    expect(boxes[1].theme).to.be.equal(themes[0]);
    expect(boxes[2].theme).to.be.equal(themes[1]);
    expect(boxes[3].theme).to.be.equal(themes[2]);
    expect(boxes[4].theme).to.be.equal(themes[3]);
    expect(boxes[5].theme).to.be.equal(themes[4]);
    expect(boxes[6].theme).to.be.equal(themes[5]);

    //deuxième branche
    expect(boxes[7].theme).to.be.equal(themes[5]);
    expect(boxes[8].theme).to.be.equal(themes[2]);
    expect(boxes[9].theme).to.be.equal(themes[4]);
    expect(boxes[10].theme).to.be.equal(themes[0]);
    expect(boxes[11].theme).to.be.equal(themes[3]);
    expect(boxes[12].theme).to.be.equal(themes[1]);

    //dernière branche
    expect(boxes[31].theme).to.be.equal(themes[3]);
    expect(boxes[32].theme).to.be.equal(themes[5]);
    expect(boxes[33].theme).to.be.equal(themes[1]);
    expect(boxes[34].theme).to.be.equal(themes[4]);
    expect(boxes[35].theme).to.be.equal(themes[2]);
    expect(boxes[36].theme).to.be.equal(themes[0]);

    //Autour des cases camembert
    expect(boxes[37].theme).to.be.equal(themes[4]);
    expect(boxes[72].theme).to.be.equal(themes[4]);
    expect(boxes[42].theme).to.be.equal(themes[3]);
    expect(boxes[43].theme).to.be.equal(themes[3]);
    expect(boxes[48].theme).to.be.equal(themes[0]);
    expect(boxes[49].theme).to.be.equal(themes[0]);
    expect(boxes[54].theme).to.be.equal(themes[5]);
    expect(boxes[55].theme).to.be.equal(themes[5]);
    expect(boxes[60].theme).to.be.equal(themes[1]);
    expect(boxes[61].theme).to.be.equal(themes[1]);
    expect(boxes[66].theme).to.be.equal(themes[2]);
    expect(boxes[67].theme).to.be.equal(themes[2]);

    //Les dernieres
    expect(boxes[39].theme).to.be.equal(themes[2]);
    expect(boxes[40].theme).to.be.equal(themes[0]);
    expect(boxes[45].theme).to.be.equal(themes[4]);
    expect(boxes[46].theme).to.be.equal(themes[5]);
    expect(boxes[51].theme).to.be.equal(themes[3]);
    expect(boxes[52].theme).to.be.equal(themes[1]);
    expect(boxes[57].theme).to.be.equal(themes[0]);
    expect(boxes[58].theme).to.be.equal(themes[2]);
    expect(boxes[63].theme).to.be.equal(themes[5]);
    expect(boxes[64].theme).to.be.equal(themes[4]);
    expect(boxes[69].theme).to.be.equal(themes[1]);
    expect(boxes[70].theme).to.be.equal(themes[3]);

    done();
  });
  it('Should generate an array of paths (arrays) with a pattern', (done) => {
    const themes = [
      { name: 'Histoire' },
      { name: 'Géographie' },
      { name: 'Science' },
      { name: 'Télévision' },
      { name: 'Théatre' },
      { name: 'Sport' },
    ];
    let nbCat = themes.length;
    const boxes = createBoxes(themes);
    const paths = createPaths(nbCat, boxes);
    expect(paths, '#1').to.be.an.array();
    expect(paths, '#2').to.have.length(nbCat * 2 * 2);

    expect(paths[0], '#3').to.be.an.array();
    expect(paths[0], '#4').to.have.length(nbCat + 1);
    expect(paths[nbCat * 2], '#5').to.have.length(nbCat + 2);

    expect(paths[0][0], '#6').to.be.an.instanceOf(CenterBox);
    expect(paths[0][nbCat], '#7').to.be.an.instanceOf(CheeseBox);
    expect(paths[1][0], '#8').to.be.an.instanceOf(CheeseBox);
    expect(paths[1][nbCat], '#9').to.be.an.instanceOf(CenterBox);

    expect(paths[2][0], '#10').to.be.an.instanceOf(CenterBox);
    expect(paths[2][nbCat], '#11').to.be.an.instanceOf(CheeseBox);
    expect(paths[3][0], '#12').to.be.an.instanceOf(CheeseBox);
    expect(paths[3][nbCat], '#13').to.be.an.instanceOf(CenterBox);

    expect(paths[nbCat * 2][0], '#14').to.be.an.instanceOf(CheeseBox);
    expect(paths[nbCat * 2][2], '#15').to.be.an.instanceOf(ReplayBox);
    expect(paths[nbCat * 2 + 1][0], '#16').to.be.an.instanceOf(CheeseBox);
    expect(paths[nbCat * 2 + 1][2], '#17').to.be.an.instanceOf(ReplayBox);

    expect(paths[0][0], '#18').to.be.equal(paths[1][nbCat]);
    expect(paths[0][0], '#19').to.be.equal(paths[2][0]);

    expect(paths[0][nbCat], '#20').to.be.equal(paths[nbCat * 2][0]);
    expect(paths[0][nbCat], '#21').to.be.equal(paths[nbCat * 2 + 1][7]);
    expect(paths[0][nbCat], '#22').to.be.equal(paths[nbCat * 2 + 10][7]);
    expect(paths[0][nbCat], '#23').to.be.equal(paths[nbCat * 2 + 11][0]);

    done();
  });
  it('Should create an instance of NormalBoard', (done) => {
    let theBoard = new NormalBoard(6);
    theBoard
      .init()
      .then(() => {
        expect(theBoard).to.be.an.instanceOf(NormalBoard);
        expect(theBoard.getNeighbors(theBoard.boxes[4], 6)).to.be.an.array();

        let result = [
          theBoard.boxes[40],
          theBoard.boxes[69],
          theBoard.boxes[8],
          theBoard.boxes[14],
          theBoard.boxes[20],
          theBoard.boxes[26],
          theBoard.boxes[32],
        ];
        expect(
          theBoard.getNeighbors(theBoard.boxes[4], 6),
          'blop :'
        ).to.be.equal(result);

        result = [theBoard.boxes[3], theBoard.boxes[39], theBoard.boxes[70]];
        expect(
          theBoard.getNeighbors(theBoard.boxes[6], 3),
          'blop :'
        ).to.be.equal(result);

        result = [
          theBoard.boxes[38],
          theBoard.boxes[71],
          theBoard.boxes[47],
          theBoard.boxes[50],
          theBoard.boxes[53],
          theBoard.boxes[56],
          theBoard.boxes[59],
          theBoard.boxes[62],
          theBoard.boxes[65],
          theBoard.boxes[68],
          theBoard.boxes[1],
          theBoard.boxes[7],
          theBoard.boxes[19],
          theBoard.boxes[25],
          theBoard.boxes[31],
          theBoard.boxes[24],
          theBoard.boxes[9],
          theBoard.boxes[15],
          theBoard.boxes[21],
          theBoard.boxes[27],
          theBoard.boxes[33],
          theBoard.boxes[34],
          theBoard.boxes[65],
        ];
        expect(
          theBoard.getNeighbors(theBoard.boxes[42], 15),
          'blop :'
        ).to.be.equal(result);

        done();
      })
      .catch(done);
  });
});
