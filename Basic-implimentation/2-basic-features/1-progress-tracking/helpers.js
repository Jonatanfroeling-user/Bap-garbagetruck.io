const ronseCenter = [50.76, 3.57]
// https://www.openstreetmap.org/export#map=14/50.7469/3.6186&layers=H
const ronseArea = [[50.7552,3.6657],[50.7303,3.6038]] //[[50.7599, 3.6274], [50.7335, 3.5808]]
const stepDestail = 0.0001//0.00001


const {log,info,warn}=console
/** Map */
const MAP = L.map(
    "MAP", {
        center: ronseCenter,
        crs: L.CRS.EPSG3857,
        zoom: 13,
        zoomControl: true,
        preferCanvas: false,
    }
);
const tileMap = L.tileLayer(
    //"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",

    {"attribution": "Data by \u0026copy; \u003ca target=\"_blank\" href=\"http://openstreetmap.org\"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca target=\"_blank\" href=\"http://www.openstreetmap.org/copyright\"\u003eODbL\u003c/a\u003e.", "detectRetina": false, "maxNativeZoom": 18, "maxZoom": 18, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false}
).addTo(MAP);

function createMarker(name, coords, color='#00ff00', width = 3){
    const marker = L.polyline(
        coords, {
            "bubblingMouseEvents": true,
            "color": [color],
            "dashArray": null,
            "dashOffset": null,
            "fill": false,
            "fillColor": [color],
            "fillOpacity": 0.2,
            "fillRule": "evenodd",
            "lineCap": "round",
            "lineJoin": "round",
            "noClip": false,
            "opacity": 1,
            "smoothFactor": 1.0,
            "stroke": true,
            "weight": width
        }
    ).addTo(MAP);

    marker.on('mouseover', function(e){
        e.target.bindPopup(name).openPopup();
    });

    marker.on('mouseout', function(e){  
        e.target.closePopup();
    });
    return marker
}
    

/** Helpers */
function sleep(s = 0.1) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

function toFixed(nr, amt = 6) {
    return +nr.toFixed(amt)
}

function randint(a=0,b=1) {
    return a + Math.random() * b
}
// [[x,y],[x,y]]
function getDis(a, b) {
    return Math.hypot(b[0] - a[0], b[1] - a[1])
}
// js adatoption of python range
function range(n = 1) {
    return [...new Array(n)]
}

function getPosTo(src, targ, dis) {
    const dx = targ[0] - src[0];
    const dy = targ[1] - src[1];
    let angle = Math.atan2(dy, dx)

    return [src[0] + dis * Math.cos(angle), src[1] + dis * Math.sin(angle)]
}

// truck icon
function getIcon(coords){
    const LeafIcon = L.Icon.extend({
        options: {
           iconSize: [40, 30],
        }
    });
    const icon = new LeafIcon({
        iconUrl: 'https://static.vecteezy.com/system/resources/previews/009/384/704/original/garbage-truck-clipart-design-illustration-free-png.png',
    })
    return new L.marker(coords,  {icon: icon}).addTo(MAP)
}

/** Data */
const loadJsonData = (file='ronse-StreetParts-276.json', isFulpath=false)=> new Promise((resolve, reject) => {
    fetch(isFulpath?file:'../../data/'+file)
        .then(respond => {
            resolve(respond.json())
        }).catch(err => {
            reject(err)
    })
})


/** get itermediate points */
function getIntermediate(a,b){
    let steps = stepDestail
    const res=[]
    let dis=Infinity
    let c=null
    let tracker=0

    while(dis>steps){
        if(tracker>1000) throw new Error('infinite loop at: getIntermediate')
        c=getPosTo(a,b,tracker)
        dis=getDis(c,b)
        tracker+=steps
        res.push(c.map(i=>toFixed(i,6)))
    }
    return res
}