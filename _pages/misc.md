---
layout: default
permalink: /misc/
title: "Miscellaneous"
excerpt: ""
author_profile: true
---
# 📝 Hobbies

- Basketball: I participate in several basketball teams in my high school, SJTU and NUS.
- Scuba Diving: ~~I will pursue AOW once I have time! (OW is not enough!)~~ I finally got my AOW together with Enriched Air Diver at Apr 2025!

<style>
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

.map-legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px 0;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 15px 10px 15px;
}

.legend-color {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 3px;
}

.lived {
  background-color: #2255AA;
}

.visited {
  background-color: #5588DD;
}

.planned {
  background-color: #99CCFF;
}

.section-separator {
  margin: 50px 0;
  border: 0;
  border-top: 2px solid #f0f0f0;
}
</style>

<div class="photo-gallery">
  <!-- Basketball Column -->
  <div class="gallery-column">
    <div class="gallery-item">
      <img src="/images/basketball1.png" alt="Basketball">
      <div class="caption">Basketball</div>
    </div>
    <div class="gallery-item">
      <img src="/images/basketball2.png" alt="Basketball">
      <div class="caption">Basketball</div>
    </div>
  </div>

<!-- Diving Column -->

<div class="gallery-column">
    <div class="gallery-item">
      <img src="/images/diving5.png" alt="Diving">
      <div class="caption">Diving</div>
    </div>
    <div class="gallery-item">
      <img src="/images/diving3.png" alt="Diving">
      <div class="caption">Diving</div>
    </div>
  </div>

<!-- Dog Column -->

<div class="gallery-column">
    <div class="gallery-item">
      <img src="/images/dingdang.png" alt="My dog">
      <div class="caption">My dog</div>
    </div>
    <div class="gallery-item">
      <img src="/images/dingdang2.png" alt="My dog">
      <div class="caption">My dog</div>
    </div>
  </div>
</div>

# 🌏 Footprints

<!-- Resources -->

<script src="https://cdn.amcharts.com/lib/5/index.js"></script>

<script src="https://cdn.amcharts.com/lib/5/map.js"></script>

<script src="https://cdn.amcharts.com/lib/5/geodata/worldLow.js"></script>

<script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>

<div id="chartdiv" style="width: 100%; height: 600px;"></div>

