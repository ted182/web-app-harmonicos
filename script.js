// Variáveis globais para os gráficos
let harmonicsChart, waveformsChart, spectrumChart;

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    setupEventListeners();
    setupLineWidthSelector();
    calculateTHD(); // Cálculo inicial
});

// Configuração dos event listeners
function setupEventListeners() {
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateTHD);
    
    // Event listeners para todos os inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', calculateTHD);
    });
}

function setupLineWidthSelector() {
    const select = document.getElementById('lineWidthSelect');
    if (!select) return;
    select.addEventListener('change', function() {
        const value = parseFloat(this.value);
        setWaveformLineWidth(value);
    });
}

function setWaveformLineWidth(width) {
    if (waveformsChart && waveformsChart.data && waveformsChart.data.datasets) {
        waveformsChart.data.datasets.forEach(ds => {
            ds.borderWidth = width;
        });
        waveformsChart.options.elements = waveformsChart.options.elements || {};
        waveformsChart.options.elements.line = waveformsChart.options.elements.line || {};
        waveformsChart.options.elements.line.borderWidth = width;
        waveformsChart.update();
    }
}

// Função principal de cálculo
function calculateTHD() {
    const data = getInputData();
    const results = performCalculations(data);
    updateResults(results);
    updateCharts(data, results);
}

// Obter dados dos inputs
function getInputData() {
    return {
        fundamental: parseFloat(document.getElementById('fundamental').value) || 0,
        frequency: parseFloat(document.getElementById('frequency').value) || 60,
        harmonics: {
            h2: parseFloat(document.getElementById('h2').value) || 0,
            h3: parseFloat(document.getElementById('h3').value) || 0,
            h4: parseFloat(document.getElementById('h4').value) || 0,
            h5: parseFloat(document.getElementById('h5').value) || 0,
            h6: parseFloat(document.getElementById('h6').value) || 0,
            h7: parseFloat(document.getElementById('h7').value) || 0,
            h8: parseFloat(document.getElementById('h8').value) || 0,
            h9: parseFloat(document.getElementById('h9').value) || 0,
            h10: parseFloat(document.getElementById('h10').value) || 0
        }
    };
}

// Realizar cálculos
function performCalculations(data) {
    const { fundamental, harmonics } = data;
    
    // Calcular soma dos quadrados das harmônicas
    let sumHarmonicsSquared = 0;
    Object.values(harmonics).forEach(h => {
        sumHarmonicsSquared += h * h;
    });
    
    // Calcular THD
    const thd = fundamental > 0 ? (Math.sqrt(sumHarmonicsSquared) / fundamental) * 100 : 0;
    
    // Calcular corrente RMS total
    const rmsTotal = Math.sqrt(fundamental * fundamental + sumHarmonicsSquared);
    
    // Gerar forma de onda para encontrar pico e fator de crista
    const waveform = generateCurrentWaveform(data, 1000); // 1000 pontos
    const peak = Math.max(...waveform.map(Math.abs));
    const crestFactor = rmsTotal > 0 ? peak / rmsTotal : 0;
    
    return {
        thd: thd,
        rms: rmsTotal,
        peak: peak,
        crestFactor: crestFactor,
        harmonics: harmonics
    };
}

// Atualizar resultados na interface
function updateResults(results) {
    document.getElementById('thdValue').textContent = results.thd.toFixed(2);
    document.getElementById('rmsValue').textContent = results.rms.toFixed(2);
    document.getElementById('peakValue').textContent = results.peak.toFixed(2);
    document.getElementById('crestFactor').textContent = results.crestFactor.toFixed(2);
    
    // Adicionar classes de destaque baseadas nos valores
    const thdElement = document.getElementById('thdValue');
    thdElement.className = 'result-value';
    if (results.thd > 5) {
        thdElement.classList.add('warning');
    } else if (results.thd > 0) {
        thdElement.classList.add('highlight');
    }
}

// Gerar forma de onda da corrente
function generateCurrentWaveform(data, numPoints) {
    const { fundamental, frequency, harmonics } = data;
    const waveform = [];
    const timeStep = (4 * Math.PI) / numPoints; // 4 ciclos (4π radianos)
    
    for (let i = 0; i < numPoints; i++) {
        const time = i * timeStep;
        let current = fundamental * Math.sin(time);
        
        // Adicionar harmônicas
        current += harmonics.h2 * Math.sin(2 * time);
        current += harmonics.h3 * Math.sin(3 * time);
        current += harmonics.h4 * Math.sin(4 * time);
        current += harmonics.h5 * Math.sin(5 * time);
        current += harmonics.h6 * Math.sin(6 * time);
        current += harmonics.h7 * Math.sin(7 * time);
        current += harmonics.h8 * Math.sin(8 * time);
        current += harmonics.h9 * Math.sin(9 * time);
        current += harmonics.h10 * Math.sin(10 * time);
        
        waveform.push(current);
    }
    
    return waveform;
}

