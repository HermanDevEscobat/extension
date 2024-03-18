    //red 0xFFF7020E
const speedNumb = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3]
let soundState = false
let arrListUrl = []
let arrListObj = []
let htmlContent = ''
let isDataInserted = false
let svgInserted = false
    //---------------------------------------------
const filledStarSVG = `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" id="star"><path d="M22,10.1c0.1-0.5-0.3-1.1-0.8-1.1l-5.7-0.8L12.9,3c-0.1-0.2-0.2-0.3-0.4-0.4C12,2.3,11.4,2.5,11.1,3L8.6,8.2L2.9,9
C2.6,9,2.4,9.1,2.3,9.3c-0.4,0.4-0.4,1,0,1.4l4.1,4l-1,5.7c0,0.2,0,0.4,0.1,0.6c0.3,0.5,0.9,0.7,1.4,0.4l5.1-2.7l5.1,2.7
c0.1,0.1,0.3,0.1,0.5,0.1l0,0c0.1,0,0.1,0,0.2,0c0.5-0.1,0.9-0.6,0.8-1.2l-1-5.7l4.1-4C21.9,10.5,22,10.3,22,10.1z"></path></svg>`;
const emptyStarSVG = `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" id="star"><path d="M21.9189453,10.1265259c0.0802612-0.546814-0.2979736-1.0551147-0.8447266-1.135376L15.4228516,8.164978l-2.5253906-5.1464844c-0.0909424-0.1569824-0.2214355-0.2873535-0.37854-0.3781128c-0.4960327-0.2866821-1.1306152-0.1170044-1.4173584,0.3790894L8.5771484,8.164978L2.9257812,8.9912109C2.7097168,9.0228882,2.5100098,9.1244507,2.3569946,9.2802734c-0.387146,0.3943481-0.3812256,1.0278931,0.0131226,1.4150391l4.0927734,4.0126953l-0.9658203,5.6640625c-0.0091553,0.0541992-0.013855,0.1090698-0.0139771,0.1641235c-0.0015259,0.5534058,0.4458618,1.0032959,0.9993286,1.0048218c0.163147-0.0002441,0.3237915-0.0404663,0.4677734-0.1171875L12,18.7539062l5.0488281,2.6689453c0.1951294,0.1035767,0.4190063,0.1396484,0.6367798,0.1025391c0.5441895-0.0928345,0.9100952-0.6091309,0.8173218-1.1533203l-0.9658203-5.6640625l4.09375-4.0137329C21.7861328,10.5414429,21.8872681,10.3421021,21.9189453,10.1265259z M16.6503906,14.1766968c-0.1170654,0.1148682-0.1706543,0.2796631-0.1435547,0.4414062l1.0097656,5.9208984l-5.2832031-2.7930298c-0.1463013-0.0761719-0.3204956-0.0761719-0.4667969,0L6.4833984,20.539978l1.0097046-5.921814c0.0271606-0.1617432-0.0264282-0.3265381-0.1435547-0.4414062L3.0702515,9.9814453l5.9121094-0.8642578C9.1456299,9.0927734,9.286499,8.9898682,9.359375,8.8417969L12,3.460022l2.640564,5.3817139c0.072876,0.1480713,0.2138062,0.2509766,0.3770142,0.2753906l5.9130859,0.8632812L16.6503906,14.1766968z"></path></svg>`;

