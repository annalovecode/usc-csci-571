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

    const sections = [companyOutlook, stockSummary, charts, latestNews];

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
                        <div>${value}</div>
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
                        <div>${value}</div>
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

    function buildCharts(chartsData) {
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

    function showResultError() {
        hide(resultSuccess);
        show(resultError);
    }

    // function fetch(resource, ticker, successCallback) {
    //     const xhr = new XMLHttpRequest();
    //     xhr.addEventListener("loadend", function () {
    //         if (xhr.status === 200) {
    //             successCallback(JSON.parse(xhr.responseText));
    //         } else {
    //             showResultError();
    //         }
    //     });
    //     xhr.open("GET", `${resource}/${ticker}`);
    //     xhr.send();
    // }
    //
    // function searchButtonClickHandler() {
    //     const ticker = searchInput.value;
    //     if (ticker.length > 0) {
    //         clearResult();
    //         fetch(companyOutlook, ticker, function (companyOutlookData) {
    //             buildCompanyOutlook(companyOutlookData);
    //             fetch(stockSummary, ticker, function (stocksSummaryData) {
    //                 buildStockSummary(stocksSummaryData);
    //                 fetch(charts, ticker, function (chartsData) {
    //                     buildCharts(chartsData);
    //                     fetch(latestNews, ticker, function (latestNewsData) {
    //                         buildLatestNews(latestNewsData);
    //                         showSection(companyOutlook);
    //                         showResultSuccess();
    //                     });
    //                 });
    //             });
    //         });
    //     }
    // }

    function searchButtonClickHandler(event) {
        const ticker = searchInput.value;
        if (ticker.length > 0) {
            event.preventDefault();
            if (ticker !== searchQuery) {
                searchQuery = ticker;
                clearResult();
                Promise.all(sections.map(function (section) {
                    return fetch(`${section}/${ticker}`);
                })).then(function (responses) {
                    return Promise.all(responses.map(function (response) {
                        return response.json();
                    }))
                }).then(function ([companyOutlookData, stockSummaryData, chartsData, latestNewsData]) {
                    buildCompanyOutlook(companyOutlookData);
                    buildStockSummary(stockSummaryData);
                    buildCharts(chartsData);
                    buildLatestNews(latestNewsData);
                    showSection(companyOutlook);
                    showResultSuccess();
                }).catch(function () {
                    showResultError();
                })
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
        sections.forEach(function (section) {
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