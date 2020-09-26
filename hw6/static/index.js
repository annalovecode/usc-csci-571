const App = (function () {
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

    function hide(element) {
        element.classList.add(hideClass);
    }

    function show(element) {
        element.classList.remove(hideClass);
    }

    function selectTab(tabElement) {
        tabElement.classList.add(selectedTabClass);
    }

    function unselectTab(tabElement) {
        tabElement.classList.remove(selectedTabClass);
    }

    function showing(element) {
        return !(element.classList.contains(hideClass));
    }

    function buildCompanyOutlook(data) {
        function buildRow(key, value) {
            return `<div>
                        <div>${key}</div>
                        <div><p>${value}</p></div>
                    </div>`;
        }

        resultSuccessContent[companyOutlook].innerHTML =
            buildRow('Company Name', data['companyName']) +
            buildRow('Stock Ticker Symbol', data['stockTickerSymbol']) +
            buildRow('Stock Exchange Code', data['stockExchangeCode']) +
            buildRow('Company Start Date', data['companyStartDate']) +
            buildRow('Description', data['description']);
    }

    function buildStockSummary(data) {
        function buildRow(key, value) {
            return `<div>
                        <div>${key}</div>
                        <div><p>${value}</p></div>
                    </div>`;
        }

        function buildCellWithImage(value, isPercentage = false) {
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
            buildRow('Previous Closing Price', data['previousClosingPrice']) +
            buildRow('Opening Price', data['openingPrice']) +
            buildRow('High Price', data['highPrice']) +
            buildRow('Low Price', data['lowPrice']) +
            buildRow('Last Price', data['lastPrice']) +
            buildRow('Change', buildCellWithImage(data['change'])) +
            buildRow('Change Percent', buildCellWithImage(data['changePercent'], true)) +
            buildRow('Number of Shares Traded', data['numberOfSharesTraded']);
    }

    function buildCharts(data) {
        const priceData = [];
        const volumeData = [];
        data.forEach(function ({ date, stockPrice, volume }) {
            const epochDate = Date.parse(date.split("T")[0]);
            priceData.push([epochDate, stockPrice]);
            volumeData.push([epochDate, volume]);
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

            xAxis: {
                max: null,
                min: null,
                startOnTick: true,
                endOnTick: true,
                minPadding: 0,
                maxPadding: 0
            },

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

            series: [{
                name: ticker,
                type: 'area',
                data: priceData,
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
                data: volumeData,
                pointWidth: 2,
                yAxis: 1
            }]
        });
    }

    function buildLatestNews(data) {
        function buildNews(news) {
            return `<div>
                        <div style="background-image: url(${news['image']});">
                        </div>
                        <div>
                            <div>${news['title']}</div>
                            <div>Published Date: ${news['date']}</div>
                            <div>
                                <a href="${news['linkToOriginalPost']}" target="_blank">See Original Post</a>
                            </div>
                        </div>
                    </div>`
        }

        let innerHTML = "";
        data.forEach(function (news) {
            innerHTML += buildNews(news);
        });

        resultSuccessContent[latestNews].innerHTML = innerHTML;
    }

    function buildSectionError(section, message) {
        resultSuccessContent[section].innerHTML =
            `<p>
                ${message}
             </p>`
    }

    function hideSection(section) {
        unselectTab(resultSuccessTab[section]);
        hide(resultSuccessContent[section]);
    }

    function showSection(section) {
        if (selectedSection !== null) {
            hideSection(selectedSection);
        }
        selectedSection = section;
        selectTab(resultSuccessTab[section]);
        show(resultSuccessContent[section]);
    }

    function showResultSuccess() {
        show(resultSuccess);
        hide(resultError);
    }

    function showResultError(message) {
        hide(resultSuccess);
        resultError.innerHTML = message;
        show(resultError);
    }

    function fetchSection(ticker, section) {
        class CheckedError extends Error {
            constructor(message) {
                super(message);
            }
        }

        return fetch(`${section}/${ticker}`).then(function (response) {
            return response.json().then(function (data) {
                if (response.status === 200) {
                    return data;
                } else if (response.status === 404) {
                    throw new CheckedError(data['message']);
                } else {
                    throw new CheckedError("Internal server error");
                }
            })
        }).catch(function (error) {
            if (error instanceof CheckedError) {
                throw error.message;
            }
            throw "Network error";
        })
    }

    function search(ticker) {
        function isResolved(response) {
            return response.status === 'fulfilled';
        }

        function buildSection(section, response, builder) {
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
        ]).then(function ([companyOutlookResponse, stockSummaryResponse, chartsResponse, latestNewsResponse]) {
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

    function searchButtonClickHandler(event) {
        const ticker = searchInput.value;
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

    function clearInput() {
        searchInput.value = '';
        searchQuery = null;
    }

    function clearResult() {
        if (selectedSection !== null) {
            hideSection(selectedSection);
            selectedSection = null;
        }
        hide(resultSuccess);
        hide(resultError);
    }

    function clearButtonClickHandler() {
        clearInput();
        clearResult();
    }

    function tabClickHandler(event) {
        const section = (event.target.id).substring(11);
        showSection(section);
    }

    function init() {
        searchInput = document.querySelector('#search-field-input > input');

        searchButton = document.querySelector('#search-button > input');
        searchButton.addEventListener("click", searchButtonClickHandler);

        clearButton = document.getElementById('clear-button');
        clearButton.addEventListener("click", clearButtonClickHandler);

        resultSuccess = document.getElementById('result-success');
        [companyOutlook, stockSummary, charts, latestNews].forEach(function (section) {
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