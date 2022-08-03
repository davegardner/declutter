// read track file
const fs = require('fs');
const path = require('path');
const tj = require('@tmcw/togeojson');
const DOMParser = require("xmldom").DOMParser;
const turf = require('@turf/turf');


// Array of source files
const inputFiles = [
  "/home/dave/Anjea/Routes/all.gpx",
  "/home/dave/Anjea/Routes/Track to Tanga.gpx"
];

// TODO: some files, such as all.gpx, contain multiple routes (features).
// These need to be joined together into a single feature because
// mapbox will not accept multiple features.

inputFiles.forEach(fix);

function fix(inputFilename) {

  // timing
  const startTime = Date.now();

  // Derive output filename by changing the extension and writing to current directory
  const outputFilenameObject = path.parse(inputFilename);
  outputFilenameObject.ext = ".geojson";
  outputFilenameObject.base = null;
  outputFilenameObject.dir = ".";
  const outputFilename = path.format(outputFilenameObject);

  console.log("Converting %s ...", inputFilename);

  // Read the source into an XML object
  const gpx = new DOMParser().parseFromString(fs.readFileSync(inputFilename, "utf8"));

  // Convert it
  const geo = tj.gpx(gpx);

  // Simplify it
  const simple = turf.simplify(geo, { "tolerance": 0.0001, "highQuality": true });

  // overwrite any existing file
  fs.writeFile(outputFilename, JSON.stringify(simple, null, null), { encoding: 'utf8', flag: 'w' },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename + " in " + (Date.now() - startTime) + " ms.");
      }
    });

}



