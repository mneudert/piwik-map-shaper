const fs = require('fs');
const mapshaper = require('mapshaper');

const fileStatesProvinces = 'ne_10m_admin_1_states_provinces';
const geoStatesProvinces  = 'geo/' + fileStatesProvinces + '.json';
const shpStatesProvinces  = 'shp/' + fileStatesProvinces + '.shp';

let countries = [];

generateSVG = function(index) {
  const feature = countries[index];

  if (!feature) {
    return;
  }

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
    '-o ' + 'svg/' + feature + '.svg'
  ].join(' '), () => {
    console.log('generated: ' + feature + '.svg');

    generateSVG(index + 1);
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
