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
        removeRuleIds: [1, 2],
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
                priority: 2,
                condition: {
                    regexFilter: "^http://.*:1100/api/boxes/accept\\?boxShk=.*;.*:.*:(?!2855$)"
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

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "addRedirectRule") {
//       addRedirectRule();
//     } else if (message.action === "removeRedirectRule") {
//       removeRedirectRule();
//     }
//   });