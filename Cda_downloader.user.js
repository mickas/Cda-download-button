// ==UserScript==
// @name        Cda downloader
// @namespace   pp
// @include     https://www.cda.pl/video/*
// @version     1
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// ==/UserScript==

function log(msg)
{
  console.log("[cda downloader] " + msg);  
}

function DECRYPT_super_secret_rot13_ENCRYPTION(s)
{
    return (s ? s : this).split('').map(function(_)
     {
        if (!_.match(/[A-Za-z]/)) return _;
        c = Math.floor(_.charCodeAt(0) / 97);
        k = (_.toLowerCase().charCodeAt(0) - 83) % 26 || 26;
        return String.fromCharCode(k + ((c == 0) ? 64 : 96));
     }).join('');
}

function generateDownloadLink(href)
{
  var downloadLink = document.createElement('a');

  downloadLink.setAttribute('style', 'color: yellow; float:right; padding-right:1em');
  downloadLink.setAttribute('href', href);

  downloadLink.append( document.createTextNode('Download') );

  return downloadLink;
}

var currentUrl = window.location.toString();
var mobileUrl = currentUrl.replace('www.','m.');


GM_xmlhttpRequest ( {
    method:     'GET',
    url:        mobileUrl,
    onload:     
  function (html) 
  {
    var decrypted = DECRYPT_super_secret_rot13_ENCRYPTION(html.responseText);
    var title = document.querySelector('#naglowek span[itemprop="name"]').innerHTML;

    log(title);

    var r = /http.+?\.mp4/;

    var result = r.exec(decrypted);

    result = result[0]
      .replace(/\\\//g,'/') //  `\/` -> `/`
      .replace('adc.mp4','.mp4');



    document.getElementById('naglowek').appendChild( generateDownloadLink(result) );

    

    log(result);

  }
} );

log(mobileUrl);