function insertComments() {
    fetch(`${location.origin}/api/office/info`)
        .then(response => response.json())
        .then(data => {
            const officeID = data.office_id;
            chrome.runtime.sendMessage({ action: 'getComments', officeID }, function (response) {
                const data = response.comments;
                console.log(data)
                if (data && !data.error && data.value && data.value.length > 0) {
                    const container = document.querySelector('.content_cnt_item-1');
                    container.innerHTML = '';
                    const commentsList = document.createElement('ul');
                    commentsList.classList.add('comments-list');

                    data.value.forEach(comment => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('comment-item');

                        const starsRating = document.createElement('div');
                        starsRating.classList.add('stars-rating');

                        for (let i = 0; i < 5; i++) {
                            const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                            star.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                            star.setAttribute("enable-background", "new 0 0 24 24");
                            star.setAttribute("viewBox", "0 0 24 24");
                            star.classList.add('content_cnt_item-1_star');

                            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

                            if (i < comment.rating) {
                                star.innerHTML = filledStarSVG;
                            } else {
                                star.innerHTML = emptyStarSVG;
                            }

                            starsRating.appendChild(star);
                        }

                        const userId = document.createElement('span');
                        userId.classList.add('content_cnt_item-1_user-id_link');
                        userId.textContent = comment.userId;
                        userId.style.cursor = 'pointer'; // Добавляем стиль указателя мыши для обозначения кликабельности
                        userId.title = 'Открыть возвраты клиента'; // Добавляем подсказку ("tooltip")
                        userId.addEventListener('click', () => {
                            window.open(`${location.origin}/pvz/product-returns/choose-goods/${comment.userId}`, '_blank');
                        });

                        const idLabel = document.createElement('span');
                        idLabel.textContent = 'ID клиента: ';
                        idLabel.classList.add('content_cnt_item-1_user-id-label');

                        const text = document.createElement('p');
                        text.textContent = comment.text;

                        const dateTime = document.createElement('span');
                        dateTime.classList.add('date-time');
                        const date = new Date(comment.dateTime);
                        dateTime.textContent = date.toLocaleString();

                        listItem.appendChild(starsRating);
                        listItem.appendChild(idLabel);
                        listItem.appendChild(userId);
                        listItem.appendChild(text);
                        listItem.appendChild(dateTime);

                        commentsList.appendChild(listItem);
                    });

                    
                    container.appendChild(commentsList);
                } else {
                    console.error('Error fetching comments:', data.error);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching office info:', error);
        });
}

    //---------------------------------------------
function clickOnError() {
    const element = document.querySelector("nz-card.red.pem.ant-card.ant-card-bordered.ng-star-inserted span");
    if (element) {
        element.click();
    }
}
    //---------------------------------------------
function replaceSvgCode() {
    if (!svgInserted) {
        const svgCode = `
        <div class="main-container">
        <div class="countries-container">
        <svg class="countries" width="246" height="60" viewBox="0 0 246 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M39 0V6H42V9H36V12H33V15H24V9H21V6H12V9H9V3H6V6H0V9H3V12H12V15H15V24H18V27H21V30H24V33H27V42H30V45H33V48H36V60H39V57H42V51H45V42H48V39H45V36H36V33H27V27H30V24H36V15H42V9H45V6H48V3H51V0H39Z" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M90 3V9H84V6H75V9H72V6H63V9H72V12H69V15H63V12H57V24H60V27H57V30H54V33H60V36H63V45H66V51H69V48H72V45H75V30H72V27H81V30H87V33H90V30H93V33H96V36H99V27H102V21H105V15H108V9H126V12H135V15H138V24H141V27H144V30H147V33H150V42H153V45H156V48H159V60H162V57H165V51H168V42H171V39H168V36H159V33H150V27H153V24H159V15H165V9H168V6H171V3H174V0H162V6H165V9H159V12H156V15H147V9H144V6H135V9H132V3H129V6H117V3H90ZM60 24V21H63V18H66V21H69V18H81V24H78V21H72V24H60Z" fill="white"/>
        <path d="M108 19H111V25H105V22H108V19Z" fill="white"/>
        <path d="M96 39H99V42H96V39Z" fill="white"/>
        <path d="M111 42H108V39H105V42H108V45H111V42Z" fill="white"/>
        <path d="M111 48V51H114V57H108V54H102V51H105V48H111Z" fill="white"/>
        <path d="M102 54V57H99V54H102Z" fill="white"/>
        <path d="M75 48H78V51H75V48Z" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M186 12H180V24H183V27H180V30H177V33H183V36H186V45H189V51H192V48H195V45H198V30H195V27H204V30H210V33H213V30H216V33H219V36H222V27H225V21H228V15H231V9H246V6H240V3H213V9H207V6H198V9H195V6H186V9H195V12H192V15H186V12ZM183 24V21H186V18H189V21H192V18H204V24H201V21H195V24H183Z" fill="white"/>
        <path d="M231 19H234V25H228V22H231V19Z" fill="white"/>
        <path d="M219 39H222V42H219V39Z" fill="white"/>
        <path d="M234 42H231V39H228V42H231V45H234V42Z" fill="white"/>
        <path d="M234 48V51H237V57H231V54H225V51H228V48H234Z" fill="white"/>
        <path d="M225 54V57H222V54H225Z" fill="white"/>
        <path d="M198 48H201V51H198V48Z" fill="white"/>
        </svg>
        </div>
        <svg class="globe" width="46" height="43" viewBox="0 0 66 63" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M30 0H27H24V3H21H18H15V6H12V9H9V12H6V15H3V18V21H0V24V27V30V33V36V39V42H3V45L3 48H6L6 51H9V54H12V57H15V60H18H21H24V63H27H30H33H36H39H42V60H45H48H51V57H54V54H57V51H60V48H63V45V42H66V39V36V33V30V27V24V21H63V18V15H60V12H57V9H54V6H51V3H48H45H42V0H39H36H33H30ZM42 3V6H45H48H51V9H54V12V15H57H60V18V21H63V24V27V30V33V36V39V42H60V45V48H57H54V51H51V54V57H48H45H42V60H39H36H33H30H27H24V57H21H18H15V54V51H12V48H9H6V45V42H3L3 39V36V33V30V27V24V21H6V18H9V15V12H12V9H15V6H18H21H24V3H27H30H33H36H39H42Z" fill="white"/>
        </svg>
        </div>`;
        const anticonElement = document.querySelector('i.anticon.anticon-wb-shk-logo');
        if(anticonElement){
            svgInserted = true;
            anticonElement.innerHTML = svgCode;
            const style = document.createElement('style');
            style.innerHTML = `
            .main-container {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                    height: 43px; /* Устанавливаем высоту 40px */
                    width: 46px; /* Устанавливаем ширину 40px */
                animation: flicker 3s infinite;
            }

            .main-container .countries-container {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                position: absolute;
                height: 96%;
                width: 96%;
                border-radius: 100px;
                overflow: hidden;
                z-index: 2;
            }

            .main-container .countries-container .countries {
                position: absolute;
                animation: axis-spin 8s steps(24) infinite;
            }

            .main-container .globe {
                position: absolute;
                filter: drop-shadow(-2px -2px 8px #FF409C) drop-shadow(2px 2px 3px #3B2BFF);
            }

            @keyframes flicker {
                0% {
                    opacity: 1;
                }
                18% {
                    opacity: 1;
                }
                19% {
                    opacity: 0;
                }
                20% {
                    opacity: 1;
                }
                96% {
                    opacity: 1;
                }
                97% {
                    opacity: 0;
                }
                98% {
                    opacity: 1;
                }
            }

            @keyframes axis-spin {
                from {
                    transform: translatex(0px);
                }
                to {
                    transform: translatex(-123px);
                }
            }
            `;

            document.head.appendChild(style);
        }
    }
}
    //---------------------------------------------
function listInfoBoxesUpdater() {
    if (location.href.includes('/pvz/acceptance') && document.querySelector('app-acceptance-box')) {
        const existingBoxes = document.querySelectorAll('div.box.ng-star-inserted');
        if (existingBoxes.length === 0) {
            return;
        }
        const boxesAlreadyUpdated = document.querySelectorAll('.showCountShk').length > 0;
        if (boxesAlreadyUpdated) {
            return;
        }
        fetch(`${location.origin}/api/boxes/accepted`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                return;
            }
            const acceptanceBoxSection = document.querySelector('.acceptance-box__list');
            const acceptedBoxesInfo = [];
            data.forEach(item => {
                acceptedBoxesInfo.push({
                    boxName: item.boxName,
                    isAccepted: item.isAccepted,
                    shkCount: 0
                });
            });
            fetch(`${location.origin}/api/items/inTransferBoxes`)
            .then(response => response.json())
            .then(itemsData => {
                itemsData.forEach(item => {
                    const foundBox = acceptedBoxesInfo.find(box => String(box.boxName) === String(item.boxId));
                    if (foundBox) {
                        foundBox.shkCount = item.shkCount;
                    }
                });
                const boxes = document.querySelectorAll('div.box.ng-star-inserted');
                boxes.forEach((box, index) => {
                    const boxInfo = acceptedBoxesInfo[index];
                                if (boxInfo && boxInfo.isAccepted) { // Проверяем, ящик принят или нет
                                    const boxNumberDiv = box.querySelector('.box__number');
                                    const boxDateDiv = box.querySelector('.box__date.ng-star-inserted');
                                    const showCountShkDiv = document.createElement('div');
                                    showCountShkDiv.classList.add('showCountShk');
                                    showCountShkDiv.innerText = boxInfo.shkCount;
                                    boxNumberDiv.parentNode.insertBefore(showCountShkDiv, boxDateDiv);
                                    const viewLink = document.createElement('a');
                                    viewLink.href = `${location.origin}/pvz/location-items/${boxInfo.boxName}/1`;
                                    viewLink.innerText = 'Просмотреть';
                                    viewLink.target = '_blank';
                                    const linkButton = document.createElement('button');
                                    linkButton.classList.add('ant-btn', 'ant-btn-primary', 'ant-btn-background-ghost', 'ng-star-inserted');
                                    linkButton.appendChild(viewLink);
                                    linkButton.style.cssText = `
                                    height: 36px;
                                    border-radius: 4px;
                                    margin-left: auto;`
                                    const boxFioDiv = box.querySelector('.box__fio.ng-star-inserted');
                                    boxFioDiv.parentNode.insertBefore(linkButton, boxFioDiv.nextSibling);
                                }
                            });
            })
            .catch(error => console.error('Ошибка получения информации о ШК в ящиках:', error));
        })
        .catch(error => console.error('Ошибка получения информации о принятых ящиках:', error));
    }
}


    //---------------------------------------------