<script>
am5.ready(function () {
  try {
    var root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "translateY",
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
        exclude: ["AQ"]
      })
    );
  
    worldSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
      fill: am5.color(0xE4E4E4),
      stroke: am5.color(0xFFFFFF)
    });
  
    worldSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0xDDDDDD)
    });
  
    const livedData = { CN: "2001 – 2023", SG: "2023 – now" };
    const visitedData = {
      US: "Jan 2024, Feb 2025",
      MX: "Dec 2023",
      JP: "Apr 2024, Nov 2024",
      DE: "Jul 2019",
      MY: "2023, 2024, 2025",
      TH: "2025",
      ID: "2025"
    };
    const plannedData = {
      GB: "Planning",
      IT: "Planning",
      AU: "Planning"
    };
  
    var livedSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        include: Object.keys(livedData)
      })
    );
    livedSeries.mapPolygons.template.setAll({
      interactive: true,
      fill: am5.color(0x2255AA),
      stroke: am5.color(0xFFFFFF)
    });
    livedSeries.mapPolygons.template.adapters.add("tooltipText", function (_, target) {
      var id = target.dataItem.dataContext.id;
      return "{name}: Lived\n居住时间：" + livedData[id];
    });
  
    var visitedSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        include: Object.keys(visitedData)
      })
    );
    visitedSeries.mapPolygons.template.setAll({
      interactive: true,
      fill: am5.color(0x5588DD),
      stroke: am5.color(0xFFFFFF)
    });
    visitedSeries.mapPolygons.template.adapters.add("tooltipText", function (_, target) {
      var id = target.dataItem.dataContext.id;
      return "{name}: Visited\n访问时间：" + visitedData[id];
    });
  
    var plannedSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        include: Object.keys(plannedData)
      })
    );
    plannedSeries.mapPolygons.template.setAll({
      interactive: true,
      fill: am5.color(0x99CCFF),
      stroke: am5.color(0xFFFFFF)
    });
    plannedSeries.mapPolygons.template.adapters.add("tooltipText", function (_, target) {
      var id = target.dataItem.dataContext.id;
      return "{name}: " + plannedData[id];
    });
  
    const cityMarkers = [
  { title: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
  { title: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
  { title: "San Diego", latitude: 32.7157, longitude: -117.1611 },
  { title: "Tijuana", latitude: 32.5149, longitude: -117.0382 },
  { title: "Mexico City", latitude: 19.4326, longitude: -99.1332 },
  { title: "Guanajuato", latitude: 21.0181, longitude: -101.2583 },
  { title: "San Miguel", latitude: 20.9144, longitude: -100.7431 },
  { title: "Singapore", latitude: 1.3521, longitude: 103.8198 },
  { title: "Semporna", latitude: 4.4818, longitude: 118.6110 },
  { title: "Shanghai", latitude: 31.2304, longitude: 121.4737 },
  { title: "Beijing", latitude: 39.9042, longitude: 116.4074 },
  { title: "Lhasa", latitude: 29.6520, longitude: 91.1721 },
  { title: "Xining", latitude: 36.6171, longitude: 101.7782 },
  { title: "Chengdu", latitude: 30.5728, longitude: 104.0668 },
  { title: "Wuhan", latitude: 30.5928, longitude: 114.3055 },
  { title: "Chongqing", latitude: 29.5630, longitude: 106.5516 },
  { title: "Changsha", latitude: 28.2282, longitude: 112.9388 },
  { title: "Hong Kong", latitude: 22.3193, longitude: 114.1694 },
  { title: "Huai'an", latitude: 33.5785, longitude: 119.0302 },
  { title: "Frankfurt", latitude: 50.1109, longitude: 8.6821 },
  { title: "Hanover", latitude: 52.3759, longitude: 9.7320 },
  { title: "Berlin", latitude: 52.5200, longitude: 13.4050 },
  { title: "Hamburg", latitude: 53.5511, longitude: 9.9937 },
  { title: "Kuala Lumpur", latitude: 3.1390, longitude: 101.6869 },
  { title: "Johor Bahru", latitude: 1.4927, longitude: 103.7414 },
  { title: "Penang", latitude: 5.4164, longitude: 100.3327 },
  { title: "Surabaya", latitude: -7.2575, longitude: 112.7521 },
  { title: "Phuket", latitude: 7.8804, longitude: 98.3923 },
  { title: "Tokyo", latitude: 35.6764, longitude: 139.6500 },
  { title: "Osaka", latitude: 34.6937, longitude: 135.5023 },
  { title: "Kyoto", latitude: 35.0116, longitude: 135.7681 },
  { title: "Kobe", latitude: 34.6901, longitude: 135.1955 },
  { title: "Yokohama", latitude: 35.4437, longitude: 139.6380 }
];


var citySeries = chart.series.push(
  am5map.MapPointSeries.new(root, {
    latitudeField: "latitude",
    longitudeField: "longitude"
  })
);

citySeries.bullets.push(function (root, dataItem) {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(root, {
      radius: 5,
      tooltipText: "{title}",
      fill: am5.color(0xCC0000),
      stroke: am5.color(0xffffff),
      strokeWidth: 1
    })
  });
});

citySeries.data.setAll(cityMarkers);


    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    chart.chartContainer.get("background").events.on("click", function () {
      chart.goHome();
    });
  
    chart.appear(1000, 100);
  } catch (error) {
    console.error("地图渲染失败：", error);
  }
});
</script>

# 🦾 Leadership / Extracurricular

- **College Student Work Office, President**, **Fall 2019 -- Present**

  - Organize and plan the training course of ideal and faith education in the college, with a total of four sessions, more than **2000 trainees**, and undertake **six forums**.
  - Led chapter of **50+** members to work towards goals that improve and promote community service, academics, and unity.
- **Club Unions, Cadre**, **Fall 2019 -- Fall 2020**

  - Participate in undertaking **large-scale cultural and sports activities** on campus, such as \"Qiyuan Loy Krathong Festival, Club Recruitment, Student Festival\" and other related activities.
  - The cumulative readings of articles related to the event **exceeded one million**.
- **Vaccination Site Volunteer**, **Fall 2021**
- **Shanghai International Marathon Volunteer**, **Fall 2020, 2021**

# 🎨 Skills

- **Programming Languages**: Python, Java, C/C++, JavaScript, Go
- **Frameworks**: Pytorch, Numpy, Pandas, Seaborn, Networkx, etc
- **Tools**: Git, Docker, MySQL, MongoDB
- **Languages**: Mandarin (Native); English (**TOEFL: 109 / GRE: 322**); French (Beginner)
