/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (errorMain, response, body) => {
    if (errorMain) {
      return callback(errorMain, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request('https://ipvigilante.com/json/'.concat(ip), (errorMain, response, body) => {
    if (errorMain) {
      return callback(errorMain, null);
    } else {
      if (response.statusCode !== 200) {
        callback(`Status Code ${response.statusCode} when fetching coords: ${body}`, null);
        return;
      }
      const status  = JSON.parse(body).status;
      if (status !== "success") {
        callback(Error(`Status was not a success: ${status}`), null);
        return;
      }
    }
    const { latitude, longitude } = JSON.parse(body).data;
    callback(null, { latitude, longitude });
    
  });

};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   { latitude: '49.27670', longitude: '-123.13000' }
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const coordString = `lat=${coords.latitude}&lon=${coords.longitude}`;
  request('http://api.open-notify.org/iss-pass.json?'.concat(coordString), (errorMain, response, body) => {
    if (errorMain) {
      return callback(errorMain, null);
    } else {
      if (response.statusCode !== 200) {
        callback(`Status Code ${response.statusCode} when fetching pass times: ${body}`, null);
        return;
      }
      const passTimeResponse  = JSON.parse(body).response;
      return callback(null, passTimeResponse);
    }
    
  });
};
/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };

