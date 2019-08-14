const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

app.use(bodyParser.json());

/*
 * Assignment 3: Create a blockchain
 *   Programmer: Donald MacPhail
 */

// Step 2: Reads the blockchain
app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

// Gets chain length
app.get('/api/blocks/length', (req, res) => {
  // Write your code here
  res.json(blockchain.chain.length);
  if(blockchain.chain.length > 0) {
    return res.status(200).send({ length: blockchain.chain.length });
  } else {
    return res.status(418).send({
      success: 'false',
      message: 'Chain does not exist or is empty.'
    })
  }
});

// Step 3: Mines a new block given the data is in the request body
app.post('/api/mine', (req, res) => {
  if(!req.body.data) {
    return res.status(400).send({
      success: 'false',
      message: 'data is required to mine a new block'
    })
  } else {
    const data = req.body;
    console.log(req.body);
    blockchain.addBlock({ data });

    pubsub.broadcastChain();

    res.redirect('/api/blocks'); 
  }
});

// Step 6: Starts peers through alternate ports
const DEFAULT_PORT = 8000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});

// Step 6: Synchronizes chains when new peers connected to the network.
const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);
  
        console.log('replace chain on a sync with', rootChain);
        blockchain.replaceChain(rootChain);
      }
    });
}  


