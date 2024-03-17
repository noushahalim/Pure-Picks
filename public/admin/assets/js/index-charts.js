function fetchDataForCharts() {
  // Fetch data for line chart

  axios
    .get("/admin/line-chart-data")
    .then((response) => {
      const lineChartData = response.data;
      renderLineChart(lineChartData);
    })
    .catch((error) => {
      console.error("Error fetching line chart data:", error);
    });

  // Fetch data for bar chart
  axios
    .get("/admin/bar-chart-data")
    .then((response) => {
      const barChartData = response.data;
      renderBarChart(barChartData);
    })
    .catch((error) => {
      console.error("Error fetching bar chart data:", error);
    });
}

// Fetch data for the pie chart
function fetchDataForPieChart() {
  axios
    .get("/admin/pie-chart-data")
    .then((response) => {
      const pieChartData = response.data;
      console.log(pieChartData);
      renderPieChart(pieChartData);
    })
    .catch((error) => {
      console.error("Error fetching pie chart data:", error);
    });
}

window.onload = function () {
  fetchDataForCharts();
  fetchDataForPieChart();
};

function renderLineChart(data) {
  window.chartColors = {
    green: "rgb(117,193,129)",
    gray: "rgb(201, 203, 207)",
    border: "rgb(143, 143, 143)",
    text: "rgb(87, 87, 87)",
  };
  var lineChartCanvas = document
    .getElementById("canvas-linechart")
    .getContext("2d");
  var lineChart = new Chart(lineChartCanvas, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Sales",
          fill: false,
          backgroundColor: window.chartColors.green,
          borderColor: window.chartColors.green,
          data: data.salesData,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      legend: {
        display: true,
        position: "bottom",
        align: "end",
      },
      title: {
        display: true,
        text: "Sales Summary for the Past 6 Months",
      },
      tooltips: {
        mode: "index",
        intersect: false,
        titleMarginBottom: 10,
        bodySpacing: 10,
        xPadding: 16,
        yPadding: 16,
        borderColor: window.chartColors.border,
        borderWidth: 1,
        backgroundColor: "#fff",
        bodyFontColor: window.chartColors.text,
        titleFontColor: window.chartColors.text,
        callbacks: {
          label: function (tooltipItem, data) {
            if (parseInt(tooltipItem.value) >= 1000) {
              return (
                "₹" +
                tooltipItem.value
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            } else {
              return "₹" + tooltipItem.value;
            }
          },
        },
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              drawBorder: false,
              color: window.chartColors.border,
            },
            scaleLabel: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              drawBorder: false,
              color: window.chartColors.border,
            },
            scaleLabel: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
              userCallback: function (value, index, values) {
                return "₹" + value.toLocaleString();
              },
            },
          },
        ],
      },
    },
  });
}

// Function to render bar chart
function renderBarChart(data) {
  const chartColors = {
    green: "rgb(75, 192, 192)",
    gray: "rgb(201, 203, 207)",
    border: "rgb(143, 143, 143)",
    text: "rgb(87, 87, 87)",
  };

  var barChartCanvas = document
    .getElementById("canvas-barchart")
    .getContext("2d");
  var barChart = new Chart(barChartCanvas, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Users",
          backgroundColor: chartColors.green,
          borderColor: chartColors.green,
          borderWidth: 1,
          maxBarThickness: 16,
          data: data.userCounts,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      legend: {
        position: "bottom",
        align: "end",
      },
      title: {
        display: true,
        text: "Users Chart",
      },
      tooltips: {
        mode: "index",
        intersect: false,
        titleMarginBottom: 10,
        bodySpacing: 10,
        xPadding: 16,
        yPadding: 16,
        borderColor: chartColors.border,
        borderWidth: 1,
        backgroundColor: "#fff",
        bodyFontColor: chartColors.text,
        titleFontColor: chartColors.text,
      },
      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              drawBorder: false,
              color: chartColors.border,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            gridLines: {
              drawBorder: false,
              color: chartColors.borders,
            },
          },
        ],
      },
    },
  });
}

function renderPieChart(data) {
  const chartColors = ["#007bff", "#28a745", "#dc3545", "#ffc107", "#6f42c1"];
  const labels = data.map((category) => category.categoryName);
  const counts = data.map((category) => category.productCount);

  var pieChartCanvas = document.getElementById("productCategoryPieChart");
  var pieChart = new Chart(pieChartCanvas, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: counts,
          backgroundColor: chartColors,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      legend: {
        display: true,
        position: "bottom",
        align: "end",
      },
      title: {
        display: true,
        text: "Products in Categories",
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var total = dataset.data.reduce(function (
              previousValue,
              currentValue,
              currentIndex,
              array
            ) {
              return previousValue + currentValue;
            });
            var currentValue = dataset.data[tooltipItem.index];
            var percentage = Math.floor((currentValue / total) * 100 + 0.5);
            return `${
              data.labels[tooltipItem.index]
            }: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  });
}
