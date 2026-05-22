// Inicializar o mapa (Cabo Verde)
var map = L.map('map').setView([14.91, -23.50], 7);  // Cabo Verde

// Adicionar o tileLayer do CARTO DB (substituindo OpenStreetMap)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 1
}).addTo(map);

// Exemplo de marcador (opcional - remova se não quiser)
 L.marker([14.91, -23.50]).addTo(map)
     .bindPopup('Embarcação Exemplo<br>Lat: 14.91°<br>Lon: -23.50°')
     .openPopup();

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
                L.marker([data.lat, data.lon]).addTo(map)
                    .bindPopup(`🚢 Embarcação ${codigo}<br>📍 Lat: ${data.lat}<br>📍 Lon: ${data.lon}`)
                    .openPopup();
            })
            .catch(erro => {
                console.error('Erro:', erro);
                alert('Embarcação não encontrada!');
            });
    } else {
        alert('Digite um código de rastreamento');
    }
});

// Atualização periódica (se necessário)
// setInterval(atualizarBarcos, 5000);