// Gerar forma de onda da tensão (senoidal pura)
function generateVoltageWaveform(data, numPoints) {
    const { frequency } = data;
    const waveform = [];
    const timeStep = (4 * Math.PI) / numPoints; // 4 ciclos (4π radianos)
    const voltagePeak = 220 * Math.sqrt(2); // Tensão de pico típica
    
    for (let i = 0; i < numPoints; i++) {
        const time = i * timeStep;
        const voltage = voltagePeak * Math.sin(time);
        waveform.push(voltage);
    }
    
    return waveform;
}

// Inicializar gráficos
function initializeCharts() {
    // Gráfico de contribuição das harmônicas
    const harmonicsCtx = document.getElementById('harmonicsChart').getContext('2d');
    harmonicsChart = new Chart(harmonicsCtx, {
        type: 'bar',
        data: {
            labels: ['Fundamental', '2ª', '3ª', '4ª', '5ª', '6ª', '7ª', '8ª', '9ª', '10ª'],
            datasets: [{
                label: 'Amplitude (A)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(237, 100, 166, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(201, 203, 207, 0.8)'
                ],
                borderColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(118, 75, 162, 1)',
                    'rgba(237, 100, 166, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(201, 203, 207, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Contribuição das Harmônicas'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amplitude (A)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Ordem Harmônica'
                    }
                }
            }
        }
    });

    // Gráfico de formas de onda
    const waveformsCtx = document.getElementById('waveformsChart').getContext('2d');
    waveformsChart = new Chart(waveformsCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Tensão (V)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderWidth: 0.5,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false,
                tension: 0.1
            }, {
                label: 'Corrente (A)',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 0.5,
                pointRadius: 0,
                pointHoverRadius: 0,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Formas de Onda - 4 Ciclos'
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Tempo (ms)'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Amplitude'
                    }
                }]
            },
            elements: {
                point: {
                    radius: 0
                },
                line: {
                    borderWidth: 0.5
                }
            }
        }
    });

    // Gráfico de espectro de frequência
    const spectrumCtx = document.getElementById('spectrumChart').getContext('2d');
    spectrumChart = new Chart(spectrumCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Espectro de Frequência',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Espectro de Frequência'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Frequência (Hz)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amplitude (A)'
                    }
                }
            }
        }
    });
}

// Atualizar gráficos
function updateCharts(data, results) {
    // Atualizar gráfico de harmônicas
    const harmonicData = [
        data.fundamental,
        data.harmonics.h2,
        data.harmonics.h3,
        data.harmonics.h4,
        data.harmonics.h5,
        data.harmonics.h6,
        data.harmonics.h7,
        data.harmonics.h8,
        data.harmonics.h9,
        data.harmonics.h10
    ];
    
    harmonicsChart.data.datasets[0].data = harmonicData;
    harmonicsChart.update();

    // Atualizar gráfico de formas de onda - 4 ciclos
    const numPoints = 1000; // Pontos para 4 ciclos (aumentado de 500)
    const currentWaveform = generateCurrentWaveform(data, numPoints);
    const voltageWaveform = generateVoltageWaveform(data, numPoints);
    
    // Gerar labels de tempo (4 ciclos = 66.67ms para 60Hz)
    const timeLabels = [];
    const timeStep = (4 * 1000) / data.frequency / numPoints; // 4 ciclos em ms
    for (let i = 0; i < numPoints; i++) {
        timeLabels.push((i * timeStep).toFixed(1));
    }
    
    waveformsChart.data.labels = timeLabels;
    waveformsChart.data.datasets[0].data = voltageWaveform;
    waveformsChart.data.datasets[1].data = currentWaveform;
    waveformsChart.update();

    // Atualizar gráfico de espectro
    const frequencies = [data.frequency, 2*data.frequency, 3*data.frequency, 4*data.frequency, 
                        5*data.frequency, 6*data.frequency, 7*data.frequency, 8*data.frequency, 
                        9*data.frequency, 10*data.frequency];
    const amplitudes = [data.fundamental, data.harmonics.h2, data.harmonics.h3, data.harmonics.h4,
                       data.harmonics.h5, data.harmonics.h6, data.harmonics.h7, data.harmonics.h8,
                       data.harmonics.h9, data.harmonics.h10];
    
    spectrumChart.data.labels = frequencies.map(f => f.toFixed(0));
    spectrumChart.data.datasets[0].data = amplitudes;
    spectrumChart.update();
}

// Função para exportar dados (opcional)
function exportData() {
    const data = getInputData();
    const results = performCalculations(data);
    
    const exportData = {
        input: data,
        results: results,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'thd_analysis.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Função para limpar dados
function clearData() {
    document.getElementById('fundamental').value = '100';
    document.getElementById('frequency').value = '60';
    document.getElementById('h2').value = '0';
    document.getElementById('h3').value = '0';
    document.getElementById('h4').value = '0';
    document.getElementById('h5').value = '0';
    document.getElementById('h6').value = '0';
    document.getElementById('h7').value = '0';
    document.getElementById('h8').value = '0';
    document.getElementById('h9').value = '0';
    document.getElementById('h10').value = '0';
    
    calculateTHD();
}

// Adicionar funções globais para uso no console
window.THDCalculator = {
    calculate: calculateTHD,
    export: exportData,
    clear: clearData,
    getData: getInputData
}; 