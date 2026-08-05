'use client';

import { useEffect, useMemo, useState } from 'react';

const UMAMI_BASE_URL = 'https://cloud.umami.is/analytics/eu';
const SHARE_SLUG = 'eUd9fp3KEisTmzQS';
const RECENT_DAYS = 90;
const MAP_WIDTH = 360;
const MAP_HEIGHT = 200;

interface ShareContext {
    token: string;
    websiteId: string;
}

interface CountryMetric {
    x: string;
    y: number;
}

interface GeoFeature {
    id?: string;
    properties?: { name?: string };
    geometry: {
        type: 'Polygon' | 'MultiPolygon';
        coordinates: number[][][] | number[][][][];
    };
}

interface GeoCollection {
    features: GeoFeature[];
}

interface HoveredCountry {
    name: string;
    visitors: number;
    x: number;
    y: number;
}

const countryNameAliases: Record<string, string> = {
    BO: 'Bolivia',
    BN: 'Brunei',
    CD: 'Democratic Republic of the Congo',
    CG: 'Republic of the Congo',
    CI: "Cote d'Ivoire",
    CZ: 'Czech Republic',
    IR: 'Iran',
    KP: 'North Korea',
    KR: 'South Korea',
    LA: 'Laos',
    MD: 'Moldova',
    PS: 'Palestine',
    RU: 'Russia',
    SY: 'Syria',
    TZ: 'United Republic of Tanzania',
    US: 'United States of America',
    VE: 'Venezuela',
    VN: 'Vietnam',
};

// The compact world GeoJSON omits several microstates and city-sized regions.
const fallbackCountryCoordinates: Record<string, [number, number]> = {
    AD: [1.6016, 42.5462],
    BH: [50.5577, 26.0667],
    HK: [114.1694, 22.3193],
    LI: [9.5554, 47.166],
    LU: [6.1296, 49.8153],
    MC: [7.4246, 43.7384],
    MO: [113.5439, 22.1987],
    MT: [14.3754, 35.9375],
    SG: [103.8198, 1.3521],
    SM: [12.4578, 43.9424],
    VA: [12.4534, 41.9029],
};

function normalizeCountryName(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z]/g, '')
        .toLowerCase();
}

function getMetricCountryName(code: string, displayNames: Intl.DisplayNames) {
    return countryNameAliases[code] || displayNames.of(code) || code;
}

function projectCoordinate(longitude: number, latitude: number) {
    const x = ((longitude + 180) / 360) * MAP_WIDTH;
    const boundedLatitude = Math.max(-60, Math.min(85, latitude));
    const y = ((85 - boundedLatitude) / 145) * MAP_HEIGHT;
    return { x, y };
}

