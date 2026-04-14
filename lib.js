/*********************************************************************
 * Ajax 모듈
 * 작성일 : 2012-06-07
 * 작  성 : Hyunee™ (http://starbbs.kr)
 *********************************************************************/

/**
 * Ajax 호출(URL 호출)
 **
 * param
 *    url       : ajax 호출할 url(필수)
 *    content   : url 호출하여 정상적 결과를 얻었을때 실행할 함수(필수)
 *    exception : url 호출시 비 정상적 결과가 생겼을때 처리 함수
 * return
 *    void
 */
//function Ajax(url, bodyData, content, exception){
function Ajax(param){
	var xmlHttp = null;
	var self = this;
	try {             xmlHttp = new ActiveXObject("Msxml2.XMLHTTP"   ); }  // Ajax 개채생성
	catch (e) { try { xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); }
	catch (e) { try { xmlHttp = new XMLHttpRequest();                   }
	catch (e) {       xmlHttp = null;                                 }}}
	if(!xmlHttp) return;
	if (window.XMLHttpRequest) { // Mozilla, Safari,...
		if (xmlHttp.overrideMimeType) {  xmlHttp.overrideMimeType('text/plain; charset=euc-kr');  }
	} 

	xmlHttp.open("POST", param.url, true );             // ajax 열기(비동기)
//	xmlHttp.open("POST", url, false);             // ajax 열기(동기)
//	xmlHttp.open("POST", url);             // ajax 열기(동기)

//    xmlHttp.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
	xmlHttp.setRequestHeader('X-PINGOTHER', 'pingpong');
	xmlHttp.setRequestHeader('Content-Type', 'application/xml');

	xmlHttp.setRequestHeader("Cache-Control", "no-cache");
	xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
//	xmlHttp.withCredentials = true;
	//xmlHttp.setRequestHeader("Accept-Language", "utf-8"); 
	xmlHttp.onreadystatechange = function(){      // 정상처리의 경우 응답핸들링 지정
		try{
			if (xmlHttp.readyState == 4){ 
				if (xmlHttp.status == 200){ 
					param.content(xmlHttp);
					// 응답처리
					xmlHttp = null; 
				} else {
					param.content({responseText:'XHR.status:'+xmlHttp.status});
				}
			}
		}catch(e){
			if(!!param.exception) param.exception(xmlHttp, e);
		}
	}; 

    /*
	xmlHttp.onload = function(evt){
        console.log(evt);
        var xhr = evt.target;
        console.log(xhr.getAllResponseHeaders());
        console.log(xhr.responseText);
	}
    */
	if(param['onload']) xmlHttp.onload = param.onload;
        /** /
        xmlHttp.timeout = 3000;
        xmlHttp.ontimeout = function(evt){
            console.log(evt);
            alert('Ajax ontimeout');
        }
        /**/
    xmlHttp.timeout = 360000; // 6분 * 60초 * 1000밀리초
    if(param['timeout']  ) xmlHttp.timeout = param.timeout;
    if(param['ontimeout']) xmlHttp.ontimeout = param.ontimeout;
    xmlHttp.responseType = (param['type']?param.type:''); 
	xmlHttp.send( param.body?param.body:'' );                               // 저장요청

	//xmlHttp.send( param.body?JSON.stringify(param.body):'' );                               // 저장요청
}


/**
 * XML 처리 개체정의
 --------------------
 * Ajax 에서 response 된 XML 에서 Data 추출 및 변환
 */
var XML = function(xml){
	this.xml         = this.getXmlDom();
	this.code        = null;          // 처리코드
	this.message     = null;          // 처리메시지
	this.messagecode = null;          // 처리메시지[처리코드]
	this.iserror     = false;         // 처리코드가 '0' 이 아닌경우 true가 됨.
	this.object = this;

	this.response(xml);
};
XML.prototype = { // XML에 멤버함수 추가
	getXmlDom : function(){
		if (window.ActiveXObject)
		{// code for IE
			return new ActiveXObject("Microsoft.XMLDOM");
		} else if (document.implementation.createDocument)
		{// code for Mozilla, Firefox, Opera, etc.
			return document.implementation.createDocument("", "", null);

		} else {
			alert('Your browser cannot handle this script');
		}

	},
	response: function(originalResponse) {                  // xml 수신
		try{
			if(originalResponse.responseText.toUpperCase().indexOf('세션이 종료 되었거나 없습니다. 다시 로그인해 주세요')>-1){
				originalResponse.responseText.evalScripts() // 넘어온 스크립트 블럭 수행
				return;
			}
			if(originalResponse.responseText.indexOf('<?xml') <0 ){ // 오류가 생겼을때 처리
				alert(originalResponse.responseText.replace(/(<br.{0,}>)/gi,'').replace(/&nbsp;/gi,' '));
				return;
			}
			if(navigator.userAgent.indexOf("MSIE") >= 0){
				this.xml.async = true;  // 동기
				//this.xml.async = false;   // 비동기
				this.xml.loadXML(originalResponse.responseText);
			}else{
				var domParser = new DOMParser();
				this.xml = domParser.parseFromString(originalResponse.responseText, "text/xml");
				delete domParser;
			}
		}catch(e){
			this.xml = originalResponse;
		}
	},
	length: function(tagName){                              // xml에서 지정된(기본값:row) 테그의 갯수를 반환함.
		tagName = tagName||'row';
		try     { return this.xml.getElementsByTagName(tagName).length; }
		catch(e){ return 0; }
	},
	get: function(tagName, index, attr) {                         // xml에서 지정된 테그에 든 값을 반환함.
		index = index||0;
		attr  = attr ||'value';
		var r = '';
		try{           r = this.xml.getElementsByTagName(tagName)[index].getAttribute(attr  );  }
		catch(e){ try{ r = this.xml.getElementsByTagName(tagName)[index].firstChild.nodeValue; }
		catch(e){      r = '';                                                                 }}
		return r;
	},
	forEach: function(tagName, content){
		var i;
//		for(i in this.xml.getElementsByTagName(tagName)){
		var len = this.length(tagName);
		for(var i=0; i<len; i++){
			content(this.xml.getElementsByTagName(tagName)[i], i);
		}
//		this.xml.getElementsByTagName(tagName).forEach(content);
	},
	getNode:function(nodeName, index){
		index = index||0;
		return this.xml.getElementsByTagName(nodeName)[index];
	}
}


