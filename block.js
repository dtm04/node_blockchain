const cryptoHash = require('./crypto-hash')
const { GENESIS_DATA, MINE_RATE } = require('./config');

class Block {
  constructor({ timestamp, prevHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  /**
   * Creates genesis block using the GENESIS_DATA in config.js
   *
   * @return a genesis block
   */
  static genesis() {
    return new this(GENESIS_DATA);
  }

  /**
   * Mines a block
   * Hint: Loop through different nonce values to find the golden nonce 
   * based on the difficulty set by the lastBlock
   * 
   * @param { lastBlock, data } dictionary of lastBlock and data
   * @return a new block
   */
  static mineBlock({ lastBlock, data }) {
    const prevHash = lastBlock.hash;
    let hash, timestamp;
    let difficulty = lastBlock.difficulty;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty( { lastBlock: lastBlock, timestamp } );
      hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);
      console.log(hash);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this({ timestamp, prevHash, data, difficulty, nonce, hash });
  }

  /**
   * Calculates block difficulty based on MINE_RATE in miliseconds
   * Hints:
   * - if time to mine a new block from last block > MINE_RATE, then difficulty is reduced by 1
   * - else the difficulty is increased by 1
   * 
   * @param { lastBlock, timestamp } dictionary of lastBlock and current timestamp
   * @return new difficulty
   */
  static adjustDifficulty({ lastBlock, timestamp }) {
    //console.log(lastBlock.difficulty);
    //console.log(`This: ${timestamp}, Last: ${lastBlock.timestamp}, Difference: ${timestamp - lastBlock.timestamp}`);
    // Write your code here
    let difficulty;
    if((timestamp - lastBlock.timestamp) > MINE_RATE) {
       difficulty = lastBlock.difficulty - 1;
       return (difficulty <= 1 ? 1 : difficulty);
    } else {
      return lastBlock.difficulty + 1;
    }
  }
}

module.exports = Block;