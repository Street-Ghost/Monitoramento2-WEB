// Inicializar o mapa (Cabo Verde)
var map = L.map('map').setView([14.91, -23.50], 7);  // Cabo Verde

// Adicionar o tileLayer do CARTO DB (substituindo OpenStreetMap)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 1
}).addTo(map);

 L.marker([14.91, -23.50]).addTo(map)
     .bindPopup('Embarcação Exemplo<br>Lat: 14.91°<br>Lon: -23.50°')
     .openPopup();

 // Marcador de rastreamento
let marcadorBarco = null;

// Trajeto percorrido
let trajeto = [];
let linhaTrajeto = L.polyline(
    trajeto,
    {
    weight: 4
}).addTo(map);

// Função de busca (quando clicar no botão)
document.getElementById('searchBtn').addEventListener('click', function() {
    const codigo = document.getElementById('trackingCode').value;
    if (codigo) {
        console.log('Buscando embarcação:', codigo);
        // Requisição à sua API
        fetch(`http://127.0.0.1:3000/api/barco/${codigo}`)
            .then(res => res.json())
            .then(data => {
                map.setView([data.lat, data.lon], 15);
                
                if (!marcadorBarco) {

                    marcadorBarco = L.marker(
                    [data.lat, data.lon]
                    ).addTo(map);

                } else {

                marcadorBarco.setLatLng([
                    data.lat,
                    data.lon
                    ]);
                }

                marcadorBarco.bindPopup(
                    `🚢 Embarcação ${codigo}<br>
                    📍 Lat: ${data.lat}<br>
                    📍 Lon: ${data.lon}`
                );

                trajeto.push([
                    data.lat,
                    data.lon
                ]);

                linhaTrajeto.setLatLngs(trajeto);

                map.setView([
                    data.lat,
                    data.lon
                ], 15);             

            })
            .catch(erro => {
                console.error('Erro:', erro);
                alert('Embarcação não encontrada!');
            });
    } else {
        alert('Digite um código de rastreamento');
    }
});
function atualizarBarco(codigo) {

    fetch(`http://127.0.0.1:3000/api/barco/${codigo}`)
        .then(res => res.json())
        .then(data => {

            if (!marcadorBarco) {

                marcadorBarco = L.marker([
                    data.lat,
                    data.lon
                ]).addTo(map);

            } else {

                marcadorBarco.setLatLng([
                    data.lat,
                    data.lon
                ]);
            }

            trajeto.push([
                data.lat,
                data.lon
            ]);

            linhaTrajeto.setLatLngs(
                trajeto
            );

            map.panTo([
                data.lat,
                data.lon
            ]);
        });
}
setInterval(() => {

    if (codigoAtual) {

        atualizarBarco(
            codigoAtual
        );
    }

}, 15000);

// Atualização periódica (se necessário)
// setInterval(atualizarBarcos, 5000);
