// read track file
const fs = require('fs');
const path = require('path');
const tj = require('@tmcw/togeojson');
const DOMParser = require("xmldom").DOMParser;
const turf = require('@turf/turf');
const { exit } = require('process');
const argc = process.argv.length;

if (argc < 5 || process.argv[2].startsWith("-h") || process.argv[2].startsWith("--help")) {
  console.log("Converts any number of gpx input files to a single geojson output.")
  console.log("Usage:");
  console.log("  node js/index.js tolerance input1.gpx input2.gpx ... output.geojson");
  console.log("where tolerance is a small number (try 0.001).")
  exit(1);
}

// first value is tolerance
const tolerance = Number(process.argv[2]);
// Array of source files
const inputFiles = process.argv.slice(3, argc - 1);
// last value is output filename
const outputFilename = process.argv[argc - 1];

// Tell what's going to happen
console.log("Converting and consolidating the following files:")
inputFiles.forEach(fname => console.log("   " + fname));
console.log("into the output file '%s'", outputFilename);

const allFeatures = [];
var simple;

// process all input files
const startTime = Date.now();
inputFiles.forEach(fix);

function fix(inputFilename) {

  console.log("\r\nConverting %s ...", inputFilename);

  // Read the source into an XML object
  const gpx = new DOMParser().parseFromString(fs.readFileSync(inputFilename, "utf8"));

  // Convert it to geojson
  const geo = tj.gpx(gpx);

  // Simplify it
  simple = turf.simplify(geo, { "tolerance": tolerance, "highQuality": true });

  // remove times
  simple.features.forEach(feature => {
    feature.properties.coordinateProperties = {}
  });

  // copy only the LineString Features
  simple.features.forEach( feature => {
    if(feature.geometry.type == "LineString")
    allFeatures.push(feature)
  });
}

// replace the features for the last simplified file with the array of all features
simple.features = allFeatures;

// and overwrite any existing output file
fs.writeFile(outputFilename, JSON.stringify(simple, null, null), { encoding: 'utf8', flag: 'w' },
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("geojson saved to " + outputFilename + " in " + (Date.now() - startTime) + " ms.");
    }
  });

console.log("Finished.");



