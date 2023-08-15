// Homepage main script
function loader() {
	new homepage();
	ck.maxLen = ck.winWidth = ck.winHeight = 0;
	ck.lWidth = 469;
	window.onresize = ck.getDimensions;
	ck.oldstr = "";
	ck.histArr = [];
	ck.hIndex = 0;
	ck.dropList = ck.dropList2 = "";
	ck.srchEngines = [];
	ck.currRow = "";
	ck.ans = "";
	ck.showAns = 0;
	ck.waitRepeat = 0;
	ck.responses = [];
	ck.strlen = 0;
	ck.currIndex = 0;
	ck.ok2go = 0;
	ck.searchSuggest = true;
	ck.suggest = [];
	ck.suggestTimeout = 120;
	ck.showkey = false;
	ck.A = ck.B = ck.C = ck.key = 0;
	ck.shortcuts = [];
	ck.addShortcut("m", "mail.google.com");
	ck.addShortcut("jchen", "people.math.gatech.edu/~jchen646/homepage.html");
	ck.addShortcut("mse", "math.stackexchange.com/questions/tagged/commutative-algebra");
	ck.addShortcut("m2", "habanero.math.cornell.edu:3690");
	ck.addShortcut("hm", "happymeeple.com");
	os = browser = "";
	ck.getBrowser();
	get('info').innerHTML = "You are using " + ck.getInfo() + " on " + os;
	ck.prefix = location.href.search(/https/) ? "http://" : "https://";
	ck.IEnew = navigator.userAgent.search(/MSIE (8|9|1)/) > 0;
	if (browser != "IE" || ck.IEnew) get('iP').style.marginBottom = "10px";
	get('iP').style.width = ck.lWidth - 5 + "px";
	get('iP').style.border="2px solid #82CCDE";
	get('iP').onkeydown = function(e) { ck.chk(this.value, e); }
	get('iP').onkeyup = function(e) { ck.dropBox(e); }
	ck.getDimensions();
	//if (get('info').innerHTML.indexOf("Chrome") > 0) get('iP').style.marginLeft = "1px";
	if (os.indexOf("Android") + 1 > 0) ck.searchSuggest = false;
	get('iP').value = "";
	setTimeout("get('iP').focus()", 0);
}
window.onload = loader;
var homepage = function() {
	ck = this;
	ck.getBrowser = function () {
		var uA = String(navigator.userAgent), winVer = uA.search(/NT/)+1, winArr = ["Vista","7","8","8.1","10"];
		if (uA.search(/Windows/)+1) {
			if (uA.search(/NT 5/) + 1) os = "XP";
			else if (uA.search(/NT 6/) + 1) os = winArr[+uA.charAt(winVer+4)];
			else {
				os = uA.substr(winVer + 2);
				os = os.substr(0, os.search(/\./)+2);
			}
			os = "Windows " + os;
		} else if (uA.search(/iPhone/)+1) os = "iPhone";
		else if (uA.search(/iPad/)+1) os = "iPad";
		else if (uA.search(/Android/)+1) os = uA.substr(uA.search(/Android/)).split(';')[0];
		else if (uA.search(/Mac/)+1) os = "Mac OS X";
		else {
			os = "Linux";
		}
		if (uA.search(/MSIE/) > 0) browser = "IE";
		else if (window.opera) browser = "Opera";
		else if (uA.search(/Maxthon/)+1) browser = "Maxthon";
		else if (uA.search(/Chrome/)+1) browser = "Chrome";
		else if (uA.search(/Safari/)+1) browser = "Safari";
		else browser = "Firefox";
	}
	ck.getInfo = function () {
		var uA = String(navigator.userAgent), ver = "";
		if (uA.search(/Saf/)+1) uA = uA.substr(0, uA.search(/ Saf/));
		var arr1 = uA.split("\/");
		if (uA.search("Chrome") > 0 && arr1[arr1.length-2].indexOf("(") < 0) arr1.pop();
		var arr2 = arr1[arr1.length-2].split(" ");
		ver = arr2[arr2.length-1] + " " + arr1[arr1.length-1].split(" ")[0];
		if (uA.search("Oper")+1) {
			if (!ver.search(/P/)) ver = uA.split(" ")[0].replace(/\//, " ");
			else if (browser != "Opera") ver = "Opera "+ver.split(" ")[1];
		}
		if (uA.search("MSIE")+1) ver = "Internet Explorer " + uA.split(";")[1].split(" ")[2];
		else if (uA.search("Trident")+1) ver = "Internet Explorer " + uA.split(":").pop().substr(0,4);
		if (uA.search("Konq")+1) ver = "Konqueror " + ver.split(" ")[1];
		if (uA.search("Maxthon")+1) ver = "Maxthon " + uA.substr(uA.search("Max")+8).split(" ")[0];
		if (!ver.search(/Ver/)) ver = browser + " " + ver.split(" ")[1];
		return ver;
	}
	ck.getDimensions = function () {
		try {
			var old = [ck.winWidth, ck.winHeight];
			ck.winWidth = document.documentElement.clientWidth || window.innerWidth;
			ck.winHeight = document.documentElement.clientHeight || window.innerHeight;
			ck.maxLen = Math.floor(ck.winWidth/(os.search("W")+1||browser.search(/F|O/)?8.25:10.3));
		} catch(err) {}
	}
	ck.updateHistory = function (mode, param) {
		if (mode == "add") { 
			if (ck.histArr[ck.histArr.length-1] != param && param.length) {
				ck.histArr.push(param);
				ck.hIndex = ck.histArr.length - 1;
			}
		}
		else if (mode == "delete") {
			ck.histArr.splice(param, 1);
		}
	}
	ck.eventHandler = function (e, s) {
		var e = e || event;
		ck.A = e.altKey, ck.B = e.shiftKey, ck.C = e.ctrlKey, ck.key = e.keyCode;
		if (ck.showkey) document.title = ck.key+": "+String.fromCharCode(ck.key);
		if (ck.key == 13) {
			ck.movePosEnd('iP');
			ck.updateHistory("add", s);
			if (!ck.isHidden(ck.dropList2)) { ck.key = 0; ck.runSearch(); }
		} else if (Math.abs(ck.key - 39) == 1) {
			if (!ck.C && !ck.isHidden(ck.dropList2)) { if (!ck.waitRepeat) ck.navigateList(); }
			else if (ck.histArr.length) {
				ck.hIndex = getNext(ck.histArr.length, ck.hIndex + (s==""?0:ck.key-39), 0);
				get('iP').value = ck.histArr[ck.hIndex];
			}
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
		} else if (ck.key == 9) {
			if (e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			setTimeout("get('iP').focus()", 0);
			if (!ck.isHidden(ck.dropList2) && ck.responses[0][1] && !ck.C) {
				do ck.currIndex = getNext(ck.responses[0].length, ck.currIndex + (ck.B?-1:1), 1);
				while (ck.responses[0][ck.currIndex] == get('iP').value);
				get('iP').value = ck.responses[0][ck.currIndex];
				setTimeout("ck.createSelection('iP', ck.strlen, get('iP').value.length)", 0);
			}
		} else if (ck.key == 46) {			
			if (ck.B && s != "") {
				ck.updateHistory("delete", ck.hIndex);
				get('iP').value = "";
			}
		} else if (ck.key == 8) { if (ck.getSelected('iP') == s) ck.updateHistory("add", s);
		} else if (ck.key == 119) { if (os == "Windows Vista") ck.vista(); }
	}
	ck.chk = function (s, e) {
		ck.ok2go = 0;
		clearTimeout(ck.submitTimer); clearTimeout(ck.ipTimer); clearTimeout(ck.reanimator);
		if (e != 0) {
			ck.eventHandler(e, s);
			if (ck.key != 13) return;
		}
		var r = Q = 0;
		if (!s.search("#!")) { Q = 1; s = s.substr(2); }
		var I = s.search(" "), q = s.substr(1), W = get('o2'), w = W.childNodes[0];
		if (!I) s = q;
		var k = s.charAt(0), t = s.substr(s.search(" ") + 1), u = encodeURIComponent(t);
		if (s == "cls") {
			var paraPos = (get('o1').parentNode.childNodes[9])?6:5;
			if (!ck.A && W.innerHTML != "") ck.destroy('o2', paraPos + 1, 1);
			if (get('o1').innerHTML != "") ck.destroy('o1', paraPos, 1);
		} else if (s == "exit") { 
			open('','_top','');
			close();
		} else if (!s.search(/\\|\.|\(|-|\d/)) {
			r = 1;
			var l = (k == "\\")?q:s;
			if (ck.B&&l==parseInt(l)&&l>0&&W.childNodes.length>=l) l='ck.frameCtrl('+l+', '+!ck.C+')';
			try {
				if (browser == "IE" && (!l.search(/^((5|)[2-9]|[1-4]\d|\w:)$/))) throw("Shell");
				l = l.closeParens();
				var l2 = l;
				with(Math) { l = String(eval(l)); }
				if (l != "undefined") {
					if (l == parseFloat(l)) l = roundErr(l);
					l2 = (isNaN(l) || l2 == l)?"":l2+((l2.search(";")+1)?": ":" = ");
					ck.write(l2+l, get('o1'), "first");
				} else { l = l2; if (browser == "IE" && l.search(/[=(;,]/)<0) throw("Shell"); }
			} catch(err) {
				if (err == "Shell" || (browser == "IE" && !ck.C && l.search(/[=(;,]/)<0)) {
				var sh = new ActiveXObject("WScript.Shell");
				var app = new ActiveXObject("Shell.Application");
				var fso = new ActiveXObject("Scripting.FileSystemObject");
				var dir = String(location);
				dir = dir.substring(8, dir.lastIndexOf("/")+1), l = l.replace(/'/g, '"');
				if (fso.folderExists(dir+l) || fso.fileExists(dir+l)) l = dir + l;
				if (get('info').innerHTML.indexOf("Vista") < 0 && l == 17) l = "start shell:mycomputerfolder";
				if (!+l) {
					if (fso.fileExists(l) && l.search(/ /)+1) l = '"' + l + '"';
					else if (fso.folderExists(l)) l = "explorer "+fso.getAbsolutePathName(l);
					dir = "cmd /c cd /d " + dir.replace(/\\/g, "\\\\") + " & ";
					if (ck.B) l += " & set /p = Press Enter to return ...";
					eval("sh.Run('"+dir+l.replace(/\\/g, "\\\\")+"', "+(ck.B?9:0)+")");
				} else eval("app.Open("+l+")");
				setTimeout("get('iP').value = ''", 1000);
				} else alert(err.name + ": " + err.message);
			}
		} else {
			if (t == s && s.search(/\./) < 0 && !I) {
				if (s != "index") t = t.charAt(0).toUpperCase() + t.substr(1);
				t = location.href.replace(/index\.htm/,"") + t + '.htm';
			} else if (s.search("cd ") && t != s) { 
				if (!s.search("wo")) t = "wolframalpha.com/input/?i=" + u;
				else if (k == "w") t = "en.wikipedia.org/?search=" + u;
				else if (k == "y") t = "youtube.com/results?search_query=" + u;
				else if (k == "b") t = "bing.com/search?q=" + u;
				else if (!s.search("go ")) {
					if (t.substr(t.length-5).indexOf(".") < 0 && t.search(/\//) < 0) t += ".com";
				} else {
					var googStr = "search.google.com/search?q=";
					if (k == "d") u = "define:" + u;
					if (k == "p") googStr = googStr.replace(/search/g, "images");
					if (k == "m") googStr = googStr.replace(/search/g, "maps");
					else googStr = googStr.substr(7);
					t = s=="g "?"google.com":(googStr + u);
					if (k == "i") t += "&btnI=3564";
				}
			}
			for (var ind=0;ind<ck.shortcuts.length;ind++) {
				if (s == ck.shortcuts[ind][0]) t = ck.shortcuts[ind][1];
			}
			if (!s.search(/\/r\//)) t = "old.reddit.com" + s;
			if (t.search(/:\/\//)<0) t = "http" + (t.search(/google/)+1>0 ? "s":"") + "://" + t;
			if (Q) {
				W.style.display = "";
				W.style.zIndex = 0;
				W.style.position = "absolute";
				W.style.top = "145px";
				W.style.left = "29px";
				var O = document.createElement("iframe"); 
				O.width = (ck.winWidth - 58)*((ck.C)?0.5:1) + "px";
				O.height = Math.ceil(2/3*ck.winHeight) + "px";
				O.src = t;
				if (w) W.insertBefore(O, w);
				else W.appendChild(O);
				//if (browser == "IE" && W.childNodes.length == 1) W.innerHTML += ""; // IE quirk
			} else {
				window.open(t, '_blank', '');
			}
		}
		if (!r) get('iP').value = "";
		setTimeout("get('iP').focus()", 0);
	}
	ck.dropBox = function (e) {
		clearTimeout(ck.keyTimer); clearTimeout(ck.reanimator);
		ck.waitRepeat = 0;
		var evalStr = get('iP').value;
		if (browser == "Firefox" && e.keyCode == 13 && ck.key != 13 && !e.ctrlKey) {
			if (evalStr.length) ck.chk(evalStr, e);
			return;
		}
		if (evalStr == ck.oldstr && evalStr != "time" && ck.key) return;
		ck.oldstr = evalStr;
		if (!evalStr.search(/^\\|^ |^cd |^exit$|^cls$|^$/)) { ck.hide(ck.dropList2, 1); return; }
		ck.showAns = 1;
		if (!ck.dropList) ck.makeDropList();
		if (ck.isHidden(ck.dropList2)) ck.hide(ck.dropList2, 0);
		if (evalStr.match(/[0-9]/g)) {
			var key = ck.key;
			get('expr').innerHTML = '<hr />Computing ... <hr />';
			ck.updateList();
			ck.key = key;
		}
		setTimeout("ck.evaler()", 0);
	}
	ck.evaler = function() {
		var ans1 = "", evalStr = get('iP').value, len = evalStr.length - 1;
		evalStr = ck.changeStrToExpr(evalStr.closeParens());
		try {
			var prop0 = evalStr.split("."), prop1 = prop0.pop(), queryStr;
			with(Math) { ans1 = eval(evalStr); }
		} catch(err) {
		} finally {
			get('expr').innerHTML = '';
			ck.ans = "" + ans1;
			/*if (ck.ans == parseFloat(ck.ans)) {
				//ck.ans = roundErr(ck.ans); Bug: 3*0.025
				if (ck.ans > 1e6 || Math.abs(ck.ans) < 1e-3) ck.ans = sciNot(ck.ans);
			}*/
		}
		if (!ans1) {
			try { queryStr = eval(prop0.join(".")); }
			catch(err) {}
			finally { if (queryStr) queryStr = getAll(queryStr, prop1); }
		}
		if (evalStr == "ip") {
			get('expr').innerHTML = '<hr /><span id="ipAddress"></span><hr />';
			if (!ck.responses[0] || typeof ck.responses[ck.responses.length-1] != "string") {
				get('ipAddress').style.whiteSpace = "pre";
				get('ipAddress').innerHTML = "Retrieving IP address ...";
				ck.animateLoad('ipAddress', 1);
				clearTimeout(ck.ipTimer);
				ck.ipTimer = setTimeout("clearTimeout(ck.reanimator);get('ipAddress').innerHTML='Request timed out.'", 10000);
				ck.geolocation();
			} else get('ipAddress').innerHTML = ck.responses[ck.responses.length-1];
		} else if ((ans1 || queryStr) && ck.key != 32) {
			var dispStr = (ck.oldstr=="time"?"Current ":"")+ck.oldstr.closeParens(), result = "";
			if (queryStr) result = queryStr;
			else if ((typeof ans1).search(/o|u/)) result = ck.ans;
			else if (ans1 != undefined) result = query(ans1, "");
			get('expr').innerHTML = '<hr /><b>'+dispStr+" = </b>"+ck.print(result)+'<hr />';
		} else {
			var str1 = get('expr').firstChild?get('expr').childNodes[1].innerHTML.chop(3):"";
			ck.showAns = (str1&&!evalStr.indexOf(str1)&&evalStr.search(/ /)<0&&evalStr.search(/[(*\/]/)+1) ? 1 : 0;
			if ((ck.key > 47 || ck.key == 32) && evalStr.search(/:\/\/|\(/) < 0) {
				ck.strlen = len + 1;
				ck.ok2go = 1;
				ck.submitTimer = setTimeout("ck.googleSuggest(ck.oldstr)", ck.suggestTimeout);
			}
		}
		get('expr').style.textAlign = (typeof ans1 == "function"?"left":"center");
		ck.updateList();
	}
	ck.makeDropList = function () {
		var uA = get('info').innerHTML;
		if (!os.search("W")) {
			if (uA.search(/Internet Explorer [5-9,1]|Opera/) >= 0) ck.lWidth += 3;
			else if (uA.search(/Maxthon/) > 0) ck.lWidth += 1;
		} else { ck.lWidth += (browser == "Opera" ? 3 : (browser == "Firefox" ? 1 : 0)); }
		ck.dropList2 = document.createElement("div");
		ck.dropList2.style.zIndex = 1;
		ck.dropList2.style.backgroundColor = "white";
		ck.dropList2.style.position = "relative";
		ck.dropList2.style.top = (browser=="IE"&&!ck.IEnew?-2:-11) + "px";
		ck.dropList2.style.width = ck.lWidth + "px";
		ck.dropList2.style.marginRight = ck.dropList2.style.marginLeft = "auto";
		ck.dropList2.style.border = "1px solid gray";
		ck.dropList = document.createElement("table");
		ck.dropList.style.position = "absolute";
		ck.dropList.style.marginTop = ck.dropList.style.marginLeft = "-2px";
		ck.dropList.style.width = ck.lWidth + "px";
		ck.srchEngines = "Google,I'm Feeling Lucky,Wikipedia,Youtube,Bing,Define,Maps,WolframAlpha";
		ck.srchEngines = ck.srchEngines.split(",");
		ck.makeRow("edu", 1), ck.makeRow("com", 1); ck.makeRow('default', 1);
		for (var i=ck.srchEngines.length-1;i>=0;i--) ck.makeRow(ck.srchEngines[i], 0);
		var nRow = ck.dropList.insertRow(0), nCell = nRow.insertCell(0);
		nCell.innerHTML = '<span id="expr"></span>', nRow.id = "exprValue";
		get('iP').parentNode.insertBefore(ck.dropList2, get('iP').nextSibling);
		ck.dropList2.appendChild(ck.dropList);
		get('expr').onmouseover = function() { ck.select(this.parentNode.parentNode); }
		get('expr').onclick = ck.runSearch;
		ck.currRow = ck.dropList.childNodes[0].childNodes[0];
	}
	ck.makeRow = function (text, mode) {
		var text2 = (!text.search(/I|d/i))?text:(!text.search("Wo")?"Ask "+text:"Search "+text);
		var newRow = ck.dropList.insertRow(0), newCell = newRow.insertCell(0);
		if (mode) newCell.innerHTML = '<span id="' + text + 'Addr"></span>';
		else newCell.innerHTML = '<b>' + text2 + '</b>: <span id="' + text + 'Srch"></span>';
		newRow.onmousedown = function() { ck.select(this); }
		newCell.onclick = ck.runSearch;
	}
	ck.updateList = function () {
		var str = get('iP').value;
		if (!ck.dropList) return;
		if (ck.isHidden(ck.dropList2)) ck.hide(ck.dropList2, 0);
		for (var i=0;i<ck.srchEngines.length;i++) get(ck.srchEngines[i]+'Srch').innerHTML = str;
		var protocol = str.search(/:\/\//)+1?"":"http://";
		get('defaultAddr').innerHTML = protocol + str;
		get('eduAddr').innerHTML = protocol + str + ".edu";
		get('comAddr').innerHTML = protocol + str + ".com";
		var showAddr = ck.showAns || str.search(/\(| /)+1;
		ck.hide(get('eduAddr').parentNode.parentNode, showAddr);
		ck.hide(get('comAddr').parentNode.parentNode, showAddr);
		ck.hide(get('defaultAddr').parentNode.parentNode, str.search(/ /)+1);
		ck.hide(get('expr').parentNode.parentNode, !ck.showAns);
		if (ck.showAns) ck.select(get('exprValue'));
		else if (str.search(/:\/\/|www|\.([a-z]{2,3})(?=\/*)/)+1) ck.select(ck.getRow(9));
		else if (!str.search(/(^\d{3,4} ([a-zA-Z ])+)(?=\s(st|lane|ave|rd))/)) ck.select(ck.getRow(7));
		else if (str.search(/\dx|\(x|[=\^]|integra/)+1) ck.select(ck.getRow(8));
		else ck.select(ck.getRow(2)); // chooses default search engine
		if (ck.isHidden(ck.currRow)) ck.select(ck.dropList.childNodes[0].childNodes[2]);
		ck.dropList2.style.width = ck.dropList.offsetWidth-4+"px";
		ck.dropList2.style.height = ck.dropList.offsetHeight-3+"px"; // (ck.IEnew?3:4)
		if (browser == "IE" && !ck.IEnew) ck.dropList.style.marginLeft = -ck.dropList.offsetWidth/2+"px";
		ck.key = 0;
	}
	ck.changeStrToExpr = function (str) {
		if (str == "time") {
			str = "ck.getDate()";
			setTimeout('ck.dropBox(0)', 1000); 
		} else if (str.charAt(str.length-1) == "!" && isNum(str.chop(1))) {
			str = "factorial3(" + str.substr(0, str.length-1) + ")";
		} else if (str == parseInt(str)) { str = "factor(" + str + ")";
		} else if (str.search(/\d/)+1) str=str.replace(/ mod /g, "%");//.replace(/sqrt/g, "sqRt");
		return str;
	}
	ck.runSearch = function () {
		var searchStr = get('iP').value, str = "";
		var keyword = ck.currRow.childNodes[0].childNodes[0].id;
		if (ck.B && ck.C) str = " " + searchStr;
		else if (keyword.search("Addr")+1) str = " go " + get(keyword).textContent;
		else if (ck.currRow.id == "exprValue") {
			ck.write(get('expr').childNodes[1].innerHTML+ck.ans, get('o1'), "first");
			setTimeout("ck.movePosEnd('iP')", 0);
			return;
		} else { 
			keyword = ck.currRow.childNodes[0].childNodes[2].id;
			if (!keyword.search("Wo")) str = " wo " + searchStr;
			else str = " " + keyword.charAt(0).toLowerCase() + " " + searchStr;
		}
		if (ck.B) str = "#!" + str;
		ck.chk(str, 0);
		get('iP').value = searchStr;
	}
	ck.getRow = function (n) {
		return ck.dropList.childNodes[0].childNodes[n];
	}
	ck.select = function (row) {
		ck.currRow.style.backgroundColor = "white";
		row.style.backgroundColor = "#D5E2FF";
		ck.currRow = row;
	}
	ck.s_h = function (obj) {
		if (!obj) return;
		obj.style.display = (ck.isHidden(obj))?"":"none";
	}
	ck.hide = function (obj, hide) {
		if (!obj) return;
		obj.style.display = (hide)?"none":"";
	}
	ck.isHidden = function (obj) {
		if (!obj) return 1;
		return obj.style.display == "none";
	}
	ck.navigateList = function () {
		if (!ck.waitRepeat) ck.waitRepeat = 600;
		else if (ck.waitRepeat > 200) ck.waitRepeat = 120;
		var newRow = ck.currRow, rowsArr = ck.currRow.parentNode.childNodes;
		if (ck.key == 38) newRow = (ck.currRow == rowsArr[0])?rowsArr[rowsArr.length-1]:ck.currRow.previousSibling;
		else newRow = (!ck.currRow.nextSibling)?rowsArr[0]:ck.currRow.nextSibling;
		while (ck.isHidden(newRow)) {
			if (ck.key == 40) newRow = rowsArr[!ck.isHidden(get('expr').parentNode.parentNode)?0:1];
			else newRow = (newRow == rowsArr[0])?rowsArr[rowsArr.length-1]:newRow.previousSibling;
		}
		ck.select(newRow);
		if (ck.waitRepeat) ck.keyTimer = setTimeout(ck.navigateList, ck.waitRepeat);
	}
	ck.resizer = function () {
		for (var i=0;i<get('o2').childNodes.length;i++) {
			var frame = get('o2').childNodes[i], scaleFactor = 1;
			if (frame.offsetWidth < ck.winWidth/2) scaleFactor = 0.5;
			frame.style.width = Math.max(ck.winWidth - 58, 60)*scaleFactor+"px";
			frame.style.height = Math.max(2/3*ck.winHeight, 60)+"px";
		}
	}
	ck.frameCtrl = function (n, hide) {
		var W = get('o2'), list = W.childNodes, frame = list[n-1];
		if (+ck.histArr[ck.histArr.length-1]<list.length) ck.updateHistory("delete", ck.histArr.length-1);
		if (hide) { W.style.display = ""; ck.s_h(frame); }
		else {
			W.removeChild(frame);
			get('iP').value = "";
			ck.hide(ck.dropList2, 1);
		}
	}
	ck.frameList = function () {
		var str = "";
		for (var i=0;i<get('o2').childNodes.length;i++){
			str += i + 1 + ": " + get('o2').childNodes[i].src + "\n";
		} return str;
	}
	ck.destroy = function (objId, recreate) {
		try {
			var obj = get(objId), parentObj = obj.parentNode, tag = obj.nodeName, pos = 0;
			for (var i=0;i<parentObj.childNodes.length;i++) {
				if (parentObj.childNodes[i] == obj) { pos = i; break; }
			}
			while (obj.childNodes.length > 0) obj.removeChild(obj.childNodes[obj.childNodes.length-1]);
			parentObj.removeChild(obj);
			if (!recreate) return;
			var newObj = document.createElement(tag);
			newObj.id = objId;
			parentObj.insertBefore(newObj, parentObj.childNodes[pos]);
		} catch(err) {}
	}
	ck.getDate = function () {
		var dt = "" + Date(), hPos = dt.indexOf(":"), h = +dt.substr(hPos - 2,2), pm = h >= 12?"p":"a";
		if (h > 12) h = h % 12; if (h == 0) h = 12;
		return h + dt.substr(hPos, 7) + pm + ".m., " + dt.substr(0,hPos-3) + "," + dt.substr(hPos+6);
	}
	ck.write = function (str, obj, pos) {
		if (obj) {
			var div = document.createElement("div");
			div.style.marginBottom = "10px";
			if (str.length > ck.maxLen || str.search(/\n/)+1) div.style.textAlign = "left";
			div.innerHTML = ck.print(str);
			if (pos == "first") {
				if (!obj.childNodes[0]) obj.appendChild(div);
				else obj.insertBefore(div, obj.childNodes[0]);
			} else obj.appendChild(div);
		}
	}
	ck.print = function (str) {
		if (!ck.maxLen) getNewDimensions();
		str = String(str);
		if (str.search(/\n/) < 0) return ck.splitContent(str);
		else {
			var tmp = "";
			str = str.split("\n");
			for (var i=0;i<str.length-1;i++) tmp += ck.splitContent(str[i] + '\n');
			tmp += ck.splitContent(str[i]);
			return tmp;
		}
	}
	ck.splitContent = function (content) {
		var split = tmp = "", endPos = numCaps = 0;
		while (content.length > ck.maxLen) {
			tmp = content.substr(0, ck.maxLen);
			if (tmp.search(/[A-Z]/)+1) {
				numCaps = tmp.match(/[A-Z]/g).length;
				tmp = tmp.chop(0.2*numCaps);
			}
			if (tmp.split("").reverse().join("").search(/ |,|>/)) {
				endPos = tmp.lastIndexOf(" ");
				if (endPos == -1) endPos = tmp.lastIndexOf(",");
				if (endPos == -1) endPos = tmp.lastIndexOf(">");
				if (endPos > 0) tmp = tmp.substr(0, endPos+1);
			}
			split += ck.formatHTML(tmp+"\n");
			content = content.substr(tmp.length);
		}
		split += ck.formatHTML(content);
		return split;
	}
	ck.formatHTML = function (text) {
		text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		return text.replace(/\n/g, "<br>").replace(/\t/g, "             ").replace(/ /g, "&nbsp;");
	}
	ck.stripHTML = function (text) {
		text = text.replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
		return text.replace(/<br>/gi, "\n").replace(/&nbsp;/gi, " ");
	}
	ck.vista = function () {
		var bgSet = document.body.style.backgroundImage;
		if (!bgSet) {
			document.body.style.backgroundImage = "url('Pictures/Vista.jpg')";
			document.body.style.backgroundPosition = "-50px -34px";
			document.body.style.backgroundRepeat = "no-repeat";
			document.body.style.backgroundAttachment = "fixed";
		} else document.body.style.backgroundImage = "";
	}
	ck.parseResponse = function (response) { //alert("Response:\n\n" + response);
		clearTimeout(ck.ipTimer); clearTimeout(ck.reanimator);
		if (ck.ok2go) {
			var txt = String(response).split(",");
			ck.suggest = [];
			for (var i=1;i<txt.length-1;i++) if (isNaN(+txt[i])) ck.suggest.push(txt[i]);
			setTimeout("ck.writeSuggestion('iP', ck.suggest[0])", 0);
			ck.responses.unshift(ck.suggest);
			ck.currIndex = 0;
		} else if (response.ipAddress) {
			var geoFields = getAll(response, "", false);
			geoFields.splice(0, 2); // Removes statusCode, statusMessage fields
			for (var i=0;i<geoFields.length;i++) geoFields[i] = "<b>" + geoFields[i] + "</b> = " + response[geoFields[i]];
			ck.responses.push(geoFields.join("<br>"));
			get("ipAddress").innerHTML = ck.responses[ck.responses.length-1];
			ck.updateList();
		}
	}
	ck.jsonp = function(url) {
		var script = document.createElement("script");
		script.id = "jsonp_request" + (ck.responses.length + 1);
		script.src = ck.prefix + url;
		script.onload = function(){ setTimeout(ck.destroy(this.id), 100); };
		document.body.appendChild(script);
	}
	ck.googleSuggest = function (str) {
		if (!ck.searchSuggest || !str.search(/^(cls|exit)$/) || !ck.ok2go) return;
		var path = "suggestqueries.google.com/complete/search?client=youtube&jsonp=ck.parseResponse";
		ck.jsonp(path + "&q=" + encodeURIComponent(str));
	}
	ck.geolocation = function () {
		var key = "10d0b8f8eef617d61721dc559e274539370b6081d05383f2da907e0a1a0fc829";
		ck.jsonp("api.ipinfodb.com/v3/ip-city/?key="+key+"&format=json&callback=ck.parseResponse");
	}
	ck.animateLoad = function (obj, mode) {
		if (!get(obj) || !mode) { clearTimeout(ck.reanimator); return; }
		try {
			var txt = String(get(obj).innerHTML).replace(/'/g, ""), numDots = 0;
			if (txt.tail(3).indexOf(".")+1) numDots = txt.tail(3).match(/\./g).length;
		} catch(e) {}
		if (numDots == 3) txt = txt.chop(3) + "   ";
		else if (numDots == 2) txt = txt.chop(3) + "...";
		else if (numDots == 1) txt = txt.chop(3) + ".. ";
		else if (numDots == 0) txt = txt.chop(3) + ".  ";
		get(obj).innerHTML = txt;
		ck.reanimator = setTimeout("ck.animateLoad('" + obj + "', 1)", 500);
	}
	ck.popUp = function (address, name, width, height) {
		var top = 0.5*(screen.height - height), left = 0.5*(screen.width - width);
		var str1 = 'width='+width+', height='+height+', top='+top+', left='+left+', scrollbars=yes';
		open(address, name, str1);
	}
	ck.writeSuggestion = function (field, suggestion) {
		var orig = get(field).value, origLen = orig.length;
		if (!suggestion || suggestion.search(new RegExp(orig, "i")) || !ck.ok2go) return;
		get(field).value += suggestion.substr(origLen);
		ck.oldstr = get(field).value;
		ck.updateList();
		setTimeout(function(){ck.createSelection(field, origLen, suggestion.length)},0);
	}
	ck.createSelection = function (field, start, end) {
		var field = get(field);
		if (field.createTextRange) {
			var selRange = field.createTextRange(); 
			selRange.collapse(true); 
			selRange.moveStart('character', start); 
			selRange.moveEnd('character', end); 
			selRange.select();
		} else if (field.setSelectionRange) { 
			field.setSelectionRange(start, end); 
		} else if (field.selectionStart) { 
			field.selectionStart = start; 
			field.selectionEnd = end; 
		}
		field.focus();
	}
	ck.getSelected = function (field) {
		field = get(field);
		if (document.selection) return document.selection.createRange().text;
		else return field.value.substring(field.selectionStart, field.selectionEnd);
	}
	ck.movePosEnd = function (field) {
		field = get(field);
		if (field.createTextRange) {
			var range = field.createTextRange();
			range.collapse(false);
			range.select();
		} else field.focus();
	}
	ck.showsrc = function() {
		alert(document.body.innerHTML);
	}
	ck.addShortcut = function(alias, url) { // Arguments require QUOTES
		ck.shortcuts.push([alias, (url.search(/http/)?"http://":"")+url+(url.search(/\./)>0?"":".com")]);
	}
	ck.imageHelper = function() {
		var img = "";
		if (browser == "Firefox") {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			img = get('bingFrame').contentWindow.document.childNodes[1].textContent.substr(10400);
			img = img.substring(img.indexOf("g_img=")+13, img.indexOf(".jpg")+4).replace(/\\/g, "");
			loadBgImage(get('bingFrame').src + img);
		}
		setTimeout("ck.destroy('bingFrame', 0)", 2000);
	}
	ck.getBingImage = function () {		
		var frame = document.createElement("iframe");
		frame.id = "bingFrame";
		frame.style.display = "none";
		frame.height = 0;
		frame.width = 0;
		frame.src = "http://www.bing.com";
		frame.onload = ck.imageHelper;
		document.body.appendChild(frame);
	}
}