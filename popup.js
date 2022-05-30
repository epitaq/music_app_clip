
let msg = {}
function message () {
    chrome.tabs.query({ active: true, currentWindow: true}, aim_message)
    function aim_message(tabs){
        chrome.tabs.sendMessage(tabs[0].id , 'popup', function (response){
            console.log(response)
            videoId = response.id
            updateData()
        })
    }
}

function updateData(){
    // メインのデータ chrome内のデータを参照
    chrome.storage.local.get(function(items) {
        musicData = items.musicData
        if (musicData.length != 0){
            if (musicData[0]['movie'] == videoId){
                createTable()
            } else {
                musicData = []
            }
        } else {
            musicData = []
        }
    })
}


// メインのデータ chrome内のデータを参照
let musicData = []
message() // データを更新

// htmlから動画IDと歌った人を取得
// contentに飛ばす
let videoId = ''
let singer = ''

// 入力欄のnameを自動入力
document.getElementById('singer').addEventListener('change', singerChange)
function singerChange(){
    singer = document.getElementById('singer').value
    document.getElementById('inputName').value = singer
}

// 時間用の0を追加
function addZero (num) {
    if (num < 10){
        return '0'+num
    } else {
        return num+''
    }
}


// 並び替える必要がある

// musicDataを元にhtmlを作成
function createTable(){
    const movieTable = document.querySelector("#movieData > tbody")
    movieTable.innerHTML = '<tr><th>name</th><th>title</th><th>start</th><th>end</th></tr>'
    let count = 0 // id用の通し番号
    musicData.forEach((music) => {
        const tr = document.createElement('tr')
        movieTable.appendChild(tr)
        // 中の内容
        const obArray = Object.entries(music)
        obArray.forEach((arr) =>{
            const td = document.createElement('td')
            // startとendの時秒数をmm：ssに変更
            if (arr[0] == 'name' || arr[0] == 'title'){
                td.textContent = arr[1] // arrのキーを抜いた部分
            } else if (arr[0] == 'start' || arr[0] == 'end'){
                let videoMin = addZero(Math.floor(arr[1] /60)) // 分の作成
                let videoSec = addZero(Math.floor(arr[1]  - videoMin*60)) // 秒の作成
                td.textContent = videoMin + ':' + videoSec
            } else {
                return // それ以外の時リストに追加しない musicDataの順番が違う場合うまく表示されない可能性がある
            }
            let id = count + arr[0] // 要素のid
            td.id = id
            td.addEventListener('dblclick', {id:id, count:count, type:arr[0], handleEvent:changeInput}, {once: true})
            tr.appendChild(td)
        })
        count++
    })
}

// クリックされたら入力欄に変更
function changeInput(){
    let input = document.createElement('input')
    let original = document.getElementById(this.id)
    let originalValue = original.innerHTML // 元の値を
    original.innerHTML = '' // 元の中身を初期化
    input.value = originalValue //inputに元の値を入れる
    input.style.width = '100%'
    // フォーカスが外れたら元に戻す
    input.addEventListener('blur', () => {
        musicData[this.count][this.type] = input.value
        // テーブルを再描画
        createTable()
    })
    original.appendChild(input)
    input.focus()
}

// 記入欄の取得 ボタン
function getData () {
    message() // idの取得
    // データの取得
    let movieData = videoId
    let nameData = document.getElementById('inputName').value
    let titleData = document.getElementById('inputTitle').value
    let startData = document.getElementById('inputStart').value
    let endData = document.getElementById('inputEnd').value
    // 中身がある時
    if (movieData!='' && nameData!='' && titleData!='' && startData!='' && endData!=''){
        // データの登録
        musicData.push({
            movie : movieData,
            name : nameData,
            title : titleData,
            start : startData,
            end : endData,
        })
        // 記入欄の初期化
        // document.getElementById('inputMovie').value = videoId
        document.getElementById('inputName').value = singer
        document.getElementById('inputTitle').value = ''
        document.getElementById('inputStart').value = ''
        document.getElementById('inputEnd').value = ''
        createTable()
    } else {
        console.log('データが入力されていません')
    }
    // データをchrome内に保存
    chrome.storage.local.set({musicData}, function (){
        console.log('stored')
    })
}

// データのエクスポート
function dataExport() {
    // JSON.stringifyで文字列に変換
    const blob = new Blob([JSON.stringify(musicData, null, '  ')], {
        type: 'application/json',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = videoId + '.json' // 出力するファイルの名前
    link.click()
    link.remove()
}

// ボタンにｊｓを紐付け
document.querySelector("body > div > div:nth-child(1)").addEventListener('click', getData)
document.querySelector("body > div > div:nth-child(2)").addEventListener('click', dataExport)
