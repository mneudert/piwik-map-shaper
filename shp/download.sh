#!/usr/bin/env bash

cd "${0%/*}" || exit 127

wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces.zip -O ne_10m_admin_1_states_provinces.zip
unzip -j -o -d . ne_10m_admin_1_states_provinces.zip
