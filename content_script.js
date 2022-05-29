chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(request)
    let url = new URL (window.location.href)
    sendResponse({id: url.searchParams.get('v')})
})

