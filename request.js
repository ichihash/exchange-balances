var usdPrices = {};
var burl = 'https://api.binance.com';
var endPoint = '/api/v3/account';
var dataQueryString = 'recvWindow=20000&timestamp=' + Date.now();

var keys = {
    'akey':'hY1SnTdW5Me8U38WcUhV25S4GWsorzvTQzpBiCc0r6kdV5JUZPPLiTH2ixMhdXsx', //'i9FS68eIEUbPf5dA29Vgms2SjoHhgZDZ2hLrutL0q5980Xx8e992XEJL5BrS9bem',
    'skey' :'cuFHSP0DgzQMcCiK2vDMX93Pd9PDxlzQeCFxWxOK7M6aut1gMR6249cH1TVkgrf9' //'fgcPPMq8XTbaqjgwjw1yPCh2b6KGiflwVoYFDv6Kx9WkEG2D16qeuQYSj1VyK9DC'
    
}


function getPrices(){
    var request2 = new XMLHttpRequest();
    request2.open('GET','https://api.binance.com/api/v3/ticker/price', true);
    request2.onload =function(){
       var usdPrices_l = {};
       var rData2 = JSON.parse(request2.responseText);
       //console.log(rData2);
       for(k=0;k<rData2.length;k++){
           var sym =rData2[k]["symbol"];
        if(sym.substr(sym.length -4, sym.length)=='USDT'){
          usdPrices_l[rData2[k]["symbol"]] = rData2[k]["price"];}
       }
       usdPrices = usdPrices_l;
      //console.log(usdPrices);//find value and change
    }
       request2.send();
 ///
};

function getassets(){

 var signature = CryptoJS.HmacSHA256(dataQueryString ,keys['skey']).toString(CryptoJS.enc.Hex);
 var request1 = new XMLHttpRequest();
 var url = burl + endPoint + '?' + dataQueryString + '&signature=' + signature;
 request1.open('GET', url, true);
 request1.setRequestHeader('X-MBX-APIKEY',keys['akey']);
 
request1.onload = function(){ 
    rData2 = JSON.parse(request1.responseText);


var array = rData2["balances"].length;
    for(i=0;i<array;i++){
        var curr = rData2["balances"][i]["asset"];
        var free = parseFloat(rData2["balances"][i]["free"]);
        var locked = parseFloat(rData2["balances"][i]["locked"]);
        var total = (free+locked).toFixed(6);
 
        var price = usdPrices[curr+'USDT'];
        price = parseFloat(price).toFixed(2);

        var usdValue =total*price;
      
        usdValue = usdValue.toFixed(2);

        if(usdValue>0.01){ 
         if(curr=='USDT')
           {
             var symbbalance =  "<tr ><td><span class='ssym'>"+curr+"</span></td><td><span class='sprice'>"+"$"+total+"</span></td><td><span class='stotal'>"+total+"</span></td><td><span class='susdv'>"+"$"+total+"</span></td></tr>";
           
            }else{
             var symbbalance =  "<tr ><td><span class='ssym'>"+curr+"</span></td><td><span class='sprice'>"+"$"+price+"</span></td><td><span class='stotal'>"+total+"</span></td><td><span class='susdv'>"+"$"+usdValue+"</span></td></tr>";
            }
                $("#dptable tbody").append(symbbalance);   
          
             }
      
            }
     
   }
request1.send();

};

getPrices();
getassets();

$(document).ready(function(){

    updateTable();
  
    function updateTable(){//proxy function for updates
       getPrices();
       updateValues();
    setTimeout(updateTable,1*1000);//2 secs

    };



function updateValues(){
    //   var symbbalance =  "<tr ><td><span class='ssym'>"+curr+"</span></td><td><span class='sprice'>"+total+"</span></td><td><span class='stotal'>"+total+"</span></td><td><span class='susdv'>"+total+"</span></td></tr>";
 
    $('#dptable > tbody >tr').each(function(){
        var curr = $(this).find('.ssym').text();
        var balance = $(this).find('.stotal').text();//text?
       

        if(curr!='USDT'){
             var price = parseFloat(usdPrices[curr+'USDT']).toFixed(2);
           var usdValue =(balance*price).toFixed(2);
         
            $(this).find('.sprice').text("$"+price.toString());  
            $(this).find('.susdv').text("$"+usdValue.toString());
   
        }
    });
  
}

});