//-------------------------------------------------------------------------------
// 개체 확장
//-------------------------------------------------------------------------------
String.prototype.format = function() {             // 숫차포멧변환 3자리 마다 ',' 추가
	if(isNaN(this)) return this;
	var reg = /(^[+-]?\d+)(\d{3})/;                // 정규식정의
	this.rep = this + '';                          // 문자로 변환
	while (reg.test(this.rep)) this.rep = this.rep.replace(reg, '$1' + ',' + '$2');
	return this.rep;
}
Number.prototype.format = function() {             // 숫차포멧변환 3자리 마다 ',' 추가
	if(isNaN(this)) return this;
	return (this + '').format();
}
// 숫자를 2자리 문자로 치환
Number.prototype.to2 = function() { return (this > 9 ? "" : "0")+this; };
Date.prototype.getDateTime = function(){
	return this.getFullYear() + '-' + (this.getMonth()+1).to2() + '-' + this.getDate().to2() + ' '
		 + this.getHours().to2() + ':' + this.getMinutes().to2() + ':' +this.getSeconds().to2();
}
Date.prototype.getYMD = function(div){
	div = div||'';
	return this.getFullYear() + div + (this.getMonth()+1).to2() + div + this.getDate().to2();
}
// 배열의 값 Index 찾기
Array.prototype.indexOf = Array.prototype.indexOf||function(elt, from){
	var from=Number(from)||0;
	var len=this.length;
	if(from<0) from+=len;
	for(; from<len; from++){
		if(from in this && this[from] === elt) return from;
	}
	return -1;
}
Array.prototype.forEach = Array.prototype.forEach||function(content /*, thisp*/){
    var len = this.length;
    if (typeof content != "function")
      throw new TypeError();
 
    var thisp = arguments[1];
    for (var i = 0; i < len; i++){
      if (i in this)
        content.call(thisp, this[i], i, this);
    }
};
/* // 2023-10-09 socket 모듈과 충돌로 주석처리함
Object.prototype.toString = function(){             // Object 개채를 JSON타입으로 변경
   var results = []; 
   for (var property in this) { 
	   var value = this[property]; 
	   if(typeof value == 'function') continue;
	   results.push(property + ':' + value); 
   } 
   return '{' + results.join() + '}'; 
} 
*/
Object.prototype.hide = function(){ this.style.display = 'none'; } // 개체 숨김(css)
Object.prototype.show = function(){ this.style.display = ''; }     // 개체 보임(css)
Object.prototype.isShow = function(){ return this.style.display==''?true:false; }
Object.prototype.clear = function(id){
	var ind = $(id).childNodes.length, start = 0;
	for (var i=ind-1; i>=start ; i--) $(id).removeChild($(id).childNodes[i]);
}
String.prototype.toJSON=function(){ // json 으로 변환
    try{
        return eval('('+decodeURIComponent(this)+')');
    }catch(e){
        try{
            return eval('('+this+')');
        }catch(e){
            console.error(e);
            return null;
        }
    }
}
String.prototype.encode=function(){ // 2023-10-06
    return encodeURIComponent(this);
}
String.prototype.decode=function(){ // 2023-10-06
    try{
        return decodeURIComponent(this);
    }catch (e){
        return this;
    }
}
// 출력용 파일용량 구하기
Number.prototype.getSize=function(){ // 2023-10-06
    var returnValue = this;
    var idx = 0;
    var str = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'HB'];
    while(returnValue>1024){
        returnValue = returnValue/1024;
        idx++;
    }
    return (Math.round(returnValue*10)/10).format() + ' ' + str[idx];
