// 監聽點擊按鈕
convertButton.addEventListener('click', async () => {
    downloadLinksContainer.innerHTML = '';
    console.log(imgFiles)
    const kmlHeader=`<?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>`
    const kmlpointList=kmlInfo.reduce((preV,currV)=>{
        const {GPSLatitude,GPSLongitude,imgUrl,imgName,DateTime}=currV
        const kmlContent_body=`
        <Placemark>
            <name>Photo Location</name>
            <Point>
                <coordinates>${GPSLongitude},${GPSLatitude},0</coordinates>
            </Point>
            <description>
                <![CDATA[
                <h3>檔案名稱:${imgName}</h3>
                <h3>拍攝日期:${DateTime}</h3>
                <img src="${imgUrl}" alt="Uploaded Photo" width="300">
                ]]>
            </description>
        </Placemark>`
        // console.log(preV+kmlContent_body)
        return preV+kmlContent_body
    },kmlHeader)
    const kmlResult=kmlpointList+'</Document></kml>'
    //創造下載檔案
    const blob = new Blob([kmlResult], { type: 'application/vnd.google-earth.kml+xml' });
    const zip = new JSZip();
    zip.file('doc.kml', blob);
    for(let img of imgFiles){
        const fileContent = await readFile(img);
        zip.file(`img/${img.name}`,fileContent)
    }
    const zipContent = await zip.generateAsync({ type: 'blob' });
    //下載連結和屬性
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(zipContent);
    downloadLink.download = `photolocation_${kmlInfo.length}.kmz`;
    downloadLink.textContent = `Download KML 總計:${kmlInfo.length}張`;
    
    //加入下載連結到容器
    downloadLinksContainer.appendChild(downloadLink);
    downloadLinksContainer.style.display = 'block';
    })
    async function readFile(file) {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsArrayBuffer(file);
        });
    }