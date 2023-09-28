// 監聽文件選擇
inputElement.addEventListener('change', (event) => {
    downloadLinksContainer.innerHTML = '';
    displayElement.textContent = '';
    imgFiles=event.target.files
    console.log(imgFiles)
    const files = event.target.files;
    console.log('圖片數量:',files.length)
    if (files) {
        for(let index=0;index<files.length;index++){
            // 读取文件的 EXIF 数据
            const file=files[index]
            EXIF.getData(file, function() {
                // console.log('Exif的this指向:',this)
                const allMetaData = EXIF.getAllTags(this);
                // console.log(allMetaData);
                // 根据需要提取特定的 EXIF 数据，比如拍摄时间等
                const divParameter=[1,60,3600]
                let {GPSLatitude,GPSLongitude,PixelXDimension,PixelYDimension,DateTime} = allMetaData;
                if(GPSLatitude&&GPSLongitude){
                    log+=`${file.name}:坐標確認成功!\n`
                    displayElement.textContent =log;
                }else{
                    log+=`${file.name}:坐標讀取失敗!\n`;
                    displayElement.textContent =log;
                    return
                }
                GPSLatitude=GPSLatitude.reduce((accumulator, currentValue,currentIndex)=>{
                    return accumulator+currentValue.valueOf()/divParameter[currentIndex]},0)
                GPSLongitude=GPSLongitude.reduce((accumulator, currentValue,currentIndex)=>{
                    return accumulator+currentValue.valueOf()/divParameter[currentIndex]},0)
                let point =new L.Marker([GPSLatitude,GPSLongitude]).addTo(map)
                // console.log('Create point',point)
                map.setView([GPSLatitude,GPSLongitude])
                const imgUrl=window.URL.createObjectURL(file)
                point.bindPopup(`
                <div>
                <h1>照片拍攝資訊</h1>
                <h3>拍攝地點:${GPSLatitude.toFixed(2)},${GPSLongitude.toFixed(2)}</h2>
                <h3>拍攝時間:${DateTime}
                <img src=${imgUrl} height="${PixelYDimension/8}"/>
                </div>`)
                kmlInfo.push({GPSLatitude:GPSLatitude.toFixed(3),
                    GPSLongitude:GPSLongitude.toFixed(3),
                    imgUrl:'./img/'+file.name,
                imgName:file.name,
                DateTime:DateTime})
                console.log(kmlInfo)
            })}
    }});