function listInfoClientUpdater() {
    if (location.href.includes('/pvz/clients-in-office')) {
        if (!isDataInserted) {
            getUsersInOfficeAndProcessData().then(data => {
                if (data.length !== 0) {
                    const rows = document.querySelectorAll('tbody.ant-table-tbody tr');
                    rows.forEach((row, index) => {
                        const thirdTd = row.querySelector('td:nth-child(3)');
                        isDataInserted = true;
                        if (thirdTd && !thirdTd.querySelector('div')) {
                            const gridContainer = document.createElement('div');
                            gridContainer.style.display = 'flex';
                            gridContainer.style.flexDirection = 'column';
                            gridContainer.style.gap = '8px';
                            const text = document.createElement('span');
                            text.style.textAlign = 'left';
                            text.textContent = `${data[index].locationName} | Количество товаров: ${data[index].itemCount}`;
                            const progress = document.createElement('progress');
                            progress.max = 100;
                            progress.value = data[index].percentPrepaid;
                            progress.id = 'progress-bar-nova'
                            gridContainer.appendChild(text);
                            gridContainer.appendChild(progress);
                            thirdTd.appendChild(gridContainer);
                        }
                    });
                } else {
                    console.log('Результат функции getUsersInOfficeAndProcessData() равен 0.');
                }
            }).catch(error => {
                console.error('Ошибка:', error);
            });
        }
    } else {
        isDataInserted = false;
    }
}
    //---------------------------------------------
