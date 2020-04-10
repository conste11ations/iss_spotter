const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss_promised');

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};
// the solution
nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });

// One (long) solution:
// fetchMyIP()
//   .then(body => fetchCoordsByIP(body))
//   .then(coords => fetchISSFlyOverTimes(coords))
//   .then(passTimes => nextISSTimesForMyLocation(passTimes))
//   .then(result => printPassTimes(result));

// One shorter solution:
// fetchMyIP()
//   .then(fetchCoordsByIP)
//   .then(fetchISSFlyOverTimes)
//   .then(nextISSTimesForMyLocation)
//   .then(printPassTimes)