function ringToPath(ring: number[][]) {
    return ring.map(([longitude, latitude], index) => {
        const { x, y } = projectCoordinate(longitude, latitude);
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ') + ' Z';
}

function featureToPath(feature: GeoFeature) {
    if (feature.geometry.type === 'Polygon') {
        return (feature.geometry.coordinates as number[][][]).map(ringToPath).join(' ');
    }
    return (feature.geometry.coordinates as number[][][][])
        .flatMap((polygon) => polygon.map(ringToPath))
        .join(' ');
}

function getRingArea(ring: number[][]) {
    return Math.abs(ring.reduce((area, [x, y], index) => {
        const [nextX, nextY] = ring[(index + 1) % ring.length];
        return area + x * nextY - nextX * y;
    }, 0) / 2);
}

function getFeatureCenter(feature: GeoFeature) {
    const polygons = feature.geometry.type === 'Polygon'
        ? [feature.geometry.coordinates as number[][][]]
        : feature.geometry.coordinates as number[][][][];
    const mainRing = polygons
        .map((polygon) => polygon[0])
        .filter((ring) => ring?.length > 2)
        .sort((a, b) => getRingArea(b) - getRingArea(a))[0];
    if (!mainRing) return null;

    let crossSum = 0;
    let longitudeSum = 0;
    let latitudeSum = 0;
    mainRing.forEach(([longitude, latitude], index) => {
        const [nextLongitude, nextLatitude] = mainRing[(index + 1) % mainRing.length];
        const cross = longitude * nextLatitude - nextLongitude * latitude;
        crossSum += cross;
        longitudeSum += (longitude + nextLongitude) * cross;
        latitudeSum += (latitude + nextLatitude) * cross;
    });

    if (Math.abs(crossSum) < 0.000001) {
        return projectCoordinate(mainRing[0][0], mainRing[0][1]);
    }
    return projectCoordinate(
        longitudeSum / (3 * crossSum),
        latitudeSum / (3 * crossSum),
    );
}

export default function UmamiVisitorsMap() {
    const [features, setFeatures] = useState<GeoFeature[]>([]);
    const [metrics, setMetrics] = useState<CountryMetric[]>([]);
    const [hoveredCountry, setHoveredCountry] = useState<HoveredCountry | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadMapData() {
            const shareResponse = await fetch(`${UMAMI_BASE_URL}/api/share/${SHARE_SLUG}`, {
                signal: controller.signal,
            });
            if (!shareResponse.ok) throw new Error('Unable to load Umami share context');
            const share = await shareResponse.json() as ShareContext;

            const endAt = Date.now();
            const startAt = endAt - RECENT_DAYS * 24 * 60 * 60 * 1000;
            const metricsUrl = new URL(`${UMAMI_BASE_URL}/api/websites/${share.websiteId}/metrics`);
            metricsUrl.searchParams.set('startAt', String(startAt));
            metricsUrl.searchParams.set('endAt', String(endAt));
            metricsUrl.searchParams.set('type', 'country');
            metricsUrl.searchParams.set('limit', '250');

            const [metricsResponse, mapResponse] = await Promise.all([
                fetch(metricsUrl, {
                    headers: {
                        'x-umami-share-context': SHARE_SLUG,
                        'x-umami-share-token': share.token,
                    },
                    signal: controller.signal,
                }),
                fetch(`${UMAMI_BASE_URL}/datamaps.world.json`, { signal: controller.signal }),
            ]);
            if (!metricsResponse.ok || !mapResponse.ok) throw new Error('Unable to load visitor map data');

            const countryMetrics = await metricsResponse.json() as CountryMetric[];
            const worldMap = await mapResponse.json() as GeoCollection;
            setMetrics(Array.isArray(countryMetrics) ? countryMetrics : []);
            setFeatures(worldMap.features.filter((feature) => feature.id !== 'ATA'));
        }

        loadMapData().catch((error) => {
            if (error instanceof DOMException && error.name === 'AbortError') return;
        });
        return () => controller.abort();
    }, []);

    const mapData = useMemo(() => {
        const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
        const countsByName = new Map(metrics.map((metric) => [
            normalizeCountryName(getMetricCountryName(metric.x, displayNames)),
            metric.y,
        ]));
        const maxVisitors = Math.max(1, ...metrics.map((metric) => metric.y));
        const featureNames = new Set(features.map((feature) => normalizeCountryName(
            feature.properties?.name || feature.id || '',
        )));

        const countries = features.map((feature) => {
            const name = feature.properties?.name || feature.id || 'Unknown';
            const visitors = countsByName.get(normalizeCountryName(name)) || 0;
            return {
                id: feature.id || name,
                name,
                visitors,
                path: featureToPath(feature),
                center: visitors > 0 ? getFeatureCenter(feature) : null,
                intensity: visitors > 0 ? 0.35 + 0.65 * Math.sqrt(visitors / maxVisitors) : 0,
                radius: visitors > 0 ? 1.4 + 1.4 * Math.sqrt(visitors / maxVisitors) : 0,
            };
        });

        const standaloneMarkers = metrics.flatMap((metric) => {
            const name = getMetricCountryName(metric.x, displayNames);
            if (featureNames.has(normalizeCountryName(name))) return [];
            const coordinates = fallbackCountryCoordinates[metric.x];
            if (!coordinates) return [];
            return [{
                id: `${metric.x}-standalone`,
                name,
                visitors: metric.y,
                center: projectCoordinate(coordinates[0], coordinates[1]),
                radius: 1.4 + 1.4 * Math.sqrt(metric.y / maxVisitors),
            }];
        });

        return { countries, standaloneMarkers };
    }, [features, metrics]);

    const showTooltip = (event: React.PointerEvent<SVGElement>, name: string, visitors: number) => {
        const svg = event.currentTarget.ownerSVGElement;
        if (!svg) return;
        const bounds = svg.getBoundingClientRect();
        setHoveredCountry({
            name,
            visitors,
            x: ((event.clientX - bounds.left) / bounds.width) * MAP_WIDTH,
            y: ((event.clientY - bounds.top) / bounds.height) * MAP_HEIGHT,
        });
    };

    return (
        <section className="mb-6" aria-label="Recent visitors by country">
            <h3 className="font-semibold text-primary mb-3 text-center text-sm">Visitors</h3>
            <div className="relative w-full max-w-[360px] aspect-[9/5] mx-auto overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-800 shadow-sm">
                <svg
                    viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                    className="block w-full h-full"
                    role="img"
                    aria-label="Map of visitors during the last 90 days"
                >
                    {mapData.countries.map((country) => (
                        <path
                            key={country.id}
                            d={country.path}
                            fill={country.visitors > 0 ? `rgba(96, 165, 250, ${country.intensity})` : undefined}
                            fillRule="evenodd"
                            className={country.visitors > 0
                                ? 'stroke-white dark:stroke-neutral-900'
                                : 'fill-neutral-200 stroke-white dark:fill-neutral-700 dark:stroke-neutral-900'}
                            strokeWidth="0.55"
                            vectorEffect="non-scaling-stroke"
                            onPointerMove={country.visitors > 0
                                ? (event) => showTooltip(event, country.name, country.visitors)
                                : undefined}
                            onPointerLeave={country.visitors > 0 ? () => setHoveredCountry(null) : undefined}
                        />
                    ))}
                    {[...mapData.countries.filter((country) => country.center), ...mapData.standaloneMarkers].map((country) => (
                        <circle
                            key={`${country.id}-marker`}
                            cx={country.center!.x}
                            cy={country.center!.y}
                            r={country.radius}
                            className="fill-red-500 stroke-white dark:fill-red-400 dark:stroke-neutral-100"
                            strokeWidth="0.8"
                            vectorEffect="non-scaling-stroke"
                            onPointerMove={(event) => showTooltip(event, country.name, country.visitors)}
                            onPointerLeave={() => setHoveredCountry(null)}
                        />
                    ))}
                </svg>
                {hoveredCountry && (
                    <div
                        className="pointer-events-none absolute z-10 rounded bg-neutral-900/90 px-2 py-1 text-xs text-white shadow-md whitespace-nowrap"
                        style={{
                            left: `${Math.min((hoveredCountry.x / MAP_WIDTH) * 100, 72)}%`,
                            top: `${Math.max((hoveredCountry.y / MAP_HEIGHT) * 100 - 15, 2)}%`,
                        }}
                    >
                        {hoveredCountry.name} · {hoveredCountry.visitors}
                    </div>
                )}
            </div>
        </section>
    );
}
