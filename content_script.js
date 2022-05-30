chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(request)
    let url = new URL (window.location.href)
    sendResponse({id: url.searchParams.get('v'), time: getTime()})
})

function getTime (){
    let sec = 0
    let time = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-current").innerHTML
    timeList = time.split(':').reverse()
    for (i = 0; i<timeList.length;i++){
        console.log(timeList[i])
        sec += timeList[i] * 60 ** i
    }
    return sec
}