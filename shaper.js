const fs = require('fs');
const mapshaper = require('mapshaper');
const xml2js = require('xml2js');

const fileStatesProvinces = 'ne_10m_admin_1_states_provinces';
const geoStatesProvinces  = 'geo/' + fileStatesProvinces + '.json';
const shpStatesProvinces  = 'shp/' + fileStatesProvinces + '.shp';

let countries = [];

generateSVG = function(index) {
  const feature = countries[index];

  if (!feature) {
    return;
  }

  const svgFile    = 'svg/' + feature + '.svg';
  const properties = [
    'adm0_a3',
    'name',
    'fips', 'fips_alt'
  ].join(' + \'~~~\' + ');

  mapshaper.runCommands([
    '-i ' + geoStatesProvinces,
    '-proj gall',
    '-filter "adm0_a3 == \'' + feature + '\'"',
    '-each "this.properties = { FID: ' + properties + ' }"',
    '-o ' + svgFile
  ].join(' '), () => {
    fs.readFile(svgFile, 'utf-8', function(err, data) {
      xml2js.parseString(data, function(err, result) {
        result.svg.g[0].$['data-iso'] = result.svg.g[0].$.id;

        delete result.svg.g[0].$.id;

        result.svg.g[0].path.forEach(function(path, index) {
          const idData = result.svg.g[0].path[index].$.id.split('~~~');

          result.svg.g[0].path[index].$['data-iso3']  = idData[0];
          result.svg.g[0].path[index].$['data-name']  = idData[1];
          result.svg.g[0].path[index].$['data-fips']  = idData[2];
          result.svg.g[0].path[index].$['data-fips-'] = idData[3];

          delete result.svg.g[0].path[index].$.id;
        });

        const builder = new xml2js.Builder();
        const xml = builder.buildObject(result);

        fs.writeFile(svgFile, xml, function(err, data) {
          console.log('generated: ' + feature + '.svg');

          //generateSVG(index + 1);
          return;
        });
      });
    });
  });
};

console.log('convert: shp => json');
mapshaper.runCommands([
  '-i ' + shpStatesProvinces,
  '-o ' + geoStatesProvinces
].join(' '), () => {
  console.log('convert: shp => json [done!]');
  console.log('convert: json => svg');

  countries = JSON.parse(
    fs.readFileSync(geoStatesProvinces, 'utf8')
  )['features'].reduce((acc, feature) => {
    if (feature['properties']
      && feature['properties']['adm0_a3']
      && -1 === acc.indexOf(feature['properties']['adm0_a3'])
    ) {
      acc.push(feature['properties']['adm0_a3']);
    }

    return acc;
  }, []);

  generateSVG(0);
});
