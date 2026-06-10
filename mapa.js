// =============================
// MAPA INICIAL
// =============================

var map = L.map('map').setView([14.91, -23.50], 8);

L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
        attribution:
            '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }
).addTo(map);

// =============================
// VARIÁVEIS DE RASTREAMENTO
// =============================

let marcadorBarco = null;

let trajeto = [];

let linhaTrajeto = L.polyline(
    trajeto,
    {
        color: '#0066ff',
        weight: 4
    }
).addTo(map);

// =============================
// ÍCONE DA EMBARCAÇÃO
// =============================

const barcoIcon = L.icon({
    iconUrl:
        'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',

    iconSize: [40, 40],

    iconAnchor: [20, 20],

    popupAnchor: [0, -20]
});

// =============================
// ATUALIZAR GPS
// =============================

async function atualizarGPS() {

    try {

        const resposta =
        await fetch(
            'http://localhost:3000/gps'
        );

        const gps =
        await resposta.json();

        if (
            gps.lat === 0 ||
            gps.lon === 0
        ) {
            return;
        }

        // PRIMEIRA POSIÇÃO

        if (!marcadorBarco) {

            marcadorBarco =
            L.marker(
                [
                    gps.lat,
                    gps.lon
                ],
                {
                    icon: barcoIcon
                }
            ).addTo(map);

            map.setView(
                [
                    gps.lat,
                    gps.lon
                ],
                15
            );
        }

        // MOVIMENTAR MARCADOR

        marcadorBarco.setLatLng(
            [
                gps.lat,
                gps.lon
            ]
        );

        // POPUP

        marcadorBarco.bindPopup(
            `
            <b>🚢 Embarcação Rastreada</b>
            <br>
            Latitude: ${gps.lat}
            <br>
            Longitude: ${gps.lon}
            <br>
            Última atualização:
            ${new Date().toLocaleTimeString()}
            `
        );

        // TRAJETO

        trajeto.push(
            [
                gps.lat,
                gps.lon
            ]
        );

        linhaTrajeto.setLatLngs(
            trajeto
        );

    } catch (erro) {

        console.error(
            "Erro ao obter GPS:",
            erro
        );
    }
}

// =============================
// BOTÃO RASTREAR
// =============================

document
.getElementById('searchBtn')
.addEventListener(
    'click',
    function () {

        const codigo =
        document
        .getElementById(
            'trackingCode'
        )
        .value;

        if (!codigo) {

            alert(
                'Digite um código.'
            );

            return;
        }

        alert(
            'Rastreamento iniciado para: ' +
            codigo
        );

        atualizarGPS();
    }
);

// =============================
// ATUALIZAÇÃO AUTOMÁTICA
// =============================

setInterval(
    atualizarGPS,
    1000
);
