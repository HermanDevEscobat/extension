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

        return true; // Позволяет sendResponse вызываться асинхронно
    }
});
