// src/map.js
(function () {
    // Only run if #map exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const locations = {
        'HKG': {lat: 22.308, lon: 113.918, count: 16, country: 'Hong Kong', labelOffset: [0, -15]},
        'KUL': {lat: 2.746,  lon: 101.71,  count: 1,  country: 'Malaysia',    labelOffset: [0, -15]},
        'XMN': {lat: 24.544, lon: 118.128, count: 2,  country: 'China',       labelOffset: [0, -15]},
        'NKG': {lat: 31.732, lon: 118.863, count: 1,  country: 'China',       labelOffset: [0, -15]},
        'LHR': {lat: 51.471, lon: -0.453,  count: 5,  country: 'United Kingdom', labelOffset: [0, -15]},
        'KTM': {lat: 27.697, lon: 85.359,  count: 2,  country: 'Nepal',       labelOffset: [0, -15]},
        'AMS': {lat: 52.309, lon: 4.764,   count: 2,  country: 'Netherlands', labelOffset: [0, -15]},
        'BKK': {lat: 13.681, lon: 100.747, count: 2,  country: 'Thailand',    labelOffset: [0, -15]},
        'TPE': {lat: 25.078, lon: 121.233, count: 1,  country: 'Taiwan',      labelOffset: [0, -15]}
    };

    const bounds = [];

    for (const code in locations) {
        const loc = locations[code];
        bounds.push([loc.lat, loc.lon]);

        // Dots
        for (let i = 0; i < loc.count; i++) {
            const offsetLat = (Math.random() - 0.5) * 0.05;
            const offsetLon = (Math.random() - 0.5) * 0.05;
            L.circleMarker([loc.lat + offsetLat, loc.lon + offsetLon], {
                radius: 4, color: 'blue', fillColor: 'blue', fillOpacity: 0.7
            }).addTo(map)
              .bindPopup(`${code} (${loc.country})<br>${loc.count} visit${loc.count > 1 ? 's' : ''}`);
        }

        // Airport marker
        L.marker([loc.lat, loc.lon])
            .addTo(map)
            .bindPopup(`<b>${code}</b> – ${loc.country}`);

        // Country label
        L.marker([loc.lat + loc.labelOffset[0]/100, loc.lon + loc.labelOffset[1]/100], {
            icon: L.divIcon({
                className: 'country-label',
                html: loc.country,
                iconSize: [100, 20],
                iconAnchor: [0, 10]
            })
        }).addTo(map);
    }

    // Summary
    const totalFlights = Object.values(locations).reduce((sum, l) => sum + l.count, 0);
    const totalAirports = Object.keys(locations).length;
    const uniqueCountries = new Set(Object.values(locations).map(l => l.country)).size;
    const dates = [
        '1/8/2023', '3/8/2023', '4/8/2023', '6/8/2023', '8/8/2023',
        '15/8/2025', '21/8/2025', '8/8/2023', '19/8/2023', '23/8/2023',
        '10/10/2023', '29/6/2025', '20/7/2024', '31/7/2024', '1/8/2024', '30/9/2025'
    ];
    const sortedDates = dates.map(d => {
        const [day, month, year] = d.split('/');
        return new Date(`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`);
    });
    const firstDate = new Date(Math.min(...sortedDates));
    const lastDate = new Date(Math.max(...sortedDates));
    const formatDate = d => d.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});

    const summaryEl = document.getElementById('map-summary');
    if (summaryEl) {
        summaryEl.innerHTML = `
            <strong>Travel Summary</strong><br>
            Airplane <strong>${totalFlights}</strong> flights • 
            Globe with meridians <strong>${uniqueCountries}</strong> countries • 
            Airport <strong>${totalAirports}</strong> airports • 
            Calendar ${formatDate(firstDate)} – ${formatDate(lastDate)}
        `;
    }

    // Auto-zoom
    map.fitBounds(bounds, {padding: [50, 50]});
})();