
(function() {

    document.getElementById("search-currency").oninput = onCurrencySearch;
    document.getElementsByClassName("clear-history")[0].onclick = onClearHistoryClick;
    document.getElementsByClassName("clear-history-small")[0].onclick = onClearHistoryClick;
    const search = document.querySelector('input[type="search"]');

    search.addEventListener('blur', (e) => {
        let targetCaptured = "";
        if (e.target !== e.currentTarget) {
            targetCaptured = e.currentTarget;
        }
        console.log("event: ", e.target, targetCaptured);
    });
            
    function onCurrencySearch() {
        let searchList = document.getElementById("search-list");
        let currecncySearch = document.getElementById('search-currency').value;
    //    console.log('currency: ', currecncySearch);
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
                    currencyMatch = currencyMatch.input
                //    console.log(currencyMatch);
                    currencyMatchList.push(currencyMatch);
                    populateCurrencyList(currencyMatch, currencyListCount);
                    ++currencyListCount;
                }
            });
        //    console.log('json: ', json.rates);
        //    console.log('currencyList: ', currencyMatchList);
        });
    }

    function createUnorderedList(listType, list, listElementId, listParentId, listCount) {
        if (listCount === 0) {
            let unorderedListNode = document.createElement("ul");
            unorderedListNode.setAttribute("id", listElementId);
            document.getElementById(listParentId).appendChild(unorderedListNode);
        }
        let listNode = document.createElement("li");
        let listTextNode = document.createElement("span");
        listTextNode.className = "list-text";
        let txtNode = document.createTextNode(list);
        listTextNode.appendChild(txtNode);
        listNode.appendChild(listTextNode);
        if (listType === "history") {
            let timestamp = timestampConvertion();
            let timestampNode = document.createElement("span");
            timestampNode.className = "timestamp-text";
            
            let closeIconNode = document.createElement("span");
            closeIconNode.className = "close-icon";
            closeIconNode.onclick = onHistoryListClose;

            let timestampContainerNode = document.createElement("div");
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

    function populateCurrencyList(currencyMatchList, currencyListCount) {
        let listType = "search",
            list = currencyMatchList,
            listElementId = "search-list",
            listParentId = "search-list-box",
            listCount = currencyListCount;
        createUnorderedList(listType, list, listElementId, listParentId, listCount);
    }

    function clearCurrencyList() {
        document.getElementById("search-list").remove();
    }

    function populateSearchHistoryList(historyList, historyListCount) {
        let listType = "history",
            list = historyList,
            listElementId = "search-history-list",
            listParentId = "search-history",
            listCount = historyListCount;
        createUnorderedList(listType, list, listElementId, listParentId, listCount);
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
        let historyList = e.srcElement.firstElementChild.innerHTML,
            historyListCount = 0,
            historyListElement = document.getElementById("search-history-list");
        if (historyListElement !== null) {
            historyListCount = document.getElementById("search-history-list").childElementCount;
        }
        populateSearchHistoryList(historyList, historyListCount);
        console.log('clicked list: ', historyList);
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
