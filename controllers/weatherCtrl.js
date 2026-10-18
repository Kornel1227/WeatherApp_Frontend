const weatherApi = 'http://localhost:4000';

async function getWeatherAdmin() {
    const response = await fetch(`${weatherApi}/weather`);
    const forecasts = await response.json();

    if (!response.ok) {
        showMessage('danger', 'ERROR', forecasts.error || 'Could not load weather reports.');
        return;
    }

    drawWeatherTable(forecasts);
}

async function saveWeather() {
    const user = loadUser();
    if (!user || user.role !== 'admin') {
        showMessage('danger', 'ERROR', 'Only an admin can manage weather reports.');
        return;
    }

    const id = document.querySelector('#weatherId').value;
    const data = {
        date: document.querySelector('#date').value,
        location: document.querySelector('#location').value.trim(),
        temp_min: document.querySelector('#temp_min').value,
        temp_max: document.querySelector('#temp_max').value,
        weather_type: document.querySelector('#weather_type').value.trim(),
        precipitation_probability: document.querySelector('#precipitation_probability').value || 0,
        wind_speed: document.querySelector('#wind_speed').value || 0,
        uv_index: document.querySelector('#uv_index').value,
        luid: user.ID
    };

    if (!data.date || !data.location || data.temp_min === '' || data.temp_max === '' || !data.weather_type) {
        showMessage('danger', 'ERROR', 'Please fill in the date, location, temperatures and weather type.');
        return;
    }
    if (Number(data.temp_min) > Number(data.temp_max)) {
        showMessage('danger', 'ERROR', 'Minimum temperature cannot be greater than maximum temperature.');
        return;
    }

    const url = id ? `${weatherApi}/admin/weather/${id}` : `${weatherApi}/admin/weather`;
    const response = await fetch(url, {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();

    if (!response.ok) {
        showMessage('danger', 'ERROR', result.error || 'Could not save the weather report.');
        return;
    }

    showMessage('success', 'OK', result.message || 'Weather report saved.');
    clearWeatherForm();
    await getWeatherAdmin();
}

function drawWeatherTable(forecasts) {
    const table = document.querySelector('#weatherList');
    if (!table) return;
    table.innerHTML = '';

    forecasts.forEach(item => {
        const tr = document.createElement('tr');
        [item.ID, item.date, item.location, `${item.temp_min}°C`, `${item.temp_max}°C`, item.weather_type,
         `${item.precipitation_probability ?? 0}%`, `${item.wind_speed ?? 0} km/h`, item.uv_index ?? '-']
            .forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });

        const actions = document.createElement('td');
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'btn btn-sm btn-warning me-2';
        edit.textContent = 'Edit';
        edit.addEventListener('click', () => editWeather(item.ID));

        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'btn btn-sm btn-danger';
        del.textContent = 'Delete';
        del.addEventListener('click', () => deleteWeather(item.ID));
        actions.append(edit, del);
        tr.appendChild(actions);
        table.appendChild(tr);
    });
}

async function editWeather(id) {
    const response = await fetch(`${weatherApi}/weather/${id}`);
    const result = await response.json();
    if (!response.ok) {
        showMessage('danger', 'ERROR', result.error || 'Could not load this report.');
        return;
    }
    const item = result.results;
    document.querySelector('#weatherId').value = item.ID;
    document.querySelector('#date').value = item.date ? String(item.date).slice(0, 10) : '';
    document.querySelector('#location').value = item.location || '';
    document.querySelector('#temp_min').value = item.temp_min;
    document.querySelector('#temp_max').value = item.temp_max;
    document.querySelector('#weather_type').value = item.weather_type || '';
    document.querySelector('#precipitation_probability').value = item.precipitation_probability ?? 0;
    document.querySelector('#wind_speed').value = item.wind_speed ?? 0;
    document.querySelector('#uv_index').value = item.uv_index ?? '';
    document.querySelector('#saveWeatherBtn').textContent = 'Update report';
    document.querySelector('#date').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function deleteWeather(id) {
    const user = loadUser();
    if (!user || user.role !== 'admin') {
        showMessage('danger', 'ERROR', 'Only an admin can delete weather reports.');
        return;
    }
    if (!confirm('Are you sure you want to delete this weather report?')) return;

    const response = await fetch(`${weatherApi}/admin/weather/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ luid: user.ID })
    });
    const result = await response.json();
    if (!response.ok) {
        showMessage('danger', 'ERROR', result.error || 'Could not delete the report.');
        return;
    }
    showMessage('success', 'OK', result.message || 'Weather report deleted.');
    await getWeatherAdmin();
}

function clearWeatherForm() {
    document.querySelector('#weatherForm').reset();
    document.querySelector('#weatherId').value = '';
    document.querySelector('#saveWeatherBtn').textContent = 'Add report';
}

async function getUserWeather() {
    try {
        const response = await fetch(`${weatherApi}/weather`);
        const forecasts = await response.json();

        if (!response.ok) {
            showMessage('danger', 'ERROR',
                forecasts.error || 'Could not load weather reports.');
            return;
        }

        const table = document.querySelector('#weatherList');

        if (!table) return;

        table.innerHTML = '';

        forecasts.forEach((item, index) => {
            const tr = document.createElement('tr');

            [
                index + 1,
                item.date ? String(item.date).slice(0, 10) : '',
                item.location,
                item.weather_type,
                `${item.temp_min}°C`,
                `${item.temp_max}°C`,
                `${item.precipitation_probability ?? 0}%`,
                `${item.wind_speed ?? 0} km/h`,
                item.uv_index ?? '-',
                ''
            ].forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });

            table.appendChild(tr);
        });

        if (forecasts.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');

            td.colSpan = 10;
            td.textContent = 'No weather reports available.';
            td.className = 'text-center';

            tr.appendChild(td);
            table.appendChild(tr);
        }

        if (document.querySelector('#myChart')) {
            initChart(forecasts);
        }
        if(document.querySelector('#calendar')){
            initCalendar(forecasts);
        }

    } catch (error) {
        console.error('Weather loading error:', error);
        showMessage('danger', 'ERROR',
            'Could not connect to the weather server.');
    }
}

function initChart(results) {

    let labels = [];
    let minDatas = [];
    let maxDatas = [];

    results.sort((a, b) => new Date(a.date) - new Date(b.date));

    results.forEach((weather) => {
        labels.push(moment(weather.date).format('YYYY-MM-DD'));
        minDatas.push(weather.temp_min);
        maxDatas.push(weather.temp_max);
    });

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Minimum temperature (°C)',
                    data: minDatas,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 8
                },
                {
                    label: 'Maximum temperature (°C)',
                    data: maxDatas,
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

function initCalendar(results){
    var calendarEl = document.getElementById('calendar');
    
    colorScheme = localStorage.getItem('WeatherTheme') || 'light';

    let myEvents = results.map((results) => {
        return {
            title: results.weather_type ,
            start: results.date
        }
    });

    var calendar = new FullCalendar.Calendar(calendarEl, {
      colorScheme: colorScheme,
      initialDate: new Date(),
      initialView: 'dayGridMonth',
      nowIndicator: true,
      headerToolbar: {
        left: 'prevYear,prev,next,nextYear today',
        center: 'title',
        right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek'

      },
      navLinks: true, 
      editable: false,
      selectable: false,
      selectMirror: true,
      dayMaxEvents: true, 
      events: myEvents
    });
    calendar.render();
}