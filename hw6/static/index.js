const App = (() => {
    "use strict";

    let searchInput = null;
    let searchButton = null;
    let clearButton = null;
    let previousTicker = null;
    let resultSuccess = null;
    let resultError = null;
    let selectedSection = null;
    let companyOutlook = 'company-outlook';
    let stockSummary = 'stock-summary';
    let charts = 'charts';
    let latestNews = 'latest-news';
    const sections = [companyOutlook, stockSummary, charts, latestNews];
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

    const selectTab = (section) => {
        resultSuccessTab[section].classList.add(selectedTabClass);
    }

    const unselectTab = (section) => {
        resultSuccessTab[section].classList.remove(selectedTabClass);
    }

    const showing = (element) => !(element.classList.contains(hideClass));

    const hideSection = (section) => {
        hide(resultSuccessContent[section]);
    }

    const showSection = (section) => {
        show(resultSuccessContent[section]);
    }

    const unselectSection = () => {
        if (selectedSection !== null) {
            unselectTab(selectedSection);
            hideSection(selectedSection);
            selectedSection = null;
        }
    }

    const selectSection = (section) => {
        unselectSection();
        selectedSection = section;
        selectTab(section);
        showSection(section);
    }

    const clear = (element) => {
        element.innerHTML = "";
    }

    const clearSections = () => {
        sections.forEach((section) => clear(resultSuccessContent[section]));
    }

    const clearSearchInput = () => {
        searchInput.value = '';
        previousTicker = null;
    }

    const hideAndClearResult = () => {
        hide(resultSuccess);
        hide(resultError);
        unselectSection();
        clearSections();
        clear(resultError);
    }

    const setCompanyOutlook = (data) => {
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

    const setStockSummary = (data) => {
        const floatFormatter = (value) => value.toFixed(2);

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

        const buildRow = (key, value) =>
            `<div>
                <div>${key}</div>
                <div>
                    <p>${value}</p>
                </div>
            </div>`;

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

    const setCharts = (data) => {
        const stockPrices = [];
        const volumes = [];
        data.forEach(({ date, stockPrice, volume }) => {
            const epochDate = Date.parse(date);
            stockPrices.push([epochDate, stockPrice]);
            volumes.push([epochDate, volume]);
        });

        const ticker = previousTicker.toUpperCase();

        Highcharts.stockChart(`result-${charts}`, {
            time: {
                timezone: 'America/Los_Angeles'
            },

            title: {
                text: `Stock Price ${previousTicker.toUpperCase()} ${(moment().tz('America/Los_Angeles')).toISOString().slice(0, 10)}`
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

    const setLatestNews = (data) => {
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

    const setSectionError = (section, message) => {
        resultSuccessContent[section].innerHTML =
            `<p>
                ${message}
             </p>`
    }

    const setResultError = (message) => {
        resultError.innerHTML = message;
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

    const fetchAndSetResult = (ticker) => {
        const isResolved = (response) => response.status === 'fulfilled';

        const fetchAndSetSection = (ticker, section, setSection) => {
            Promise.allSettled([fetchSection(ticker, section)]).then(([response]) => {
                if (isResolved(response)) {
                    setSection(response.value);
                } else {
                    setSectionError(section, response.reason);
                }
            });
        }

        Promise.allSettled([
            fetchSection(ticker, companyOutlook),
            fetchSection(ticker, stockSummary)
        ]).then(([companyOutlookResponse, stockSummaryResponse]) => {
            if (!isResolved(companyOutlookResponse) || !isResolved(stockSummaryResponse)) {
                setResultError(companyOutlookResponse.reason || stockSummaryResponse.reason);
                show(resultError);
            } else {
                setCompanyOutlook(companyOutlookResponse.value);
                setStockSummary(stockSummaryResponse.value);
                selectSection(companyOutlook);
                show(resultSuccess);
                fetchAndSetSection(ticker, charts, setCharts);
                fetchAndSetSection(ticker, latestNews, setLatestNews);
            }
        })
    }

    const searchButtonClickHandler = (event) => {
        const ticker = searchInput.value.trim().toUpperCase();
        if (ticker.length > 0) {
            event.preventDefault();
            if (ticker !== previousTicker) {
                previousTicker = ticker;
                hideAndClearResult();
                fetchAndSetResult(ticker);
            } else if (showing(resultSuccess)) {
                selectSection(companyOutlook);
            }
        }
    }

    const clearButtonClickHandler = (event) => {
        event.preventDefault();
        clearSearchInput();
        hideAndClearResult();
    }

    const tabClickHandler = (event) => {
        const section = (event.target.id).substring(11);
        selectSection(section);
    }

    const init = () => {
        searchInput = document.querySelector('#search-field-input > input');

        searchButton = document.querySelector('#search-button > input');
        searchButton.addEventListener("click", searchButtonClickHandler);

        clearButton = document.querySelector('#clear-button > input');
        clearButton.addEventListener("click", clearButtonClickHandler);

        resultSuccess = document.getElementById('result-success');
        sections.forEach((section) => {
            resultSuccessTab[section] = document.getElementById(`result-tab-${section}`);
            resultSuccessTab[section].addEventListener("click", tabClickHandler);
            resultSuccessContent[section] = document.getElementById(`result-${section}`);
        });

        resultError = document.getElementById('result-error');
    }


    return {
        init
    };
})();