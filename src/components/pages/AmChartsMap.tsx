'use client';

import { useEffect, useRef } from 'react';

export default function AmChartsMap() {
  const chartDivRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<any>(null); // 保存 root 实例的引用

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
            JP: 'Apr 2024, Nov 2024',
            DE: 'Jul 2019',
            MY: '2023, 2024, 2025',
            TH: '2025',
            ID: 'May 2025',
            GB: '',
            IT: 'Jul 2025',
            AU: ''
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

          const cityMarkers = [
            { title: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 },
            { title: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
            { title: 'San Diego', latitude: 32.7157, longitude: -117.1611 },
            { title: 'Tijuana', latitude: 32.5149, longitude: -117.0382 },
            { title: 'Mexico City', latitude: 19.4326, longitude: -99.1332 },
            { title: 'Guanajuato', latitude: 21.0181, longitude: -101.2583 },
            { title: 'San Miguel', latitude: 20.9144, longitude: -100.7431 },
            { title: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
            { title: 'Semporna', latitude: 4.4818, longitude: 118.611 },
            { title: 'Shanghai', latitude: 31.2304, longitude: 121.4737 },
            { title: 'Beijing', latitude: 39.9042, longitude: 116.4074 },
            { title: 'Lhasa', latitude: 29.652, longitude: 91.1721 },
            { title: 'Xining', latitude: 36.6171, longitude: 101.7782 },
            { title: 'Chengdu', latitude: 30.5728, longitude: 104.0668 },
            { title: 'Wuhan', latitude: 30.5928, longitude: 114.3055 },
            { title: 'Chongqing', latitude: 29.563, longitude: 106.5516 },
            { title: 'Changsha', latitude: 28.2282, longitude: 112.9388 },
            { title: 'Hong Kong', latitude: 22.3193, longitude: 114.1694 },
            { title: 'Taipei', latitude: 25.0330, longitude: 121.5654 },
            { title: "Huai'an", latitude: 33.5785, longitude: 119.0302 },
            { title: 'Frankfurt', latitude: 50.1109, longitude: 8.6821 },
            { title: 'Hanover', latitude: 52.3759, longitude: 9.732 },
            { title: 'Berlin', latitude: 52.52, longitude: 13.405 },
            { title: 'Hamburg', latitude: 53.5511, longitude: 9.9937 },
            { title: 'Milan', latitude: 45.4642, longitude: 9.1900 },
            { title: 'Venice', latitude: 45.4408, longitude: 12.3155 },
            { title: 'Padua', latitude: 45.4064, longitude: 11.8768 },
            { title: 'Bolzano', latitude: 46.4983, longitude: 11.3548 },
            { title: 'Kuala Lumpur', latitude: 3.139, longitude: 101.6869 },
            { title: 'Johor Bahru', latitude: 1.4927, longitude: 103.7414 },
            { title: 'Penang', latitude: 5.4164, longitude: 100.3327 },
            { title: 'Surabaya', latitude: -7.2575, longitude: 112.7521 },
            { title: 'Phuket', latitude: 7.8804, longitude: 98.3923 },
            { title: 'Tokyo', latitude: 35.6764, longitude: 139.65 },
            { title: 'Osaka', latitude: 34.6937, longitude: 135.5023 },
            { title: 'Kyoto', latitude: 35.0116, longitude: 135.7681 },
            { title: 'Kobe', latitude: 34.6901, longitude: 135.1955 },
            { title: 'Yokohama', latitude: 35.4437, longitude: 139.638 }
          ];

          var citySeries = chart.series.push(
            am5map.MapPointSeries.new(root, {
              latitudeField: 'latitude',
              longitudeField: 'longitude'
            })
          );

          citySeries.bullets.push(function (root: any, dataItem: any) {
            return am5.Bullet.new(root, {
              sprite: am5.Circle.new(root, {
                radius: 5,
                tooltipText: '{title}',
                fill: am5.color(0xcc0000),
                stroke: am5.color(0xffffff),
                strokeWidth: 1
              })
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
  }, []);

  return (
    <div
      ref={chartDivRef}
      style={{
        width: '100%',
        height: '600px',
        margin: '20px 0',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}
    />
  );
}
