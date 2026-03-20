'use client';

import { useEffect, useRef } from 'react';
import { withBasePath } from '@/lib/basePath';

declare global {
  var am5: any;
  var am5map: any;
  var am5geodata_worldLow: any;
  var am5themes_Animated: any;
}

export default function InteractiveMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMap = async () => {
      // Wait for amCharts to load
      const checkAm5 = setInterval(() => {
        if (typeof window !== 'undefined' && window.am5 && window.am5map && window.am5geodata_worldLow) {
          clearInterval(checkAm5);
          initializeMap();
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => clearInterval(checkAm5), 5000);
    };

    const initializeMap = () => {
      if (!containerRef.current || !window.am5) return;

      try {
        const root = window.am5.Root.new('chartdiv');
        root.setThemes([new window.am5themes_Animated(root)]);

        const chart = root.container.children.push(
          new window.am5map.MapChart(root, {
            panX: 'rotateX',
            panY: 'translateY',
            projection: new window.am5map.geoMercator(),
            paddingBottom: 20,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20
          })
        );

        const worldSeries = chart.series.push(
          new window.am5map.MapPolygonSeries(root, {
            geoJSON: window.am5geodata_worldLow,
            exclude: ['AQ']
          })
        );

        worldSeries.mapPolygons.template.setAll({
          tooltipText: '{name}',
          interactive: true,
          fill: window.am5.color(0xE4E4E4),
          stroke: window.am5.color(0xFFFFFF)
        });

        worldSeries.mapPolygons.template.states.create('hover', {
          fill: window.am5.color(0xDDDDDD)
        });

        const livedData = { CN: '2001 – 2023', SG: '2023 – now' };
        const visitedData = {
          US: 'Jan 2024, Feb 2025',
          MX: 'Dec 2023',
          JP: 'Apr 2024, Nov 2024',
          DE: 'Jul 2019',
          MY: '2023, 2024, 2025',
          TH: '2025',
          ID: '2025'
        };
        const plannedData = { GB: 'Planning', IT: 'Planning', AU: 'Planning' };

        const createColoredSeries = (data: any, color: number, label: string) => {
          const series = chart.series.push(
            new window.am5map.MapPolygonSeries(root, {
              geoJSON: window.am5geodata_worldLow,
              include: Object.keys(data)
            })
          );
          series.mapPolygons.template.setAll({
            interactive: true,
            fill: window.am5.color(color),
            stroke: window.am5.color(0xFFFFFF)
          });
          series.mapPolygons.template.adapters.add('tooltipText', function (_: any, target: any) {
            const id = target.dataItem.dataContext.id;
            if (label === 'Lived') {
              return `{name}: Lived\n居住时间：${data[id]}`;
            } else if (label === 'Visited') {
              return `{name}: Visited\n访问时间：${data[id]}`;
            } else {
              return `{name}: ${data[id]}`;
            }
          });
          return series;
        };

        createColoredSeries(livedData, 0x2255AA, 'Lived');
        createColoredSeries(visitedData, 0x5588DD, 'Visited');
        createColoredSeries(plannedData, 0x99CCFF, 'Planned');

        const cityMarkers = [
          { title: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 },
          { title: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
          { title: 'San Diego', latitude: 32.7157, longitude: -117.1611 },
          { title: 'Tijuana', latitude: 32.5149, longitude: -117.0382 },
          { title: 'Mexico City', latitude: 19.4326, longitude: -99.1332 },
          { title: 'Guanajuato', latitude: 21.0181, longitude: -101.2583 },
          { title: 'San Miguel', latitude: 20.9144, longitude: -100.7431 },
          { title: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
          { title: 'Semporna', latitude: 4.4818, longitude: 118.6110 },
          { title: 'Shanghai', latitude: 31.2304, longitude: 121.4737 },
          { title: 'Beijing', latitude: 39.9042, longitude: 116.4074 },
          { title: 'Lhasa', latitude: 29.6520, longitude: 91.1721 },
          { title: 'Xining', latitude: 36.6171, longitude: 101.7782 },
          { title: 'Chengdu', latitude: 30.5728, longitude: 104.0668 },
          { title: 'Wuhan', latitude: 30.5928, longitude: 114.3055 },
          { title: 'Chongqing', latitude: 29.5630, longitude: 106.5516 },
          { title: 'Changsha', latitude: 28.2282, longitude: 112.9388 },
          { title: 'Hong Kong', latitude: 22.3193, longitude: 114.1694 },
          { title: 'Huai\'an', latitude: 33.5785, longitude: 119.0302 },
          { title: 'Frankfurt', latitude: 50.1109, longitude: 8.6821 },
          { title: 'Hanover', latitude: 52.3759, longitude: 9.7320 },
          { title: 'Berlin', latitude: 52.5200, longitude: 13.4050 },
          { title: 'Hamburg', latitude: 53.5511, longitude: 9.9937 },
          { title: 'Kuala Lumpur', latitude: 3.1390, longitude: 101.6869 },
          { title: 'Johor Bahru', latitude: 1.4927, longitude: 103.7414 },
          { title: 'Penang', latitude: 5.4164, longitude: 100.3327 },
          { title: 'Surabaya', latitude: -7.2575, longitude: 112.7521 },
          { title: 'Phuket', latitude: 7.8804, longitude: 98.3923 },
          { title: 'Tokyo', latitude: 35.6764, longitude: 139.6500 },
          { title: 'Osaka', latitude: 34.6937, longitude: 135.5023 },
          { title: 'Kyoto', latitude: 35.0116, longitude: 135.7681 },
          { title: 'Kobe', latitude: 34.6901, longitude: 135.1955 },
          { title: 'Yokohama', latitude: 35.4437, longitude: 139.6380 }
        ];

        const citySeries = chart.series.push(
          new window.am5map.MapPointSeries(root, {
            latitudeField: 'latitude',
            longitudeField: 'longitude'
          })
        );

        citySeries.bullets.push(function (root: any, dataItem: any) {
          return window.am5.Bullet.new(root, {
            sprite: new window.am5.Circle(root, {
              radius: 5,
              tooltipText: '{title}',
              fill: window.am5.color(0xCC0000),
              stroke: window.am5.color(0xffffff),
              strokeWidth: 1
            })
          });
        });

        citySeries.data.setAll(cityMarkers);

        chart.set('zoomControl', new window.am5map.ZoomControl(root, {}));
        chart.chartContainer.get('background').events.on('click', function () {
          chart.goHome();
        });

        chart.appear(1000, 100);
      } catch (error) {
        console.error('地图渲染失败：', error);
      }
    };

    loadMap();
  }, []);

  return (
    <>
      <style>{`
        .photo-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 15px;
          margin-bottom: 30px;
        }

        .gallery-column {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .gallery-item:hover {
          transform: translateY(-5px);
        }

        .gallery-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .gallery-item .caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .photo-gallery {
            grid-template-columns: 1fr;
          }
        }

        #chartdiv {
          width: 100%;
          height: 600px;
          margin: 20px 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="photo-gallery">
        <div className="gallery-column">
          <div className="gallery-item">
            <img src={withBasePath('/images/basketball1.png')} alt="Basketball" />
            <div className="caption">Basketball</div>
          </div>
          <div className="gallery-item">
            <img src={withBasePath('/images/basketball2.png')} alt="Basketball" />
            <div className="caption">Basketball</div>
          </div>
        </div>

        <div className="gallery-column">
          <div className="gallery-item">
            <img src={withBasePath('/images/diving5.png')} alt="Diving" />
            <div className="caption">Diving</div>
          </div>
          <div className="gallery-item">
            <img src={withBasePath('/images/diving3.png')} alt="Diving" />
            <div className="caption">Diving</div>
          </div>
        </div>

        <div className="gallery-column">
          <div className="gallery-item">
            <img src={withBasePath('/images/dingdang.png')} alt="My dog" />
            <div className="caption">My dog</div>
          </div>
          <div className="gallery-item">
            <img src={withBasePath('/images/dingdang2.png')} alt="My dog" />
            <div className="caption">My dog</div>
          </div>
        </div>
      </div>

      <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
      <script src="https://cdn.amcharts.com/lib/5/map.js"></script>
      <script src="https://cdn.amcharts.com/lib/5/geodata/worldLow.js"></script>
      <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>

      <div id="chartdiv" ref={containerRef} />
    </>
  );
}
