// ==UserScript==
// @name         Pathfinder Spell Scraper
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @author       Evelyn House (ehouse@fastmail.com)
// @match        https://2e.aonprd.com/Spells.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aonprd.com
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';

    function exportData(JsonExport) {
        const filename = 'spells.json';
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
            source: {name: rowData[2].querySelector('a').textContent, href: rowData[2].querySelector('a').href},
            tradition: Array.from(rowData[3].querySelectorAll('a')).map((anchor) => ({
                name: anchor.textContent, href: anchor.href
            })),
            rarity: rowData[4].textContent,
            trait: Array.from(rowData[5].querySelectorAll('a')).map((anchor) => ({
                name: anchor.textContent, href: anchor.href
            })),
            type: rowData[6].textContent,
            school: rowData[7].textContent,
            level: rowData[8].textContent,
            heighten: rowData[9].textContent,
            summary: rowData[10].textContent,
            action: rowData[11].textContent.trim(),
            component: rowData[12].textContent,
            trigger: rowData[13].textContent,
            target: rowData[14].textContent,
            range: rowData[15].textContent,
            area: rowData[16].textContent,
            duration: rowData[17].textContent,
            saving_throw: rowData[18].textContent,
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
