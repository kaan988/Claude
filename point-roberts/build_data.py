# Wrap data as JS globals (page needs no fetch)
import json
g = {k: json.load(open(f'data/{k}.json')) for k in ('land-50m', 'countries-50m', 'land-10m', 'countries-10m')}
g['lines'] = json.load(open('data/ne_10m_geographic_lines.geojson'))
open('data/geo.js', 'w').write('window.PR_GEO=' + json.dumps(g, separators=(',', ':')) + ';')
open('data/meta.js', 'w').write('window.PR_TILES=' + open('tiles/meta.json').read() + ';window.PR_BORDER49=' + open('tiles/border49.json').read() + ';')
open('data/words.js', 'w').write('window.PR_WORDS=' + open('audio/words.json').read() + ';')
