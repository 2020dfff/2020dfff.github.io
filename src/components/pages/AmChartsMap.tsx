'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { withBasePath } from '@/lib/basePath';
import { FootprintImage, FootprintPoint } from '@/types/footprint';

interface AmChartsMapProps {
  points?: FootprintPoint[];
}

const fallbackPoints: FootprintPoint[] = [
  {
    city: 'Singapore',
    country: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    image: '/images/gallery/singapore-1.JPG',
    caption: 'Gallery preview.',
    category: 'City',
  },
];

function getPointImages(point: FootprintPoint): FootprintImage[] {
  const images = point.images?.length ? point.images : point.image ? [point.image] : [];
  return images
    .filter(Boolean)
    .map((image) => typeof image === 'string' ? { src: image } : image)
    .filter((image) => Boolean(image.src));
}

function getImageShape(width: number, height: number): 'portrait' | 'landscape' {
  return height / width > 1.75 ? 'portrait' : 'landscape';
}

function canPreviewPoint(point: FootprintPoint) {
  return point.preview !== false && getPointImages(point).length > 0;
}

export default function AmChartsMap({ points = fallbackPoints }: AmChartsMapProps) {
  const chartDivRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<any>(null); // 保存 root 实例的引用
  const mapPoints = useMemo(() => Array.isArray(points) && points.length > 0 ? points : fallbackPoints, [points]);
  const initialPreviewPoint = useMemo(
    () => mapPoints.find(canPreviewPoint) || fallbackPoints[0],
    [mapPoints],
  );
  const [activePoint, setActivePoint] = useState<FootprintPoint>(initialPreviewPoint);
  const [imageShapes, setImageShapes] = useState<Record<string, 'portrait' | 'landscape'>>({});
  const displayPoint = canPreviewPoint(activePoint) ? activePoint : initialPreviewPoint;
  const pointImages = getPointImages(displayPoint);
  const displayImage = withBasePath(pointImages[0]?.src || fallbackPoints[0].image || '');
  const imageShape = imageShapes[displayImage] || 'landscape';
  const hasMultipleImages = pointImages.length > 1;

  useEffect(() => {
    setActivePoint(initialPreviewPoint);
  }, [initialPreviewPoint]);

  useEffect(() => {
    if (!displayImage) return;
    if (imageShapes[displayImage]) return;

    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      setImageShapes((current) => ({
        ...current,
        [displayImage]: getImageShape(image.naturalWidth, image.naturalHeight),
      }));
    };
    image.src = displayImage;

    return () => {
      cancelled = true;
    };
  }, [displayImage, imageShapes]);

  useEffect(() => {
    console.log('AmChartsMap: Component mounted');
    
    // 检查脚本是否已加载
    const scriptsLoaded = typeof (window as any).am5 !== 'undefined';
    
    // 动态加载 amCharts 库
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // 检查脚本是否已经存在
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          console.log('AmChartsMap: Script already loaded:', src);
          resolve();
          return;
        }
        
        console.log('AmChartsMap: Loading script:', src);
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          console.log('AmChartsMap: Script loaded:', src);
          resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        console.log('AmChartsMap: Starting initialization');
        
        // 只有在脚本还没加载时才加载
        if (typeof (window as any).am5 === 'undefined') {
          await loadScript('https://cdn.amcharts.com/lib/5/index.js');
          await loadScript('https://cdn.amcharts.com/lib/5/map.js');
          await loadScript('https://cdn.amcharts.com/lib/5/geodata/worldLow.js');
          await loadScript('https://cdn.amcharts.com/lib/5/themes/Animated.js');
        } else {
          console.log('AmChartsMap: Scripts already loaded, skipping');
        }

        // 等待所有全局对象都可用（最多等待 5 秒）
        let attempts = 0;
        const maxAttempts = 50; // 50 * 100ms = 5 seconds
        
        while (attempts < maxAttempts) {
          const allLoaded = 
            typeof (window as any).am5 !== 'undefined' &&
            typeof (window as any).am5map !== 'undefined' &&
            typeof (window as any).am5geodata_worldLow !== 'undefined' &&
            typeof (window as any).am5themes_Animated !== 'undefined';
          
          if (allLoaded) {
            console.log('AmChartsMap: All global objects available');
            break;
          }
          
          console.log(`AmChartsMap: Waiting for globals... attempt ${attempts + 1}`);
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        // 确保 amCharts 全局对象存在
        if (typeof (window as any).am5 === 'undefined') {
          console.error('AmChartsMap 5 not loaded after waiting');
          return;
        }
        
        console.log('AmChartsMap: All scripts loaded, creating map');

        if (!chartDivRef.current) return;

        // 清空之前的内容
        chartDivRef.current.innerHTML = '';

        // 在 am5.ready 回调中访问所有 amCharts 对象
        const am5 = (window as any).am5;
        
        am5.ready(function () {
          if (!chartDivRef.current) return;
          
          // 在 ready 回调内部获取所有 amCharts 对象
          const am5map = (window as any).am5map;
          const am5geodata_worldLow = (window as any).am5geodata_worldLow;
          const am5themes_Animated = (window as any).am5themes_Animated;
          
          console.log('AmChartsMap: Inside am5.ready, checking objects:', {
            am5: typeof am5,
            am5map: typeof am5map,
            am5geodata_worldLow: typeof am5geodata_worldLow,
            am5themes_Animated: typeof am5themes_Animated
          });
          
          // 确保所有对象都已加载
          if (!am5map || !am5geodata_worldLow || !am5themes_Animated) {
            console.error('AmChartsMap: Some amCharts objects are not loaded:', {
              am5map: !!am5map,
              am5geodata_worldLow: !!am5geodata_worldLow,
              am5themes_Animated: !!am5themes_Animated
            });
            return;
          }
          
          // 如果已经存在 root 实例，先 dispose
          if (rootRef.current) {
            rootRef.current.dispose();
          }
          
          // 创建新的 root 实例
          const root = am5.Root.new(chartDivRef.current);
          rootRef.current = root; // 保存引用以便清理
          
          root.setThemes([am5themes_Animated.new(root)]);

          var chart = root.container.children.push(
            am5map.MapChart.new(root, {
              panX: 'rotateX',
              panY: 'translateY',
              projection: am5map.geoMercator(),
              paddingBottom: 20,
              paddingTop: 20,
              paddingLeft: 20,
              paddingRight: 20
            })
          );

          var worldSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
              geoJSON: am5geodata_worldLow,
              exclude: ['AQ']
            })
          );

          worldSeries.mapPolygons.template.setAll({
            tooltipText: '{name}',
            interactive: true,
            fill: am5.color(0xe4e4e4),
            stroke: am5.color(0xffffff)
          });

          worldSeries.mapPolygons.template.states.create('hover', {
            fill: am5.color(0xdddddd)
          });

          // 所有访问过的国家数据（统一为浅蓝色）
          const visitedData: { [key: string]: string } = {
            CN: '2001 – 2023',
            SG: '2023 – now',
            US: 'Jan 2024, Feb 2025',
            MX: 'Dec 2023',
            JP: 'Apr 2024, Nov 2024, May 2026',
            DE: 'Jul 2019',
            MY: '2023, 2024, 2025',
            TH: '2025',
            ID: 'May 2025',
            GB: '',
            IT: 'Jul 2025',
            AU: '',
            AE: ''
          };

          // 创建统一的访问国家系列（浅蓝色）
          var visitedSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
              geoJSON: am5geodata_worldLow,
              include: Object.keys(visitedData)
            })
          );
          visitedSeries.mapPolygons.template.setAll({
            interactive: true,
            fill: am5.color(0x5588dd), // 浅蓝色
            stroke: am5.color(0xffffff)
          });
          visitedSeries.mapPolygons.template.adapters.add('tooltipText', function (_: any, target: any) {
            var id = target.dataItem.dataContext.id;
            return '{name}\n' + visitedData[id];
          });

          const cityMarkers = mapPoints.map((point) => ({
            ...point,
            title: point.city,
          }));

          var citySeries = chart.series.push(
            am5map.MapPointSeries.new(root, {
              latitudeField: 'latitude',
              longitudeField: 'longitude'
            })
          );

          citySeries.bullets.push(function (root: any, _series: any, dataItem: any) {
            const point = (dataItem.dataContext || dataItem.get('dataContext')) as FootprintPoint & { title: string };
            const circle = am5.Circle.new(root, {
              radius: 5,
              tooltipText: '{title}',
              fill: am5.color(0xcc0000),
              stroke: am5.color(0xffffff),
              strokeWidth: 1,
              interactive: true,
              cursorOverStyle: 'pointer',
            });

            const activatePoint = () => {
              if (canPreviewPoint(point)) {
                setActivePoint(point);
              }
            };

            circle.events.on('pointerover', activatePoint);
            circle.events.on('pointerenter', activatePoint);
            circle.events.on('click', activatePoint);

            return am5.Bullet.new(root, {
              sprite: circle
            });
          });

          citySeries.data.setAll(cityMarkers);

          chart.set('zoomControl', am5map.ZoomControl.new(root, {}));
          chart.chartContainer.get('background').events.on('click', function () {
            chart.goHome();
          });

          chart.appear(1000, 100);
        });
      } catch (error) {
        console.error('Failed to initialize amCharts map:', error);
      }
    };

    initializeMap();

    // Cleanup - 正确清理 Root 实例
    return () => {
      console.log('AmChartsMap: Cleaning up');
      if (rootRef.current) {
        rootRef.current.dispose();
        rootRef.current = null;
      }
    };
  }, [mapPoints]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] my-5">
      <div
        ref={chartDivRef}
        className="min-h-[420px] lg:min-h-[600px] rounded-lg overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
      />
      <aside className="relative min-h-[360px] lg:min-h-[600px] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-sm overflow-hidden">
        {hasMultipleImages ? (
          <div className="absolute inset-0 grid grid-rows-2 gap-1 bg-neutral-950 p-1">
            {pointImages.slice(0, 2).map((image) => {
              const imageSrc = withBasePath(image.src);
              return (
                <div key={imageSrc} className="relative overflow-hidden rounded bg-neutral-900">
                  <img
                    src={imageSrc}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-55"
                    loading="lazy"
                  />
                  <img
                    src={imageSrc}
                    alt={displayPoint.caption || displayPoint.city}
                    className="relative w-full h-full object-contain p-1"
                    loading="lazy"
                  />
                  {(image.category || image.caption) && (
                    <div className="absolute left-2 top-2 rounded bg-black/45 px-2 py-1 text-xs font-medium text-white backdrop-blur">
                      {image.category || image.caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="absolute inset-0">
            {imageShape === 'landscape' && (
              <img
                src={displayImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60"
                loading="lazy"
              />
            )}
            <img
              key={displayImage}
              src={displayImage}
              alt={displayPoint.caption || displayPoint.city}
              className={`relative w-full h-full ${imageShape === 'landscape' ? 'object-contain p-2' : 'object-cover'}`}
              loading="lazy"
            />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-4 pt-14">
          <h3 className="text-lg font-semibold text-white leading-tight">{displayPoint.city}</h3>
          {(displayPoint.country || (!hasMultipleImages && displayPoint.category)) && (
            <p className="mt-1 text-sm text-white/75">
              {[displayPoint.country, hasMultipleImages ? null : displayPoint.category].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