//    return Math.round(returnValue*1000).format() + ' ' + str[idx-1];
}
String.prototype.getSize=function(){ // 2023-10-06
    return (+this).getSize();
}

//-------------------------------------------------------------------------------
// Cookie
//-------------------------------------------------------------------------------
function setCookie(c_name,value,exdays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}
function getCookie(c_name){
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++){
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name) return unescape(y);
	}
}
// this deletes the cookie when called
function Delete_Cookie( name, path, domain ) {
	if ( Get_Cookie( name ) ) document.cookie = name + "=" +
	( ( path ) ? ";path=" + path : "") +
	( ( domain ) ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}


//-------------------------------------------------------------------------------
// Element
//-------------------------------------------------------------------------------
function $(n){return document.getElementById(n)||'';}
function $F(n){return $(n).value;}

//-------------------------------------------------------------------------------
// Global
//-------------------------------------------------------------------------------
function show(id){
	try{
		$(id).show();
	}catch(e){
		$(id).style.display='';
	}
}
function hide(id){
	try{
		$(id).hide();
	}catch(e){
		$(id).style.display='none';
	}
}

function getTime(time){
	if(!time) return time;
	return (new Date(time*1000)).getDateTime();
}

// 마우스 드래그
var Drag = function(id){
    // 자기 참조용
    var self = this;

    // 속성들
    this.id = id;
    this.objDoc = $(this.id);
    this.blIsDrag = false;
    this.objOtherBrowsers = document.getElementById && !document.all;
    this.intLeftX;
    this.intTopY;
    this.x;
    this.y;

    // 레이어 속성 변경
    this.objDoc.style.position='absolute';
    //with(this.objDoc.style){
    //    position='absolute';
    //}

    // Event Handler 등록/삭제
    this.catchEvent = function(eventObj, event, eventHandler){ // 이벤트 등록
        if(eventObj.addEventListener) // IE외
            eventObj.addEventListener(event, eventHandler, false);
        else if(eventObj.attachEvent){
            event = 'on'+event;
            eventObj.attachEvent(event, eventHandler);
        }
    }
    // 마우스 이동 이벤트 핸들러
    this.fnMoveMouse = function (e){
      if (self.blIsDrag){
        self.objDoc.style.left = self.objOtherBrowsers ? self.intLeftX + e.clientX - self.x
                                                       : self.intLeftX + event.clientX - self.x;
        self.objDoc.style.top  = self.objOtherBrowsers ? self.intTopY + e.clientY - self.y
                                                       : self.intTopY + event.clientY - self.y;
        return false;
      }
    }

    // 레이어 선택시 이벤트 핸들러
    this.fnSelectMouse = function (e){
      var objF = self.objOtherBrowsers ? e.target : event.srcElement;
      var strTopElement = self.objOtherBrowsers ? "HTML" : "BODY";

      while (objF.tagName != strTopElement && objF.id != self.id)
        objF = self.objOtherBrowsers ? objF.parentNode : objF.parentElement;
      if (objF.id == self.id){
        self.blIsDrag = true;
        self.objDoc = objF;
        self.intLeftX = self.objDoc.offsetLeft;
        self.intTopY  = self.objDoc.offsetTop;
        self.x = self.objOtherBrowsers ? e.clientX : event.clientX;
        self.y = self.objOtherBrowsers ? e.clientY : event.clientY;
        self.catchEvent(document,'mousemove',self.fnMoveMouse);
        return false;
      }
    }

    this.fnMouseUp = function(){self.blIsDrag = false;}

    this.catchEvent(document,'mousedown',this.fnSelectMouse);
    this.catchEvent(document,'mouseup',this.fnMouseUp);
}
// 마우드 드래그

//-------------------------------------------------------------------------------
// JSON String 조합
//-------------------------------------------------------------------------------
	function toJSON(obj){
		var s = '{';
		var i = 0;
		for(var k in obj){
			if(k == 'age') continue; // age 는 제거함.
			s += (i?',':'');
			if(typeof obj[k] == 'object'){
				s += '"' + k + '":' + toJSON(obj[k]);
			}else{
				s += '"' + k + '":"' + obj[k] +'"';
			}
			i++;
		}
		s += '}';
		return s;
	}
/** / // 2023-10-09 socket 모듈과 충돌로 주석처리함
if(!Array.prototype.toJSON)
	Array.prototype.toJSON = function(){
		var s = '[';
		var j=0;
		for(var i=0; i<this.length; i++){
			s += (j?',':'');
			s += toJSON(this[i]);
			j++;
		}
		s += ']';
		return s;
	}
/**/
//-------------------------------------------------------------------------------
// String get 방식 쿼리 추출
//-------------------------------------------------------------------------------
String.prototype.getQuery = function(){
    var tmp = this.split('?');
    var lst=tmp[1].split('&');
    var r = '{';
    for(var i=0; i<lst.length; i++) {
        var t = lst[i].split('=');
        r += (i==0?'':',');
        r += t[0] + ':"' + t[1] + '"';
    }
    r+='}';

    return eval( '('+r+')' );
}
