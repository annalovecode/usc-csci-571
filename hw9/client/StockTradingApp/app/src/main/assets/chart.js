const App = (() => {
  "use strict";

  const messageContainerId = "message-container";
  const chartContainerId = "chart-container";
  const hideClass = "hide";

  let ticker = null;
  let messageContainer = null;
  let chartContainer = null;

  const show = (element) => {
    element.classList.remove(hideClass);
  };

  const hide = (element) => {
    element.classList.add(hideClass);
  };

  const setMessage = (message) => {
    messageContainer.innerHTML = message;
  };

  const showLoading = () => {
    hide(chartContainer);
    setMessage("Fetching Data");
    show(messageContainer);
  };

  const showError = (message) => {
    hide(chartContainer);
    setMessage(message);
    show(messageContainer);
  };
  ``;

  const showChart = () => {
    hide(messageContainer);
    show(chartContainer);
  };

  const buildChart = (items) => {
    const ohlc = [];
    const volume = [];
    items.forEach((item) => {
      ohlc.push([item.date, item.open, item.high, item.low, item.close]);
      volume.push([item.date, item.volume]);
    });

    const chart = Highcharts.stockChart(chartContainerId, {
      time: {
        useUTC: false,
      },

      rangeSelector: {
        selected: 2,
      },

      margin: 0,

      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: "OHLC",
          },
          height: "60%",
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: "Volume",
          },
          top: "65%",
          height: "35%",
          offset: 0,
          lineWidth: 2,
        },
      ],

      tooltip: {
        split: true,
        xDateFormat: "%A, %b %e, %Y",
      },

      plotOptions: {
        series: {
          dataGrouping: {
            units: [
              ["week", [1]],
              ["month", [1, 2, 3, 4, 6]],
            ],
          },
        },
      },

      series: [
        {
          type: "candlestick",
          name: ticker,
          id: ticker.toLowerCase(),
          zIndex: 2,
          data: ohlc,
          tooltip: {
            valueDecimals: 2,
          },
        },
        {
          type: "column",
          name: "Volume",
          id: "volume",
          data: volume,
          yAxis: 1,
        },
        {
          type: "vbp",
          linkedTo: ticker.toLowerCase(),
          params: {
            volumeSeriesID: "volume",
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
          tooltip: {
            valueDecimals: 2,
          },
        },
        {
          type: "sma",
          linkedTo: ticker.toLowerCase(),
          zIndex: 1,
          marker: {
            enabled: false,
          },
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
    });
  };

  const fetchDataAndLoadChart = () => {
    class CheckedError extends Error {
      constructor(message) {
        super(message);
      }
    }

    return fetch(
      `http://usccsci571hw9-env.eba-6fuuwzjp.us-east-1.elasticbeanstalk.com/api/chart?ticker=${ticker}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.statusCode === 404) {
          throw new CheckedError("No data available");
        } else {
          throw new CheckedError("Error occurred while fetching data");
        }
      })
      .then((responseJson) => {
        showChart();
        buildChart(responseJson.data);
      })
      .catch((error) => {
        let message = null;
        if (error instanceof CheckedError) {
          message = error.message;
        } else {
          message = "Network error occurred while fetching data";
        }
        showError(message);
      });
  };

  const initializeTicker = () => {
    const params = new URLSearchParams(window.location.search);
    ticker = params.get("ticker");
  };

  const initializeContainers = () => {
    messageContainer = document.getElementById(messageContainerId);
    chartContainer = document.getElementById(chartContainerId);
  };

  const init = () => {
    initializeTicker();
    initializeContainers();
    showLoading();
    fetchDataAndLoadChart();
  };

  return {
    init,
  };
})();
