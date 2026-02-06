#!/usr/bin/env node
/**
 * Script to generate accurate SVG paths from GeoJSON data
 * Run: node scripts/generate-map-paths.js
 *
 * This fetches real geographic boundaries from okfse/sweden-geojson
 * and converts them to SVG paths for JonkopingMap.tsx
 */

const GEOJSON_URL = 'https://raw.githubusercontent.com/okfse/sweden-geojson/master/swedish_municipalities.geojson';

const JONKOPING_MUNICIPALITIES = [
  'Aneby', 'Eksjö', 'Gislaved', 'Gnosjö', 'Habo',
  'Jönköping', 'Mullsjö', 'Nässjö', 'Sävsjö',
  'Tranås', 'Vaggeryd', 'Vetlanda', 'Värnamo'
];

const SLUG_MAP = {
  'Aneby': 'aneby',
  'Eksjö': 'eksjo',
  'Gislaved': 'gislaved',
  'Gnosjö': 'gnosjo',
  'Habo': 'habo',
  'Jönköping': 'jonkoping',
  'Mullsjö': 'mullsjo',
  'Nässjö': 'nassjo',
  'Sävsjö': 'savsjo',
  'Tranås': 'tranas',
  'Vaggeryd': 'vaggeryd',
  'Vetlanda': 'vetlanda',
  'Värnamo': 'varnamo'
};

async function fetchGeoJSON() {
  console.log('Fetching GeoJSON from GitHub...');
  const response = await fetch(GEOJSON_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return response.json();
}

function getBounds(features) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const feature of features) {
    const coords = feature.geometry.type === 'Polygon'
      ? feature.geometry.coordinates
      : feature.geometry.coordinates.flat();

    for (const ring of coords) {
      for (const [x, y] of ring) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return { minX, minY, maxX, maxY };
}

function coordsToSVGPath(coords, bounds, width, height, padding) {
  const { minX, minY, maxX, maxY } = bounds;
  const scaleX = (width - 2 * padding) / (maxX - minX);
  const scaleY = (height - 2 * padding) / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);

  const transform = ([x, y]) => {
    // Flip Y axis (SVG Y goes down, geo Y goes up)
    const svgX = padding + (x - minX) * scale;
    const svgY = height - padding - (y - minY) * scale;
    return [Math.round(svgX), Math.round(svgY)];
  };

  const rings = coords[0] ? (Array.isArray(coords[0][0]) ? coords : [coords]) : [];

  let path = '';
  for (const ring of rings) {
    if (!ring || ring.length === 0) continue;

    // Simplify path - take every Nth point for smaller file
    const simplified = ring.filter((_, i) => i % 3 === 0 || i === ring.length - 1);

    const points = simplified.map(transform);
    path += `M${points[0][0]},${points[0][1]} `;
    for (let i = 1; i < points.length; i++) {
      path += `L${points[i][0]},${points[i][1]} `;
    }
    path += 'Z ';
  }

  return path.trim();
}

function getCentroid(coords) {
  const ring = coords[0] || coords;
  let sumX = 0, sumY = 0, count = 0;

  for (const [x, y] of ring) {
    sumX += x;
    sumY += y;
    count++;
  }

  return [sumX / count, sumY / count];
}

async function main() {
  try {
    const geojson = await fetchGeoJSON();

    // Filter Jönköping municipalities
    const jonkopingFeatures = geojson.features.filter(f =>
      JONKOPING_MUNICIPALITIES.includes(f.properties.name)
    );

    if (jonkopingFeatures.length !== 13) {
      console.warn(`Warning: Found ${jonkopingFeatures.length} municipalities, expected 13`);
      console.log('Found:', jonkopingFeatures.map(f => f.properties.name).join(', '));
    }

    // Get bounds for all features
    const bounds = getBounds(jonkopingFeatures);
    console.log('Bounds:', bounds);

    // SVG dimensions
    const width = 500;
    const height = 650;
    const padding = 20;

    // Generate paths
    console.log('\n// Generated SVG paths for Jönköpings län');
    console.log('// Copy this into components/JonkopingMap.tsx\n');
    console.log('const KOMMUN_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {');

    const scaleX = (width - 2 * padding) / (bounds.maxX - bounds.minX);
    const scaleY = (height - 2 * padding) / (bounds.maxY - bounds.minY);
    const scale = Math.min(scaleX, scaleY);

    for (const feature of jonkopingFeatures) {
      const name = feature.properties.name;
      const slug = SLUG_MAP[name];
      const coords = feature.geometry.type === 'Polygon'
        ? feature.geometry.coordinates
        : feature.geometry.coordinates[0]; // Take largest polygon for MultiPolygon

      const path = coordsToSVGPath(coords, bounds, width, height, padding);
      const [centX, centY] = getCentroid(coords);

      // Transform centroid
      const labelX = Math.round(padding + (centX - bounds.minX) * scale);
      const labelY = Math.round(height - padding - (centY - bounds.minY) * scale);

      console.log(`  ${slug}: {`);
      console.log(`    path: \`${path}\`,`);
      console.log(`    labelX: ${labelX},`);
      console.log(`    labelY: ${labelY},`);
      console.log(`  },`);
    }

    console.log('};');
    console.log(`\n// ViewBox: "0 0 ${width} ${height}"`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
