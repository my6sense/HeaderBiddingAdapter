const {registerBidder} = require('../src/adapters/bidderFactory');

const BIDDER_CODE = 'my6sense';
const END_POINT = 'http://papi.mynativeplatform.com/pub2/web/hbwidget.json';
const END_POINT_METHOD = 'POST';

function isBidRequestValid(bid) {
  return !(bid.bidder !== BIDDER_CODE || !bid.params || !bid.params.key);
}

function buildRequests(validBidRequests) {
  let requests = [];

  if (validBidRequests && validBidRequests.length) {
    validBidRequests.forEach(bidRequest => {
      bidRequest.widget_num = 1; // mandatory property for server side

      requests.push({
        url: `${END_POINT}?widget_key=${bidRequest.params.key}`, // mandatory query string for server side
        method: END_POINT_METHOD,
        data: JSON.stringify(bidRequest)
      });
    });
  }

  return requests;
}

function interpretResponse(serverResponse) {
  const bidResponses = [];

  // currently server returns a single response which is the body property
  if (serverResponse.body) {
    serverResponse.body.bidderCode = BIDDER_CODE;
    // serverResponse.body.cpm = 7;
    bidResponses.push(serverResponse.body);
  }

  return bidResponses;
}

const spec = {
  code: BIDDER_CODE,
  isBidRequestValid,
  buildRequests,
  interpretResponse,
};

registerBidder(spec);

module.exports = spec;
