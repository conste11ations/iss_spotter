const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  return request('https://ipvigilante.com/json/'.concat(JSON.parse(body).ip));
};

const fetchISSFlyOverTimes = function(coords) {
  const { latitude, longitude } = JSON.parse(coords).data;
  const coordString = `lat=${latitude}&lon=${longitude}`;
  return request('http://api.open-notify.org/iss-pass.json?'.concat(coordString));
};

const nextISSTimesForMyLocation = function(passTimes) {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(data => {
    const { response } = JSON.parse(data);
    return response;
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
