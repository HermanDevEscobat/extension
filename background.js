chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getComments') {
        const commentsUrl = `https://www.wildberries.ru/webapi/spa/poo/${message.officeID}/comments`;

        fetch(commentsUrl)
            .then(response => response.json())
            .then(comments => {
                sendResponse({ success: true, comments });
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
                sendResponse({ success: false, error: 'Error fetching comments' });
            });

        return true;
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2, 3],
        addRules: [
            {
                id: 1,
                priority: 1,
                condition: {
                    regexFilter: "^http://.*:1100/speech/maxim/(.*)",
                },
                action: {
                    type: "redirect",
                    redirect: {
                        regexSubstitution: `chrome-extension://${chrome.runtime.id}/speech/\\1`,
                    },
                },
            },
            {
                id: 2,
                priority: 1,
                condition: {
                    regexFilter: "^http://.*:1100/api/boxes/accept\\?boxShk=.*:.*:.*:2855"
                },
                action: {
                    type: "allow"
                },
            },
            {
                id: 3,
                priority: 1,
                condition: {
                    regexFilter: "^http://.*:1100/api/boxes/accept\\?boxShk=.*:.*:.*:.*"
                },
                action: {
                    type: "redirect",
                    redirect: {
                        regexSubstitution: `chrome-extension://${chrome.runtime.id}/package/errorBox.json`,
                    },
                },
            }
        ],
    });
});
// Образец повтора:                     http://10.54.81.254:1100/api/wavebreaker/put?shk=*BCEpRgED&currentCell=undefined&forcePut=false&lastBarcode=undefined
// Приемка неизвестного товара:         http://10.54.81.254:1100/api/wavebreaker/put?shk=*%D0%98%D0%A3%D0%90%D0%A9%D0%AB99%D0%A3&currentCell=null&forcePut=false&lastBarcode=undefined
// Повторный прием неизвестного товара: http://10.54.81.254:1100/api/wavebreaker/put?shk=*%D0%98%D0%A3%D0%90%D0%A9%D0%AB99%D0%A3&currentCell=464&forcePut=false&lastBarcode=undefined
// Принят новый ШК через ручной ввод:   http://10.54.81.254:1100/api/wavebreaker/put?shk=19072263149&currentCell=undefined&forcePut=false&lastBarcode=undefined
// Ошибка:                              http://10.54.81.254:1100/api/wavebreaker/put?shk=%E2%84%96%D1%86%D1%8801%D0%B6776507%D0%B62038557795641%D0%B6660426%D0%B0%D0%B8%D1%84%D1%848%D1%843&currentCell=null&forcePut=false&lastBarcode=undefined
// Ответ ошибки: {
//     "cellId": 0,
//     "userId": null,
//     "result": 1,
//     "msg": "Не удалось распознать ШК",
//     "acceptedCount": 0,
//     "expectedCount": 0,
//     "placeName": null,
//     "userName": null,
//     "clientName": null,
//     "clientInOffice": false,
//     "needExcise": false,
//     "shkId": 0,
//     "prevLocation": null
// }
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "addRedirectRule") {
//       addRedirectRule();
//     } else if (message.action === "removeRedirectRule") {
//       removeRedirectRule();
//     }
//   });