const mapshaper = require('mapshaper');

const fileStatesProvinces = 'ne_10m_admin_1_states_provinces';
const geoStatesProvinces  = 'geo/' + fileStatesProvinces + '.json';
const shpStatesProvinces  = 'shp/' + fileStatesProvinces + '.shp';

console.log('convert: shp => json');
mapshaper.runCommands([
  '-i ' + shpStatesProvinces,
  '-o ' + geoStatesProvinces
].join(' '), () => { console.log('convert: shp => json [done!]'); });
