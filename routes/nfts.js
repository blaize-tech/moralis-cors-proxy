var express = require('express');

var axios = require('axios');
var cors = require('cors')

const web3 = require('web3');
const { async } = require('regenerator-runtime');
// const Moralis = require('moralis/node');

var router = express.Router();
module.exports = router;

// var corsOptions = {
//   origin: 'https://app.rad.live'
// }

router.get('/', cors(), async (req, res, next) => {
  const response = await axios.get(req.query.url);
  res.send(response.data);
});


router.param('collection_address', function(req, res, next, collection_address){
  if( !web3.utils.isAddress(collection_address) ) {
    const error = 'Invalid collection address ' + collection_address;
    console.error(error)
    next(new Error(error));
  }

  req.collection_address = collection_address;
  next();
});

router.param('token_id', function(req, res, next, token_id){
  req.token_id = token_id;
  next();
});


const MORALIS_API = 'https://deep-index.moralis.io/api/v2';
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
router.get('/:collection_address/:token_id', cors(), async (req, res, next) => {
  const chain = 'eth';
  const format = 'decimal'
  const moralis_request = `${MORALIS_API}/nft/${req.collection_address}/${req.token_id}?chain=${chain}&format=${format}`;
  console.info('requesting data', moralis_request);

  const response = await axios.get(
    moralis_request,
    {
      headers: {
        'accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY,
      }
    }
  );

  if ( !response.data.metadata ) {
    console.info('no metadata for', req.collection_address, req.token_id);
    
    if( !response.data.token_uri ) {
      console.error('no token_uri for', req.collection_address, req.token_id);      
    }

    const r = await axios.get(response.data.token_uri);
    res.send(r.data);
    
    return;
  }

  res.send(JSON.parse(response.data.metadata));
  return;
});