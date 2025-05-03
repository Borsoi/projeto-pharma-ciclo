const mapa = L.map('map').setView([-23.55052, -46.633308], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(mapa);

// Carrega os dados do JSON externo
fetch('locais.json')
  .then(response => response.json())
  .then(locais => {
    locais.forEach(ponto => {
      L.marker([ponto.lat, ponto.lng])
        .addTo(mapa)
        .bindPopup(`<b>${ponto.nome}</b><br>${ponto.endereco}`);
    });
  })
  .catch(error => {
    console.error('Erro ao carregar os dados:', error);
  });

  async function buscarCep() {
    const cep = document.getElementById('cepInput').value.trim().replace('-', '');
  
    if (!cep) {
      alert("Digite um CEP válido!");
      return;
    }
  
    try {
      const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const viaCepData = await viaCepResponse.json();
  
      if (viaCepData.erro) {
        alert("CEP não encontrado!");
        return;
      }
  
      const endereco = `${viaCepData.logradouro}, ${viaCepData.localidade}, ${viaCepData.uf}`;
  
      const nominatimResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json`);
      const nominatimData = await nominatimResponse.json();
  
      if (nominatimData && nominatimData.length > 0) {
        const { lat, lon } = nominatimData[0];
  
        // Apenas centraliza o mapa na coordenada sem adicionar marcador
        mapa.setView([lat, lon], 15);
      } else {
        alert("Localização não encontrada no mapa.");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar CEP.");
    }
  }
  
  

async function findLocationByCEP(cep) {
  const url = `https://nominatim.openstreetmap.org/search?q=${cep}&countrycodes=br&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      return { latitude: lat, longitude: lon, address: display_name };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