async function getUsersInOfficeAndProcessData() {
    try {
        const responseUsers = await fetch(`${location.origin}/api/users/in-office/get`);
        const userData = await responseUsers.json();
        if (!Array.isArray(userData)) {
            throw new Error('Неверный формат ответа от getUsersInOffice');
        }
        const userIds = userData.map(user => user.userId);
        const locationDataMap = {};
        for (const userId of userIds) {
            const responseSale = await fetch(`${location.origin}/api/sale/v2/get?userId=${userId}`);
            const saleData = await responseSale.json();
            saleData.forEach(entry => {
                entry.shksOnPlace.forEach(place => {
                    const locationName = place.locationName;
                    const itemCount = place.items.length;
                    if (!locationDataMap[locationName]) {
                        locationDataMap[locationName] = { itemCount: 0, prepaidCount: 0, totalCount: 0 };
                    }
                    locationDataMap[locationName].itemCount += itemCount;
                    locationDataMap[locationName].totalCount += itemCount;
                    locationDataMap[locationName].prepaidCount += place.items.filter(item => item.isPrepayed).length;
                });
            });
        }
        const results = [];
        for (const locationName in locationDataMap) {
            const { itemCount, prepaidCount, totalCount } = locationDataMap[locationName];
            const percentPrepaid = (prepaidCount / totalCount) * 100;
            results.push({ locationName, itemCount, percentPrepaid });
        }
        return results;
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
}


    //---------------------------------------------
function cleanArray(arr) {
    const uniqueLocationIds = new Set();
    const result = [];

    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        if (!uniqueLocationIds.has(obj.locationId)) {
            uniqueLocationIds.add(obj.locationId);
            result.push(obj);
        }
    }

    if (uniqueLocationIds.size > 10) {
        const firstLocationId = arr[0].locationId;
        return result.filter(obj => obj.locationId !== firstLocationId);
    }

    return result;
}
    //---------------------------------------------
