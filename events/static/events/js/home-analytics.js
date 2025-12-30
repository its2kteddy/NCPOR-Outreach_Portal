// Analytics Dashboard Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the home page and charts exist
    if (!document.getElementById('trendChart')) return;

    // Initialize charts after a small delay to ensure DOM is ready
    setTimeout(() => {
        initializeCharts();
        fetchAnalyticsData();
    }, 100);
});

function initializeCharts() {
    // Initialize all charts
    initTrendChart();
    initDistributionChart();
    initInstitutionsChart();
    initGeographicChart();
}

// Get theme-aware colors
function getChartConfig() {
    const isDark = document.documentElement.classList.contains('dark');
    
    return {
        textColor: isDark ? '#f0f0f0' : '#2d3748',
        borderColor: isDark ? '#4a5568' : '#e2e8f0',
        backgroundColor: isDark ? '#2d3748' : 'rgba(240, 250, 255, 0.5)',
        gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        colors: {
            primary: '#00DDFF',
            secondary: '#F67280',
            accent: '#6C5B7B',
            success: '#F8B195'
        }
    };
}

// Update Chart.js defaults based on theme
function updateChartDefaults() {
    const config = getChartConfig();
    Chart.defaults.color = config.textColor;
    Chart.defaults.borderColor = config.borderColor;
    Chart.defaults.font.family = "'Inter', 'system-ui', sans-serif";
}

