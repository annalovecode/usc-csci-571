const App = (() => {
    "use strict";

    let searchInput = null;
    let searchButton = null;
    let clearButton = null;
    let searchQuery = null;
    let resultSuccess = null;
    let resultError = null;
    let selectedSection = null;
    let companyOutlook = 'company-outlook';
    let stockSummary = 'stock-summary';
    let charts = 'charts';
    let latestNews = 'latest-news';
    const resultSuccessTab = {};
    const resultSuccessContent = {};
    const selectedTabClass = 'selected-tab';
    const hideClass = 'hide';

    const hide = (element) => {
        element.classList.add(hideClass);
    }

    const show = (element) => {
        element.classList.remove(hideClass);
    }

    const selectTab = (tabElement) => {
        tabElement.classList.add(selectedTabClass);
    }

    const unselectTab = (tabElement) => {
        tabElement.classList.remove(selectedTabClass);
    }

    const showing = (element) => !(element.classList.contains(hideClass));

    const floatFormatter = (value) => value.toFixed(2);

    const buildCompanyOutlook = (data) => {
        const buildRow = (key, value) =>
            `<div>
                <div>${key}</div>
                <div>
                    <p>${value}</p>
                </div>
            </div>`;

        resultSuccessContent[companyOutlook].innerHTML =
            buildRow('Company Name', data['companyName']) +
            buildRow('Stock Ticker Symbol', data['stockTickerSymbol']) +
            buildRow('Stock Exchange Code', data['stockExchangeCode']) +
            buildRow('Company Start Date', data['companyStartDate']) +
            buildRow('Description', data['description']);
    }

    const buildStockSummary = (data) => {
        const buildRow = (key, value) =>
            `<div>
                <div>${key}</div>
                <div>
                    <p>${value}</p>
                </div>
            </div>`;


        const buildNumberCellWithImage = (value, isPercentage = false) => {
            let cell = value.toString();
            if (isPercentage) {
                cell += '%';
            }
            let arrow = null;
            if (value < 0) {
                arrow = "RedArrowDown";
            } else if (value > 0) {
                arrow = "GreenArrowUp";
            }
            if (arrow != null) {
                cell += `<img src="https://csci571.com/hw/hw6/images/${arrow}.jpg">`;
            }
            return cell;
        }

        resultSuccessContent[stockSummary].innerHTML =
            buildRow('Stock Ticker Symbol', data['stockTickerSymbol']) +
            buildRow('Trading Day', data['tradingDay']) +
            buildRow('Previous Closing Price', floatFormatter(data['previousClosingPrice'])) +
            buildRow('Opening Price', floatFormatter(data['openingPrice'])) +
            buildRow('High Price', floatFormatter(data['highPrice'])) +
            buildRow('Low Price', floatFormatter(data['lowPrice'])) +
            buildRow('Last Price', floatFormatter(data['lastPrice'])) +
            buildRow('Change', buildNumberCellWithImage(floatFormatter(data['change']))) +
            buildRow('Change Percent', buildNumberCellWithImage(floatFormatter(data['changePercent']), true)) +
            buildRow('Number of Shares Traded', data['numberOfSharesTraded']);
    }

    const buildCharts = (data) => {
        const stockPrices = [];
        const volumes = [];
        data.forEach(({ date, stockPrice, volume }) => {
            const epochDate = Date.parse(date);
            stockPrices.push([epochDate, stockPrice]);
            volumes.push([epochDate, volume]);
        });

        const ticker = searchQuery.toUpperCase();

        Highcharts.stockChart(`result-${charts}`, {
            time: {
                timezone: 'America/Los_Angeles'
            },

            title: {
                text: `Stock Price ${searchQuery.toUpperCase()} ${(new Date()).toISOString().slice(0, 10)}`
            },

            subtitle: {
                text: '<div style="margin-top: 10px;"><a href="https://api.tiingo.com/" target="_blank">Source: Tiingo</a></div>',
                useHTML: true
            },

            yAxis: [{
                title: {
                    text: 'Stock Price'
                },
                opposite: false
            }, {
                title: {
                    text: 'Volume'
                },
                opposite: true
            }],

            rangeSelector: {
                allButtonsEnabled: true,
                buttons: [{
                    type: 'day',
                    text: '7d',
                    count: 7
                }, {
                    type: 'day',
                    text: '15d',
                    count: 15
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }],
                selected: 4,
                inputEnabled: false
            },

            chart: {
                spacingTop: 15,
                spacingLeft: 15,
                spacingRight: 15
            },

            tooltip: {
                xDateFormat: '%A, %b %e, %Y'
            },

            series: [{
                name: ticker,
                type: 'area',
                data: stockPrices,
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                yAxis: 0
            }, {
                name: `${ticker} Volume`,
                type: 'column',
                data: volumes,
                pointWidth: 2,
                yAxis: 1,
                pointPlacement: 'on',
            }]
        });
    }

    const buildLatestNews = (data) => {
        const buildNews = (news) =>
            `<div>
                <div style="background-image: url(${news['image']});">
                </div>
                <div>
                    <div>${news['title']}</div>
                    <div>Published Date:  ${news['date']}</div>
                    <div>
                        <a href="${news['linkToOriginalPost']}" target="_blank">See Original Post</a>
                    </div>
                </div>
            </div>`;

        let innerHTML = "";
        data.forEach((news) => {
            innerHTML += buildNews(news);
        });

        resultSuccessContent[latestNews].innerHTML = innerHTML;
    }

    const buildSectionError = (section, message) => {
        resultSuccessContent[section].innerHTML =
            `<p>
                ${message}
             </p>`
    }

    const hideSection = (section) => {
        unselectTab(resultSuccessTab[section]);
        hide(resultSuccessContent[section]);
    }

    const showSection = (section) => {
        if (selectedSection !== null) {
            hideSection(selectedSection);
        }
        selectedSection = section;
        selectTab(resultSuccessTab[section]);
        show(resultSuccessContent[section]);
    }

    const showResultSuccess = () => {
        show(resultSuccess);
        hide(resultError);
    }

    const showResultError = (message) => {
        hide(resultSuccess);
        resultError.innerHTML = message;
        show(resultError);
    }

    const fetchSection = (ticker, section) => {
        class CheckedError extends Error {
            constructor(message) {
                super(message);
            }
        }

        return fetch(`${section}/${ticker}`).then((response) => response.json().then((data) => {
            if (response.status === 200) {
                return data;
            } else if (response.status === 404) {
                throw new CheckedError(data['message']);
            } else {
                throw new CheckedError("Internal server error");
            }
        })).catch((error) => {
            if (error instanceof CheckedError) {
                throw error.message;
            }
            throw "Network error";
        })
    }

    const search = (ticker) => {
        const isResolved = (response) => response.status === 'fulfilled';

        const buildSection = (section, response, builder) => {
            if (isResolved(response)) {
                builder(response.value);
            } else {
                buildSectionError(section, response.reason);
            }
        }

        Promise.allSettled([
            fetchSection(ticker, companyOutlook),
            fetchSection(ticker, stockSummary),
            fetchSection(ticker, charts),
            fetchSection(ticker, latestNews)
        ]).then(([companyOutlookResponse, stockSummaryResponse, chartsResponse, latestNewsResponse]) => {
            if (!isResolved(companyOutlookResponse)) {
                showResultError(companyOutlookResponse.reason);
            } else if (!isResolved(stockSummaryResponse)) {
                showResultError(stockSummaryResponse.reason);
            } else {
                buildSection(companyOutlook, companyOutlookResponse, buildCompanyOutlook);
                buildSection(stockSummary, stockSummaryResponse, buildStockSummary);
                buildSection(charts, chartsResponse, buildCharts);
                buildSection(latestNews, latestNewsResponse, buildLatestNews);
                showSection(companyOutlook);
                showResultSuccess();
            }
        })
    }

    const searchButtonClickHandler = (event) => {
        const ticker = searchInput.value.toUpperCase();
        if (ticker.length > 0) {
            event.preventDefault();
            if (ticker !== searchQuery) {
                searchQuery = ticker;
                clearResult();
                search(ticker);
            } else if (showing(resultSuccess)) {
                showSection(companyOutlook);
            }
        }
    }

    const clearInput = () => {
        searchInput.value = '';
        searchQuery = null;
    }

    const clearResult = () => {
        if (selectedSection !== null) {
            hideSection(selectedSection);
            selectedSection = null;
        }
        hide(resultSuccess);
        hide(resultError);
    }

    const clearButtonClickHandler = (event) => {
        event.preventDefault();
        clearInput();
        clearResult();
    }

    const tabClickHandler = (event) => {
        const section = (event.target.id).substring(11);
        showSection(section);
    }

    const init = () => {
        searchInput = document.querySelector('#search-field-input > input');

        searchButton = document.querySelector('#search-button > input');
        searchButton.addEventListener("click", searchButtonClickHandler);

        clearButton = document.querySelector('#clear-button > input');
        clearButton.addEventListener("click", clearButtonClickHandler);

        resultSuccess = document.getElementById('result-success');
        [companyOutlook, stockSummary, charts, latestNews].forEach((section) => {
            resultSuccessTab[section] = document.getElementById(`result-tab-${section}`);
            resultSuccessTab[section].addEventListener("click", tabClickHandler);
            resultSuccessContent[section] = document.getElementById(`result-${section}`);
        });

        resultError = document.getElementById('result-error');
    }


    return {
        init: init
    };
})();