function clickSearchAndReturnClient(selector) {
    const table = document.querySelector(selector);
    const isClientSearch = 'По данному запросу мы ничего не нашли\nПопробуйте другие варианты'
    const isCleintReturn = 'Нет данных'

    if (table) {
        const rows = table.querySelectorAll('tr');
        if((location.pathname === '/pvz/clients' && JSON.parse(localStorage.settingsLocalNova).set_2) || (location.pathname === '/pvz/product-returns/client-search' && JSON.parse(localStorage.settingsLocalNova).set_3)){
            if(rows.length === 2){
                if(rows[1].outerText != isClientSearch ||  rows[1].outerText != isCleintReturn){
                    rows[1].click()
                }
            }
        }
    }
}
    //---------------------------------------------
async function getContent() {
    await fetch(chrome.runtime.getURL('/nova-index.html')).then(r => r.text()).then(html => {
        htmlContent = html
    })
}
getContent()
    //---------------------------------------------
function localStorageStatus() {
    if (!localStorage.settingsLocalNova) {
        localStorage.setItem('settingsLocalNova', JSON.stringify({
            'set_1': 1,
            'set_2': false,
            'set_3': false,
            'set_4': false,
            'set_5': false,
            'set_6': false,
            'set_7': false,
            'set_8': false,
            'set_9': false,
            'set_10': false
        }))
    }
}
    //---------------------------------------------
async function decodeShk(shk) {
    return (await fetch(`${location.origin}/api/shk/decode?shk=${encodeURIComponent(shk)}`).then(resp => resp.json()).then(data => {
        return data.shk
    }))
}
    //---------------------------------------------
async function searchShk(shk) {
    return (await fetch(`${location.origin}/api/items/search?input=${encodeURIComponent(shk)}`).then(resp => resp.json()).then(data => {
        return data
    }))
}
    //---------------------------------------------
