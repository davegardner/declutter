# declutter

A nodejs utility to prepare track and route files from OpenCPN for use with the Anjea website.

OpenCPN can export track and route files as Google GPX (XML) files. To make these files suitable for use with Mapbox in the Anjea Website we need to:

- Convert to JSON
- Simplify the files as they contain way too many unnecessary points.
- Discard Waypoints (why does OpenCPN include Waypoint data in Route files?)
- Combine multiple GPX files (some route, some track) into a single file.

Declutter uses various libraries to accomplish these tasks.

