// ==UserScript==
// @name         Pathfinder Equipment Scraper
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @author       Evelyn House (ehouse@fastmail.com)
// @match        https://2e.aonprd.com/Equipment.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aonprd.com
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';

    function exportData(JsonExport) {
        const filename = 'equipment.json';
        const jsonStr = JSON.stringify(JsonExport);

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function processRow(row, settings = {}) {
        const rowData = Array.from(row.children)
        const item = {
            name: rowData[0].textContent,
            link: rowData[0].firstChild.href,
            rarity: rowData[3].textContent,
            category: rowData[5].textContent,
            subcategory: rowData[6].textContent,
            level: rowData[7].textContent,
            price: rowData[8].textContent,
            bulk: rowData[9].textContent
        }

        if (settings.debug) {
            console.log(rowData, item)
        }
        return item
    }

    function dataArchive(mode = { save: false }) {
        // Grab nested table node reference
        const tableRef = document.querySelector('nethys-search').shadowRoot.querySelector('table')

        // Build collection of all table rows
        const tableNodes = tableRef.querySelectorAll('tr')
        const tableData = Array.from(tableNodes)

        // Drop the first row of header information
        tableData.shift()

        if (mode.save) {
            // Process data and trigger data export
            exportData(tableData.map(processRow))
        } else {
            // Run through data in debug mode
            tableData.slice(0, 2).map((row) => {
                processRow(row, { debug: true })
            })
        }


    }

    unsafeWindow.dataArchive = dataArchive

})();