async function getRemainsShk() {
    const remainsShk = document.querySelector('.output_cnt_item-6');
    if (remainsShk) {
        await fetch(`${location.origin}/api/report/shk`)
        .then(resp => resp.json())
        .then(data => {
            setTimeout(() => {
                remainsShk.innerHTML = data.onTransferCount;
            }, 5000);
        });
    }
}
    //---------------------------------------------
function getSettingsLocalNova() {
    return JSON.parse(localStorage.settingsLocalNova)
}
    //---------------------------------------------
function upSettingsLocalNova(a) {
    localStorage.settingsLocalNova = JSON.stringify(a)
}
    //---------------------------------------------
function groupShk(arr) {
    return arr.reduce((acc, obj) => {
        const key = obj["locationId"]
        const curGroup = acc[key] ?? []
        return {
            ...acc,
            [key]: [...curGroup, obj]
        }
    }, {})
}
    //---------------------------------------------
function getShkFromArrObject(a) {
    return a.reduce((acc, curr) => {
        return [...acc, curr.shkId]
    }, [])
}
    //---------------------------------------------
function viewShkElements(a) {
    const viewModul = document.querySelector('.output_shk-item-10')
    let objSortedShk = groupShk(a)
    let arrKeys = Object.keys(objSortedShk)
    let itemsView = ''
    arrKeys.forEach(elem => {
        itemsView += `<div class="itemShk_${elem}"> <div class="cell">Яч:</div> <div class="locationId">${elem}</div> <div class="count">Кол-во:</div> <div class="countShk">${objSortedShk[elem].length}</div> </div>`
    })
    viewModul.innerHTML = ''
    viewModul.innerHTML = itemsView
}
    //---------------------------------------------
function clearShkElements() {
    const buttClear = document.querySelector('.button_cnt_item-10')
    const viewModul = document.querySelector('.output_shk-item-10')
    viewModul.innerHTML = ''
    itemsView = ''
    arrListObj = []
    buttClear.style.display = 'none'
}
    //---------------------------------------------
function soundPlayer(a) {
    if (!a.length || soundState) return
        audio = new Audio(a.shift())
    audio.onplay = function () {
        soundState = true
    };
    audio.onended = function () {
        soundState = false
        soundPlayer(a)
    };
    audio.playbackRate = getSettingsLocalNova().set_1
    audio.play()
}
    //---------------------------------------------
