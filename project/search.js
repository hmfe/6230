
(function() {

    document.getElementById("search-currency").oninput = onCurrencySearch;
    document.getElementsByClassName("clear-history")[0].onclick = onClearHistoryClick;
    document.getElementsByClassName("clear-history-small")[0].onclick = onClearHistoryClick;
            
    function onCurrencySearch() {
        let searchList = document.getElementById("search-list");
        let currecncySearch = document.getElementById('search-currency').value;
        currecncySearch = currecncySearch.trim().replace(/( )?:( )?/g, '');
        searchList !== null && clearCurrencyList();
        if (currecncySearch !== '' && currecncySearch !== ' ') {
            fetchCurrencyDetails(currecncySearch);
        }
    }

    function fetchCurrencyDetails(currecncySearch) {
        fetch('http://data.fixer.io/api/latest?access_key=649b26e6e640c666e8a8993dc28468cc')
        .then(response => response.json())
        .then(json => {
            let currencyMatchList = [];
            let currencyListCount = 0;
            let currencyList = Object.keys(json.rates);
            currencyList.forEach(currency => {
                let currencyMatch = currency.match(currecncySearch.toUpperCase());
                if (currencyMatch !== null) {
                    currencyMatch = currencyMatch.input;
                    currencyMatchList.push(currencyMatch);
                    populateCurrencyList(currecncySearch, currencyMatch, currencyListCount);
                    ++currencyListCount;
                }
            });
        });
    }

    function highlightSearchResults(inputString, matchString) {
        let regEx = new RegExp(inputString, 'gi');
        let response = matchString.replace(regEx, (str) => {
            return "<strong>" + str + "</strong>"
        });
        return response;
    }

    function createUnorderedList(listType, list, listElementId, listParentId, listCount, tabIndex, listKey) {
        listKey = (typeof listKey !== 'undefined') ?  listKey : "";
        let unorderedListNode = "";
        if (listCount === 0) {
            unorderedListNode = document.createElement("ul");
            unorderedListNode.setAttribute("id", listElementId);
            unorderedListNode.setAttribute("tabindex", tabIndex);

            document.getElementById(listParentId).appendChild(unorderedListNode);
        }
        let listNode = document.createElement("li");
        listNode.setAttribute("tabindex", "-1");

        let listTextNode = document.createElement("a");
        listTextNode.className = "list-text";
        listTextNode.setAttribute("href", "#");
        if (listKey !== "") {
            listTextNode.innerHTML = highlightSearchResults(listKey, list);
            navigateList(listElementId);
        } else {
            let txtNode = document.createTextNode(list);
            listTextNode.appendChild(txtNode);
        }
        listNode.appendChild(listTextNode);
        if (listType === "history") {
            let timestamp = timestampConvertion();
            let timestampNode = document.createElement("time");
            
            let closeIconNode = document.createElement("button");
            closeIconNode.className = "close-icon";
            closeIconNode.onclick = onHistoryListClose;

            let timestampContainerNode = document.createElement("section");
            timestampContainerNode.className = "timestamp-box";
            timestampContainerNode.appendChild(timestampNode);
            timestampContainerNode.appendChild(closeIconNode);

            //display timestamp
            let timestampTextNode = document.createTextNode(timestamp);
            timestampNode.appendChild(timestampTextNode);
            listNode.appendChild(timestampContainerNode);

            let dataList = "history-list-" + (listCount + 1);
            listNode.setAttribute("data-list", dataList);
        }
        document.getElementById(listElementId).appendChild(listNode);
        if (listType === "search") {
            listNode.onclick = onCurrencySearchClick;
        }
    }

    function navigateList(listElementId) {
        let inputElement = document.getElementById("search-currency");
        
        document.onkeydown = (e) => {
            let listElement = document.getElementById(listElementId),
                firstItem, lastItem;

            if (listElement !== null) {
                firstItem = listElement.firstChild,
                lastItem = listElement.lastChild;
            
                switch (e.keyCode) {
                    case 38: // Up key
                        if ((document.activeElement === null) || 
                            (document.activeElement === inputElement) ||
                            (document.activeElement.parentNode !== listElement)) {
                            break;   
                        } else if (document.activeElement === firstItem) {
                            inputElement.focus();
                        } else {
                            document.activeElement.previousSibling.focus();
                        }
                    break;
                    case 40: // Down key
                        if (document.activeElement === null) {
                            break;
                        } else if (document.activeElement === inputElement) {
                            firstItem.focus();
                        } else if (document.activeElement.parentNode !== listElement) {
                            break;
                        } else if (document.activeElement === lastItem) {
                            lastItem.focus();
                        } else {
                            document.activeElement.nextSibling.focus();
                        }
                    break;
                    case 13: // Enter key
                        if (document.activeElement.parentNode !== listElement) {
                            break;
                        } 
                        else {
                            document.activeElement.click();
                        }
                    break;
                }
            }
        }
    }

    function populateCurrencyList(currecncySearch, currencyMatch, currencyListCount) {
        let listType = "search",
            list = currencyMatch,
            listKey = currecncySearch;
            listElementId = "search-list",
            listParentId = "search-form",
            listCount = currencyListCount,
            tabIndex = "1";
        createUnorderedList(listType, list, listElementId, listParentId, listCount, tabIndex, listKey);
    }

    function clearCurrencyList() {
        document.getElementById("search-list").remove();
    }

    function populateSearchHistoryList(historyList, historyListCount) {
        let listType = "history",
            list = historyList,
            listElementId = "search-history-list",
            listParentId = "search-history",
            listCount = historyListCount,
            tabIndex = "2";
        createUnorderedList(listType, list, listElementId, listParentId, listCount, tabIndex);
    }

    function dateZeroFormat(i) {
        if (i < 10) {
        i = "0" + i;
        }
        return i;
    }

    function timestampConvertion() {
        let date = new Date(),
        hours = date.getHours(),
        minutes = dateZeroFormat(date.getMinutes()),
        format = hours >= 12 ? ' PM' : ' AM',
        year = date.getFullYear(),
        month = dateZeroFormat(date.getMonth() + 1),
        actualDate = date.getDate(),
        fullTimeStamp = year + '-' + month + '-' + actualDate + ',' + ' ' + hours + ":" + minutes + format;
        return fullTimeStamp;
    }

    function onCurrencySearchClick(e) {
        let historyList = e.srcElement.textContent,
            historyListCount = 0,
            historyListElement = document.getElementById("search-history-list");
        if (historyListElement !== null) {
            historyListCount = document.getElementById("search-history-list").childElementCount;
        }
        populateSearchHistoryList(historyList, historyListCount);
    }

    function onHistoryListClose(e) {
        let selectedListElement = e.srcElement.parentNode.parentElement,
            isSelectedList= selectedListElement.hasAttribute("data-list");
        if (isSelectedList === true) {
            selectedListElement.remove();
        }
    }

    function onClearHistoryClick() {
        let historyListElement = document.getElementById("search-history-list");
        if (historyListElement !== null) {
            historyListElement.remove();
        }
    }

})();
