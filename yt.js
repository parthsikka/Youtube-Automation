let puppeteer = require("puppeteer") ;
let url = process.argv[2] ;
let timeList ;
let ans ;
let flag = 0 ;
(async function(){
    let browser = await puppeteer.launch({
        headless : false, 
        defaultViewport: null, 
        args : ["--start-maximised"],
    })
    let pages = await browser.pages() ;
    let opage = pages[0] ;
    await opage.goto(url) ;
    let reqTime = await opage.evaluate(async function(){
        let totalVids = document.querySelector("#stats .style-scope.yt-formatted-string").innerText ;
        let scrolls = Math.ceil(Number(totalVids)/100) ;
        let allIndex ;
        let tt = 0 ;
        function hmsToSecondsOnly(str) {
            var p = str.split(':'),
                s = 0, m = 1;
            while (p.length > 0) {
                s += m * parseInt(p.pop(), 10);
                m *= 60;
            }  
            return s;
        }
        function secondsToHms(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
            return hDisplay + mDisplay + sDisplay; 
        }
        let currScroll = 0 ;
        let finaltime = await new Promise(function(resolve, reject){
        let interval = setInterval(() => {
            allIndex =  document.querySelectorAll("#index") ;
            allIndex[allIndex.length-1].scrollIntoView() ;
            currScroll++ ;
            if(currScroll == scrolls){
                clearInterval(interval) ;
                timeList = document.querySelectorAll("span.style-scope.ytd-thumbnail-overlay-time-status-renderer") ;
                for(let a=0 ; a<timeList.length ; a++){
                    tt += parseInt(hmsToSecondsOnly(timeList[a].innerText)) ;
               }
               ans = secondsToHms(tt);
                resolve(ans) ;
            }
        },5000)
        });
        return finaltime ;
    })
console.log(reqTime);
browser.close() ;
})()

