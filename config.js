const MINE_RATE = 1000;

const INITIAL_DIFFICULTY = 4;

const GENESIS_DATA = {
  timestamp: 1,
  prevHash: '0',
  hash: '0',
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: 'genesis block'
};

module.exports = {
  GENESIS_DATA,
  MINE_RATE
};