// Trend Line Chart
function initTrendChart() {
    const config = getChartConfig();
    updateChartDefaults();
    
    const ctx = document.getElementById('trendChart').getContext('2d');
    window.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Events',
                data: [8, 12, 10, 15, 13, 18, 14, 16, 20, 17, 22, 19],
                borderColor: config.colors.primary,
                backgroundColor: 'rgba(0, 221, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: config.colors.primary,
                pointBorderColor: config.backgroundColor,
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: config.colors.primary,
                pointHoverBorderColor: config.backgroundColor,
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    borderColor: config.colors.primary,
                    borderWidth: 2,
                    titleColor: document.documentElement.classList.contains('dark') ? '#ffffff' : '#1a202c',
                    bodyColor: document.documentElement.classList.contains('dark') ? '#ffffff' : '#2d3748'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: config.textColor
                    },
                    grid: {
                        color: config.gridColor
                    }
                },
                x: {
                    ticks: {
                        color: config.textColor
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Event Type Distribution Pie Chart
function initDistributionChart() {
    const config = getChartConfig();
    updateChartDefaults();
    
    const ctx = document.getElementById('distributionChart').getContext('2d');
    window.distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Workshops', 'Exhibitions', 'Field Visits', 'Scientific Talks'],
            datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: [
                    config.colors.primary,
                    config.colors.secondary,
                    config.colors.accent,
                    config.colors.success
                ],
                borderWidth: 3,
                borderColor: config.backgroundColor,
                hoverBorderWidth: 4,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: { 
                            size: 13, 
                            weight: '500',
                            family: "'Inter', 'system-ui', sans-serif"
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: config.textColor,
                        boxWidth: 10,
                        boxHeight: 10
                    }
                },
                tooltip: {
                    backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    borderColor: config.colors.primary,
                    borderWidth: 2,
                    titleColor: document.documentElement.classList.contains('dark') ? '#ffffff' : '#1a202c',
                    bodyColor: document.documentElement.classList.contains('dark') ? '#ffffff' : '#2d3748',
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Top Institutions Bar Chart
function initInstitutionsChart() {
    const config = getChartConfig();
    updateChartDefaults();
    
    const ctx = document.getElementById('institutionsChart').getContext('2d');
    window.institutionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['IIT Delhi', 'JNU', 'DU', 'BHU', 'AMU'],
            datasets: [{
                label: 'Participants',
                data: [450, 380, 320, 290, 260],
                backgroundColor: config.colors.primary,
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 40,
                hoverBackgroundColor: config.colors.secondary
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    borderColor: config.colors.primary,
                    borderWidth: 2,
                    titleColor: document.documentElement.classList.contains('dark') ? '#ffffff' : '#1a202c',
                    bodyColor: document.documentElement.classList.contains('dark') ? '#ffffff' : '#2d3748'
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: config.textColor
                    },
                    grid: {
                        color: config.gridColor
                    }
                },
                y: {
                    ticks: {
                        color: config.textColor
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Geographic Distribution Bar Chart
function initGeographicChart() {
    const config = getChartConfig();
    updateChartDefaults();
    
    const ctx = document.getElementById('geographicChart').getContext('2d');
    window.geographicChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Delhi', 'Mumbai', 'Bangalore', 'Goa', 'Kolkata', 'Chennai'],
            datasets: [{
                label: 'Events',
                data: [28, 22, 18, 25, 15, 12],
                backgroundColor: [
                    config.colors.primary,
                    config.colors.secondary,
                    config.colors.accent,
                    config.colors.success,
                    '#FF1D58',
                    '#355C7D'
                ],
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 45,
                hoverBackgroundColor: function(context) {
                    const colors = [
                        config.colors.primary,
                        config.colors.secondary,
                        config.colors.accent,
                        config.colors.success,
                        '#FF1D58',
                        '#355C7D'
                    ];
                    return colors[context.dataIndex];
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    borderColor: config.colors.primary,
                    borderWidth: 2,
                    titleColor: document.documentElement.classList.contains('dark') ? '#ffffff' : '#1a202c',
                    bodyColor: document.documentElement.classList.contains('dark') ? '#ffffff' : '#2d3748'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: config.textColor
                    },
                    grid: {
                        color: config.gridColor
                    }
                },
                x: {
                    ticks: {
                        color: config.textColor
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Fetch real analytics data from API
async function fetchAnalyticsData() {
    try {
        const response = await fetch('/api/analytics/');
        if (response.ok) {
            const data = await response.json();
            updateCharts(data);
            updateKPIs(data);
        }
    } catch (error) {
        console.log('Using default analytics data');
        // Continue with default data shown in charts
    }
}

// Update charts with real data
function updateCharts(data) {
    if (data.trend && window.trendChart) {
        window.trendChart.data.labels = data.trend.labels;
        window.trendChart.data.datasets[0].data = data.trend.data;
        window.trendChart.update('none');
    }

    if (data.distribution && window.distributionChart) {
        window.distributionChart.data.labels = data.distribution.labels;
        window.distributionChart.data.datasets[0].data = data.distribution.data;
        window.distributionChart.update('none');
    }

    if (data.institutions && window.institutionsChart) {
        window.institutionsChart.data.labels = data.institutions.labels;
        window.institutionsChart.data.datasets[0].data = data.institutions.data;
        window.institutionsChart.update('none');
    }

    if (data.geographic && window.geographicChart) {
        window.geographicChart.data.labels = data.geographic.labels;
        window.geographicChart.data.datasets[0].data = data.geographic.data;
        window.geographicChart.update('none');
    }
}

// Update KPI cards
function updateKPIs(data) {
    if (data.kpis) {
        if (data.kpis.total_events) {
            document.getElementById('kpi-total-events').textContent = data.kpis.total_events;
        }
        if (data.kpis.total_participants) {
            document.getElementById('kpi-total-participants').textContent = formatNumber(data.kpis.total_participants);
        }
        if (data.kpis.institutions) {
            document.getElementById('kpi-institutions').textContent = data.kpis.institutions;
        }
        if (data.kpis.growth) {
            document.getElementById('kpi-growth').textContent = data.kpis.growth + '%';
        }
    }
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Listen for dark mode changes and update charts
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
            updateChartsForTheme();
        }
    });
});

observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
});

function updateChartsForTheme() {
    const config = getChartConfig();
    updateChartDefaults();
    
    // Update all chart configurations for the new theme
    if (window.trendChart) {
        window.trendChart.options.plugins.tooltip.backgroundColor = document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(0, 0, 0, 0.8)';
        window.trendChart.options.plugins.tooltip.bodyColor = config.textColor;
        window.trendChart.options.plugins.tooltip.titleColor = config.colors.primary;
        window.trendChart.options.scales.y.ticks.color = config.textColor;
        window.trendChart.options.scales.y.grid.color = config.gridColor;
        window.trendChart.options.scales.x.ticks.color = config.textColor;
        window.trendChart.options.scales.x.grid.color = config.gridColor;
        window.trendChart.data.datasets[0].pointBorderColor = config.backgroundColor;
        window.trendChart.update('none');
    }
    
    if (window.distributionChart) {
        window.distributionChart.options.plugins.legend.labels.color = config.textColor;
        window.distributionChart.options.plugins.tooltip.backgroundColor = document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(0, 0, 0, 0.8)';
        window.distributionChart.options.plugins.tooltip.bodyColor = config.textColor;
        window.distributionChart.options.plugins.tooltip.titleColor = config.colors.primary;
        window.distributionChart.data.datasets[0].borderColor = config.backgroundColor;
        
        // Force legend text color update
        if (window.distributionChart.legend && window.distributionChart.legend.legendItems) {
            window.distributionChart.legend.legendItems.forEach(item => {
                item.fontColor = config.textColor;
            });
        }
        
        window.distributionChart.update('none');
    }
    
    if (window.institutionsChart) {
        window.institutionsChart.options.plugins.tooltip.backgroundColor = document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(0, 0, 0, 0.8)';
        window.institutionsChart.options.plugins.tooltip.bodyColor = config.textColor;
        window.institutionsChart.options.plugins.tooltip.titleColor = config.colors.primary;
        window.institutionsChart.options.scales.x.ticks.color = config.textColor;
        window.institutionsChart.options.scales.x.grid.color = config.gridColor;
        window.institutionsChart.options.scales.y.ticks.color = config.textColor;
        window.institutionsChart.update('none');
    }
    
    if (window.geographicChart) {
        window.geographicChart.options.plugins.tooltip.backgroundColor = document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(0, 0, 0, 0.8)';
        window.geographicChart.options.plugins.tooltip.bodyColor = config.textColor;
        window.geographicChart.options.plugins.tooltip.titleColor = config.colors.primary;
        window.geographicChart.options.scales.y.ticks.color = config.textColor;
        window.geographicChart.options.scales.y.grid.color = config.gridColor;
        window.geographicChart.options.scales.x.ticks.color = config.textColor;
        window.geographicChart.update('none');
    }
}