setInterval(() => {
    const main = document.querySelector('main')
    const body = document.querySelector('body')
    const head = document.querySelector('head')
    localStorageStatus()
    //---------------------------------------------
    clickOnError()
    //---------------------------------------------
    replaceSvgCode()
    //---------------------------------------------
    listInfoClientUpdater()
    //---------------------------------------------
    listInfoBoxesUpdater()
    //---------------------------------------------
    clickSearchAndReturnClient('nz-table')
    //--------------------------------------------- 
    if (main) {
        if (main.style.marginRight != '50px') {
            main.style.marginRight = '50px'
        }
    }
    if (main && !document.querySelector('.startMenu')) {
        let settingsNova = getSettingsLocalNova()
        const startMenu = document.createElement('div')
        const googleIcon = document.createElement('link')
        startMenu.setAttribute('class', 'startMenu')
        googleIcon.setAttribute('rel', 'stylesheet')
        googleIcon.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined')
        body.appendChild(startMenu)
        head.appendChild(googleIcon)
        startMenu.innerHTML = htmlContent
        const menuList = document.querySelectorAll('[class^=novaMenu-]')
        const contentReviews = document.querySelector('.content_cnt_item-1')
        const speedUp = document.querySelector('.button_up_cnt_item-14')
        const speedDown = document.querySelector('.button_down_cnt_item-14')
        const currSpeed = document.querySelector('.output_cnt_item-14')
        const inputDataWave = document.querySelector('.input_item-6')
        const inputDataScan = document.querySelector('.input_item-10')
        const autoOpenClient = document.querySelector('.input_cnt_item-20')
        const autoOpenReturn = document.querySelector('.input_cnt_item-21')

        const buttClear = document.querySelector('.button_cnt_item-10')
    //---------------------------------------------
        autoOpenClient.addEventListener('change', function () {
            this.checked ? (settingsNova.set_2 = true, upSettingsLocalNova(settingsNova)) : (settingsNova.set_2 = false, upSettingsLocalNova(settingsNova))
        })
    //---------------------------------------------
        autoOpenReturn.addEventListener('change', function () {
            this.checked ? (settingsNova.set_3 = true, upSettingsLocalNova(settingsNova)) : (settingsNova.set_3 = false, upSettingsLocalNova(settingsNova))
        })
    //---------------------------------------------
        buttClear.addEventListener('click', () => {
            clearShkElements()
            inputDataScan.focus()
        })
    //---------------------------------------------
        speedUp.addEventListener('click', () => {
            if (speedNumb.findIndex(i => i == settingsNova.set_1) < 20) {
                settingsNova.set_1 = speedNumb[((speedNumb.findIndex(i => i == settingsNova.set_1)) + 1)]
                upSettingsLocalNova(settingsNova)
                return currSpeed.innerHTML = settingsNova.set_1
            } else {
                return
            }
        })
    //---------------------------------------------
        speedDown.addEventListener('click', () => {
            if (speedNumb.findIndex(i => i == settingsNova.set_1) > 0) {
                settingsNova.set_1 = speedNumb[((speedNumb.findIndex(i => i == settingsNova.set_1)) - 1)]
                upSettingsLocalNova(settingsNova)
                return currSpeed.innerHTML = settingsNova.set_1
            } else {
                return
            }
        })
    //---------------------------------------------
        menuList.forEach((menu) => {
            menu.addEventListener("click", function () {
                const openMenu = document.querySelector('.startMenu').querySelector('.open')
                switch (this.classList.value) {
                case 'novaMenu-1':
                    insertComments()
                case 'novaMenu-2':
                    setTimeout(() => {
                        const inputItem = document.querySelector('.input_item-6')
                        const inputWavebraker = document.querySelector('input.ant-input.ant-input-lg.ng-pristine.ng-valid.ng-star-inserted.ng-touched')
                        if(inputItem && inputWavebraker){
                            inputItem.focus()
                            inputWavebraker.addEventListener('focus', () => {
                                inputItem.focus()   
                            })}
                        }, 300)
                    break
                case 'novaMenu-3':
                    setTimeout(() => {
                        const inputItem = document.querySelector('.input_item-10')
                        if(inputItem){inputItem.focus()}
                    }, 300)
                    break
                case 'novaMenu-5':
                    setTimeout(() => {
                        currSpeed.innerHTML = settingsNova.set_1
                        autoOpenClient.checked = settingsNova.set_2
                        autoOpenReturn.checked = settingsNova.set_3
                    }, 300)
                    break
                default:
                    break
                }
                this.classList.toggle('open')
                if (openMenu) {
                    openMenu.classList.toggle('open', false);
                }
            })
        })
    //---------------------------------------------
        inputDataWave.addEventListener('keypress', async function (a) {
            if (a.key === 'Enter') {
                let v = inputDataWave.value.replace(/\s/g, '')
                    getRemainsShk()// Обновляем количество сколько еще принять осталось
                    if (location.href.includes('acceptance')) {
                        const inpWave = document.querySelector('.wavebreaker__scan').querySelector('input')
                        const buttWave = document.querySelector('.wavebreaker__scan').querySelector('button')
                        if ((v.length == 8 && v[0] == '*') || (v.length == 9 && v[0] == '*') || (v.length == 12 && v.slice(0, 4) == 'SAFP') || (v.length == 9 && v[0] == '!')) {
                            let s = await searchShk(v)
                            if (s.length) {
                                if (s[0].locationTypeId == 6 || s[0].locationTypeId == 3 || s[0].locationTypeId == 1) {
                                    inpWave.value = v
                                    inpWave.dispatchEvent(new Event('input', {
                                        bubbles: true
                                    }))
                                    buttWave.click()
                                } else {
                                    arrListUrl.push('speech/error')
                                    soundPlayer(arrListUrl)
                                    console.log('Error: В пакете нет --> locationTypeId')
                                }
                            } else {
                                arrListUrl.push('speech/error')
                                soundPlayer(arrListUrl)
                                console.log('Error: Данного ШК нет на пвз. Массив пуст(')
                            }
                        } else if (v.includes('OPLC') || v.includes('WVBR')) {
                            inpWave.value = v
                            inpWave.dispatchEvent(new Event('input', {
                                bubbles: true
                            }))
                            buttWave.click()
                        } else {
                            arrListUrl.push('speech/error')
                            soundPlayer(arrListUrl)
                            console.log('Error: ШК не проходит по условию или это баркод')
                        }
                    } else {
                        return alert('Error: Перейдите в окно волнореза!')
                    }
                    inputDataWave.value = ''
                }
            })
    //---------------------------------------------
        inputDataScan.addEventListener('keypress', function (b) {
            if (b.key === 'Enter') {
                async function scanerShk() {
                    let v = inputDataScan.value.replace(/\s/g, '')
                    if ((v.length == 8 && v[0] == '*') || (v.length == 9 && v[0] == '*') || (v.length == 12 && v.slice(0, 4) == 'SAFP') || (v.length == 9 && v[0] == '!')) {
                        let data = await searchShk(v)
                        if (data.length) {
                            if (getShkFromArrObject(arrListObj).includes(data[0].shkId)) {
                                console.log('Shk is pick')
                            } else {
                                arrListObj.push(data[0]) 
                                    arrListObj = cleanArray(arrListObj) //check tut
                                    viewShkElements(arrListObj)
                                    buttClear.style.display = 'block'
                                }
                                let locId = data[0].locationId
                                if (locId) {
                                    if (locId >= 1 && locId <= 2500) {
                                        if (locId >= 1 && locId <= 1000) {
                                            arrListUrl.push(`/speech/${locId}`)
                                            soundPlayer(arrListUrl)
                                        } else if (locId >= 1001 && locId <= 1999) {
                                            arrListUrl.push(`/speech/1000`)
                                            arrListUrl.push(`/speech/${locId%1000}`)
                                            soundPlayer(arrListUrl)
                                        } else if (locId == 2000) {
                                            arrListUrl.push(`/speech/${locId}`)
                                            soundPlayer(arrListUrl)
                                        } else if (locId >= 2001 && locId <= 2500) {
                                            arrListUrl.push(`/speech/2000`)
                                            arrListUrl.push(`/speech/${locId%2000}`)
                                            soundPlayer(arrListUrl)
                                        }
                                    } else {
                                        arrListUrl.push('speech/error')
                                        soundPlayer(arrListUrl)
                                    }
                                } else {
                                    arrListUrl.push('speech/error')
                                    soundPlayer(arrListUrl)
                                }
                            } else {
                                arrListUrl.push('speech/error')
                                soundPlayer(arrListUrl)
                            }
                        } else {
                            arrListUrl.push('speech/error')
                            soundPlayer(arrListUrl)
                        }
                    }
                    scanerShk()
                    inputDataScan.value = ''
                }
            })
    }
}, 500)
    const targetStartMenu = document.querySelector('.startMenu')
    let status = true
    setInterval(()=>{
        if((location.href).includes('/pvz/clients/20520074') && status){
            new Audio(chrome.runtime.getURL("alarm.mp3")).play()
            setTimeout(()=>{           
                let message = confirm('Данный человек забрал товар на сумму 2238 рублей ШК 11408276858(Наушники). Просьба перевести деньги за товар Герману(по телефону Тинькофф)! Что бы уведомление не появлялось нажмите "OK"')
                if(message){status = false}}, 1500)

        }
    }, 3000)
