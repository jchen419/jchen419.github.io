// The functions in this library can only accept String arguments for precision, except where noted

function addInt(num1, num2) { 
	var addAns1 = "", aCarry = 0, currentAddDigit, larger1, smaller1, lengthDiff, len1, len2;
	larger1 = (num1.length < num2.length)?num2:num1;
	smaller1 = (larger1 == num1)?num2:num1;
	len1 = larger1.length, len2 = smaller1.length;
	lengthDiff = len1 - len2;
	for (var i1=1;i1<=len2;i1++) {
		currentAddDigit = aCarry + (+larger1.charAt(len1-i1)) + (+smaller1.charAt(len2-i1));
		aCarry = (currentAddDigit>9)?1:0;
		if (aCarry) { currentAddDigit -= 10; }
		addAns1 = currentAddDigit + addAns1;
	}
	if (lengthDiff === 0) { if (aCarry > 0) { addAns1 = aCarry + addAns1; } }
	else if (aCarry === 0) { addAns1 = larger1.substr(0, lengthDiff) + addAns1; }
	else { 
		addAns1 = addInt(larger1.substr(0, lengthDiff), "1") + addAns1;

		// The non-recursive way of getting rid of the last carry digit
		/*int newDigit,non9=larger1.length-larger1.split('').reverse().join('').search(/[0-8]/)-1;
		if (non9 != -1) {
			newDigit = 1 + parseInt(larger1.at(non9));
			addAns1 = addZeros(lengthDiff - non9 - 1) + addAns1;
 		  return larger1.substr(0,non9) + parseChar(newDigit) +addAns1;
		}
       		return "1" + addZeros(lengthDiff) + addAns1;*/
	}
	return addAns1;
}
function addArr(array) { // accepts an array
	var addAns2 = "0";
	for (var j=0;j<array.length;j++) {
		addAns2 = addInt(addAns2, array[j]);
	}
	return addAns2;
}
function addReal(num1, num2) {
	var decimPos1 = num1.indexOf("."), decimPos2 = num2.indexOf("."), int1, frac1, int2, frac2;
	if (decimPos1 == num1.length - 1) { num1 = num1.substr(0, decimPos1); decimPos1 = -1; }
	if (decimPos2 == num2.length - 1) { num2 = num2.substr(0, decimPos2); decimPos2 = -1; }
	int1 = (decimPos1 == 0)?"0":num1.substr(0, decimPos1);
	frac1 = num1.substr(decimPos1 + 1);
	int2 = (decimPos2 == 0)?"0":num2.substr(0, decimPos2);
	frac2 = num2.substr(decimPos2 + 1);
	if (decimPos1 == -1 && decimPos2 == -1) return addInt(num1, num2);
	else if (decimPos2 == -1) return addInt(int1, num2) + "." + frac1;
	else if (decimPos1 == -1) return addInt(num1, int2) + "." + frac2;
	else {
		decimalDiff = frac1.length - frac2.length;
		if (decimalDiff > 0) frac2 += addZeros(decimalDiff);
		else if (decimalDiff < 0) frac1 += addZeros(0 - decimalDiff);
		return addInt(int1, int2) + "." + addInt(frac1, frac2);
	}
}
function addSigned(num1, num2) { 
	var isNeg1 = num1.charAt(0) == "-", isNeg2 = num2.charAt(0) == "-";
	if (!isNeg1 && !isNeg2) return addReal(num1, num2);
	else if (!isNeg2) return subtract(num2, num1.substr(1));
	else if (!isNeg1) return subtract(num1, num2.substr(1));
	else return "-" + addReal(num1.substr(1), num2.substr(1));
}
function subtract(num1, num2) {
	if (larger(num1, num2) == num2) return "-" + subtract(num2, num1);
	var subAns = "", sCarry = 0, subDigit, decPos1, decPos2, decimLengthDiff;
	var len1 = num1.length, len2 = num2.length;
	decPos1 = num1.indexOf(".") + 1, decPos2 = num2.indexOf(".") + 1;
	if (decPos1 || decPos2) {
		if (!decPos1) num1 += "." + addZeros(len2 - decPos2);
		else if (!decPos2) { subAns = num1.substr(decPos1-1); num1 = num1.substr(0, decPos1-1);
		} else {
			decimLengthDiff = (len1 - decPos1) - (len2 - decPos2);
			if (decimLengthDiff > 0) num2 += addZeros(decimLengthDiff);
			else if (decimLengthDiff < 0) num1 += addZeros(0 - decimLengthDiff);
		}
	}
	len1 = num1.length, len2 = num2.length;
	for (var i=1;i<=len2;i++) {
		if (num2.charAt(len2 - i) == ".") subAns = "." + subAns;
		else {
			subDigit = +num1.charAt(len1-i)-sCarry-(+num2.charAt(len2-i));
			if (subDigit < 0) { subDigit += 10; sCarry = 1; }
			else sCarry = 0;
			subAns = subDigit + subAns;
		}
	}
	if (len1 > len2) { 
		if (sCarry == 0) subAns = num1.substr(0, len1-len2) + subAns;
		else subAns = subtract(num1.substr(0, len1-len2), "1") + subAns;
	}
	while (!subAns.indexOf("0")) subAns = subAns.substr(1);
	return subAns;
}
function multiply1(digit, num) { // accepts an integer digit
	var multAns1 = "", mCarry = 0, currentMultDigit;
	if (digit < 2) { return (digit)?num:0; }
	for (var i2=num.length-1;i2>=0;i2--) {
		currentMultDigit = (+mCarry) + digit*(+num.charAt(i2));
		mCarry = (currentMultDigit>9)?String(currentMultDigit).charAt(0):0;
		multAns1 = (currentMultDigit % 10) + multAns1;
	}
	return (+mCarry > 0)?mCarry+multAns1:multAns1;
}
function addZeros(numTimes) { // accepts an integer numTimes
	var zeroStr = "";
	while (numTimes > 0) { zeroStr += "0"; numTimes--; }
	return zeroStr;
}
function multiplyInt(num1, num2) {
	var multArr = ["0"], larger2, smaller2;
	larger2 = (num1.length < num2.length)?num2:num1;
	smaller2 = (larger2 == num1)?num2:num1;
	for (var k=1;k<=smaller2.length;k++) {
		multArr[k] = multiply1(+smaller2.charAt(smaller2.length-k), larger2) + addZeros(k-1);
	}
	return addArr(multArr);
}
function addNum(num1, num2, base) { // accepts an integer base (> 1)
	var addAns1 = "", aCarry = 0, currentAddDigit, larger1, smaller1, lengthDiff, len1, len2;
	larger1 = (num1.length < num2.length)?num2:num1;
	smaller1 = (larger1 == num1)?num2:num1;
	len1 = larger1.length, len2 = smaller1.length;
	lengthDiff = len1 - len2;
	for (var i1=1;i1<=len2;i1++) {
		currentAddDigit = aCarry + (+larger1.charAt(len1-i1)) + (+smaller1.charAt(len2-i1));
		aCarry = (currentAddDigit >= base)?1:0;
		if (aCarry == 1) { currentAddDigit -= base; } 
		addAns1 = currentAddDigit + addAns1;
	}
	if (lengthDiff === 0) { if (aCarry > 0) { addAns1 = aCarry + addAns1; } }
	else if (aCarry === 0) { addAns1 = larger1.substr(0, lengthDiff) + addAns1; }
	else { addAns1 = addNum(larger1.substr(0, lengthDiff), "1", base) + addAns1; }
	return addAns1;
}
function multiplyBin(num1, num2) {
	var multAns = "0";
	for (var k=num2.length-1;k>=0;k--) {
		if (num2.charAt(k) == 1) multAns = addNum(num1+addZeros(num2.length-1-k), multAns, 2);
	}
	return multAns;
}
function multiplyDec(num1, num2) { // bug: reproducible, when used in calculating factorial(1001)
	var multAns = "0", tmp;
	for (var k=num2.length-1;k>=0;k--) {
		tmp = num2.charAt(k);
		if (tmp) multAns = addInt(multiply1(tmp, num1)+addZeros(num2.length-1-k), multAns);
	}
	return multAns;
}
function multArr(arr) { // accepts an array
	var multAns2 = "1";
	for (var index=0;index<arr.length;index++) {
		multAns2 = multiplyInt(multAns2, arr[index]);
	}
	return multAns2;
}
function multiplyReal(num1, num2) {
	var decimPos1 = num1.indexOf("."), decimPos2 = num2.indexOf("."), tmpAns;
	if (decimPos1 == num1.length - 1) decimPos1 = -1;
	if (decimPos2 == num2.length - 1) decimPos2 = -1;
	if (decimPos1 == 0) { num1 = "0" + num1; decimPos1++; }
	if (decimPos2 == 0) { num2 = "0" + num2; decimPos2++; }
	tmpAns = multiplyInt(num1.replace(".", ""), num2.replace(".", ""));
	if (decimPos1 == -1 && decimPos2 == -1) return tmpAns;
	else if (decimPos1 == -1) decimPos1 = num1.length - 1;
	else if (decimPos2 == -1) decimPos2 = num2.length - 1;
	moveIndex = tmpAns.length - ((num1.length - decimPos1 - 1) + (num2.length - decimPos2 - 1));
	return tmpAns.substr(0, moveIndex) + "." + tmpAns.substr(moveIndex);
}
function powReal(base, exponent) { // accepts an integer exponent
	var powAns = "1";
	exponent = parseInt(exponent);
	if (exponent == 0) return powAns;
	while (exponent > 0) { powAns = multiplyReal(powAns, base); exponent--; }
	return powAns;
}
function baseValue(letter) {
	var letters = "abcdefghijklmnopqrstuvwxyz", value;
	letters = ("0123456789" + letters + letters.toUpperCase()).split('');
	for (var i=0;i<letters.length;i++) if (letter == letters[i]) return i;
}
function convertDec(num, base) { // accepts an integer base (> 1, != 10);
	var convDAns = "0", digit;
	for (i=0;i<num.length;i++) {
		digit = baseValue(num.charAt(num.length - 1 - i));
		if (digit) convDAns = addNum(convDAns, multiply1(digit, powReal(""+base, i)), 10);
	}
	return convDAns;
}
function convertBase(num, base) { // acccepts two integers num (base 10), base
	var convBAns = "";
	while (num > 0) { convBAns = (num % base) + convBAns; num = Math.floor(num/base); }
	return convBAns;
}
function makeFactArr(start, end) { // accepts two integers start, end
	var partialArr = [];
	for (var i=start;i<end;i++) partialArr.push(String(i));
	return partialArr;
}
function factorialBin(num) { // accepts an integer num
	var factBinAns = "1";
	for (var n=2;n<=num;n++) {
		factBinAns = multiplyBin(factBinAns, convertBase(n, 2));
	}
	return factBinAns;
}
function factorial3(n) { // accepts an integer n
	return (n < 2)?"1":multiplyInt(String(n), factorial(n - 1));
}
function factorial2(n) { // accepts an integer n
	if (n <= 100) return multArr(makeFactArr(1, n+1));
	var baseNum = 100/(String(n).length-2), cutOff = n - (n % baseNum), factArr = [];
	for (i=1;i<cutOff;i+=baseNum) {
		factArr[factArr.length] = multArr(makeFactArr(i,i+baseNum));
	}
	factArr[factArr.length] = multArr(makeFactArr(cutOff+1,n+1));
	return multArr(factArr);
}
function factorial(n) { // accepts an integer n
	if (typeof n == "string") alert("Please enter an integer, not a string.");
	else return multArr(makeFactArr(2, n+1));
}
function factorial_fast(n) {
	return (n<2)?1:n*factorial_fast(n-1);
}
function permute(n, r) {
	if (r == 0) return 1;
	var ans = 1;
	for (var i=(n-r+1);i<=n;i++) ans *= i;
	return ans;
}
function choose(n, k) {
	if (k > n || k < 0 || n < 1) return 0;
	if (k == n || k == 0) return 1;
	if (k == n - 1 || k == 1) return n;
	var k1 = Math.max(n - k, k), ans = 1;
	for (var i=(k1+1);i<=n;i++) ans *= i;
	if (ans == Infinity) {
		ans = "1";
		for (i=(k1+1);i<=n;i++) ans = multiplyReal(""+i/(i-k1), ans);
	} else ans /= factorial_fast(n - k1);
	return ans;
}
function sciNot(num) {
	var exp = 0, num0 = String(num), dPos, sign = num0.charAt(0) == "-" ? "-" : "";
	if (sign.length) num0 = num0.substr(1);
	num0 = num0.substr(num0.search(/[1-9\.]/));
	dPos = num0.indexOf(".");
	num0 = num0.replace(/\./g, "");
	if (num0.search(/[^0-9]/) + 1 || num0.search(/[1-9]/) < 0) { return num; }
	if (dPos == 0) {
		exp = -num0.search(/[1-9]/) - 1;
		num0 = num0.substr(-exp - 1);
	} else exp = (dPos < 0 ? num0.length : dPos) - 1;
	exp = exp == 0 ? "" : ((exp > 0 ? "e+" : "e") + exp);
	return sign + num0.charAt(0) + (num0.length > 1 ? ("." + num0.substr(1, 16)) : "") + exp;
}
function roundN(num, n) {
	var num1 = String(num), len = num1.length; decimPos = num1.indexOf(".");
	if (decimPos < 0 || decimPos > len - n || n >= len) return num;
	return +(num1.substr(0, decimPos+n) + Math.round((+num1.substr(decimPos+n, 2))/10));
}
function compare(num1, num2) {
	var msg = isEqual(num1, num2);
	if (!msg.search("0:")) msg = "The values are the same.";
	else if (!msg.search("-1:")) msg = "Num " + ((msg.search("2")+1)?2:1) + " is longer.";
	else msg="Num "+((msg.indexOf(":1")+1)?1:2)+" is larger: char "+msg.substr(0,msg.length-2);
	return msg;
}
function isEqual(num1, num2) {
	num1 = num1.split(''), num2 = num2.split('');
	if (num1.length != num2.length) return "-1:"+((num1.length>num2.length)?1:2);
	for (i=0;i<num1.length;i++) {
		if (num1[i]!=num2[i]) return i+1+":"+((+num1[i]>+num2[i])?1:2);
	}
	return "0:1";
}
function larger(num1, num2) {
	var decimalPos1 = num1.indexOf("."), decimalPos2 = num2.indexOf("."), compareInt, compareFrac;
	if (!(decimalPos1+1)&&!(decimalPos2+1)) return (isEqual(num1, num2).indexOf(":1")+1)?num1:num2;
	if (decimalPos1 == -1) { 
		compareInt = isEqual(num1, num2.substr(0, decimalPos2));
		compareFrac = ":2";
	} else if (decimalPos2 == -1) {
		compareInt = isEqual(num1.substr(0, decimalPos1), num2);
		compareFrac = ":1";
	} else {
		compareInt = isEqual(num1.substr(0, decimalPos1), num2.substr(0, decimalPos2));
		compareFrac = isEqual(num1.substr(decimalPos1+1), num2.substr(decimalPos2+1));
	}
	if (compareInt == "0:1" && compareFrac == "0:1") return num1;
	else if (compareInt != "0:1") return (compareInt.indexOf(":1")+1)?num1:num2;
	else return (compareFrac.indexOf(":1")+1)?num1:num2;
}
function parseHelper(expr1, expr2, operator) {
        var result; 
	operator = (operator!="a")?(operator!="m")?"pow":"multiply":"add";
	if (isNum(expr1)) expr1 = "'" + expr1 + "'";
	if (isNum(expr2)) expr2 = "'" + expr2 + "'";
	result = operator + "Real{" + expr1 + ", " + expr2 + "}";
	return result;
}
function parse(expr) {
	var oParens, cParens, addPos, multPos, expPos, op, opPos, output = "";
	expr = expr.closeParens();
	oParens = expr.indexOf("("), cParens = expr.indexOf(")");
	if (oParens == -1) {
		addPos=expr.indexOf("+")+1, multPos=expr.indexOf("*")+1, expPos=expr.indexOf("^")+1;
		if (addPos || multPos || expPos) {
			op=(addPos)?"a":(multPos)?"m":"e", opPos=(op=="a")?addPos:(op=="m")?multPos:expPos;
			output = parseHelper(parse(expr.substr(0,opPos-1)),parse(expr.substr(opPos)),op);
		} else output = expr;
	} else {
	        var openParens = 1, innerExpr, j;
		for (j=oParens+1;j<expr.length&&openParens>0;j++) {
	                if (expr.charAt(j) == ")") openParens--;
	                else if (expr.charAt(j) == "(") openParens++;
		}
                innerExpr = parse(expr.substring(oParens+1, j-1));
		output = parse(expr.substr(0, oParens) + innerExpr + expr.substr(j));
	}
	return output;
}
function parser(input) { // bug: reproducible, stack errors when using addSigned ("2-3+7-4")
	if (input.length < 2) return "";
	input = input.stripSpace().replace(/-/g, "+-");
	if (input.charAt(0) == "+") input = input.substr(1);
	var parsedOutput = parse(input).replace(/{/g, "(").replace(/}/g, ")");
	parsedOutput = parsedOutput.replace(/addReal/g, "addSigned"); alert(parsedOutput);
	return parsedOutput;
}
function isNum(num) {
	str = String(num);
	return (str.search(/[^0-9.-]/)+1||!str.length)?false:!isNaN(str);
}
function factor(num) { // Accepts a number < 10^17 and returns string of prime factors - not for bignum use
	// Bug (native to JS): some 16-digit numbers are also handled incorrectly, e.g. 9128349192738711
	var ans = "", i = 5, orig = String(num);
	if (orig.length > 16) return "Could not handle input correctly.";
	else if (orig.indexOf(".")+1) return "Please enter a positive integer.";
	else if (Math.abs(num) <= 1) return num;
	else if (num < 0) { num = Math.abs(num); ans = "-1*"; }
	// Special cases for 2 and 3, all other primes are congruent to +- 1 mod 6
	while (num % 2 == 0) { ans += "2*"; num /= 2; }
	while (num % 3 == 0) { ans += "3*"; num /= 3; }
	if (num > 1) {
		while (i <= Math.sqrt(num)) {
			if (num % i) i += (i%6-1?2:4);
			else { ans += i + "*"; num /= i; }
		}
		ans = ans + (num-1?num:"");
	}
	if (ans.charAt(ans.length-1) == "*") ans = ans.substr(0, ans.length-1);
	return (ans==orig?"prime":ans);
}
function roundErr(num) {
	num = String(num);
	if (isNaN(num) || num.length > 19) return num;
	var dPos = num.search(/[.]/), errorPos = num.search(/0{7,}|9{7,}/), num0 = num.replace(/[.]/, "");
	if (dPos+1 && dPos < errorPos) {
		num1 = String(Math.round(+num0.substr(0, errorPos)+"."+num0.substr(errorPos)));
		return +(num1.substr(0, dPos)+"."+num1.substr(dPos));
	} else return +num;
}
function sqRt(c) {
	var p, u = '';
	if (c < 0) {
		c = -c;
		u = 'i';
		if (c == 1) return u;
	} else {
		if (!c) return 0;
	}
	p = Math.sqrt(c);
	return p+u;
}
function gcd(a, b) { // Euclidean algorithm gcd - not for bignum use
	if (b > a) { var temp = a; a = b; b = temp; }
	if (b == 1) return 1;
	var r = 0;
	while (b > 1) {
		r = a % b;
		a = b;
		b = r;		
	}
	return r ? r : a;
}
function integral(expr, a, b, step) { // Simpson's rule for integration - not for bignum use
	expr = String(expr);
	if (expr.search(/x/) < 0) return;
	with (Math) {
	var n, dx, x, result = 0, coeff = 1;
	n = arguments[3] || 10000;
	dx = (b - a)/n;
	f_b = eval("x="+b+";"+expr), f_a = eval("x="+a+";"+expr);
	for (var i=0;i<=n;i++) {
		coeff = 2*(1 + i % 2);
		result += coeff*eval(expr);
		x += dx;
	}
	return dx/3*(result - f_a - f_b);
	}
}

// Adds constants and scientific functions (not for bignum use) to Math object
Math.pi = '3.1415926535897932384626433832795028841971693993751';
Math.e = '2.718281828459045235360287471352662497757247093699960';
/*Math.c = '299792458';
Math.k = '1.3806503e23';
Math.h = '6.62606896e-34';*/
Math.ln = function(x) { return Math.log(x); }
Math.sinh = function(x) { return 0.5*(Math.exp(x)-Math.exp(-x)); }
Math.cosh = function(x) { return 0.5*(Math.exp(x)+Math.exp(-x)); }
Math.tanh = function(x) { return Math.sinh(x)/Math.cosh(x); }
Math.coth = function(x) { return 1/Math.tanh(x); }
Math.sech = function(x) { return 1/Math.cosh(x); }
Math.csch = function(x) { return 1/Math.sinh(x); }
Math.arsinh = Math.arcsinh = Math.asinh = function(x) { return Math.log(x + Math.sqrt(x*x + 1)); }
Math.arcosh = Math.arccosh = Math.acosh = function(x) { return Math.log(x + Math.sqrt(x*x - 1)); }
Math.artanh = Math.arctanh = Math.atanh = function(x) { return 0.5*Math.log((1 + x)/(1 - x)); }
Math.arcoth = Math.arccoth = Math.acoth = function(x) { return Math.atanh(1/x); }
Math.arsech = Math.arcsech = Math.asech = function(x) { return Math.acosh(1/x); }
Math.arcsch = Math.arccsch = Math.acsch = function(x) { return Math.asinh(1/x); }
Math.arcsin = function(x) { return Math.asin(x); }
Math.arccos = function(x) { return Math.acos(x); }
Math.arctan = function(x) { return Math.atan(x); }
Math.arccot = function(x) { return Math.atan(1/x); }
Math.arcsec = function(x) { return Math.acos(1/x); }
Math.arccsc = function(x) { return Math.asin(1/x); }

// The rest of this file contains miscellaneous helper functions
function get(id) { return document.getElementById(id); }
String.prototype.closeParens = function() {
	var str = String(this);
	if (str.indexOf("(") < 0) return str;
	var numParensDiff = str.match(/\(/g).length;
	if (str.indexOf(")") > 0) numParensDiff -= str.match(/\)/g).length;
	while (numParensDiff > 0) { str += ")"; numParensDiff--; }
	return str;
}
String.prototype.stripSpace = function() { return this.replace(/ +/g, ""); }
String.prototype.chop = function(n) { return this.substr(0, this.length - n); }
String.prototype.tail = function(n) { return this.substr(this.length - n); }
String.prototype.endStr = function(str) {
	var pos = this.length - String(str).length;
	return (pos<0?false:this.substr(pos)==str);
}
function getNext(n, curr, cycle) {
	return cycle ? (curr + n) % n : Math.max(0, Math.min(n - 1, curr));
}
function isInArr(arr, str) {
	return ('|'+arr.join('|')+'|').indexOf('|'+str+'|') + 1;
}
function getType(obj) { // More accurate than typeof for arrays, regexes, and DOM elements
	if (obj == undefined || obj == null) return String(obj);
	else if (obj.constructor == undefined) return typeof obj;
	else {
		var construct = String(obj.constructor);
		construct = construct.split(/\s/)[+!(construct.search(/\s/)<0)];
		return construct.replace(/[^a-zA-Z]/g, "").toLowerCase();
	}
}
function isIdentical(obj1, obj2) { // Determines if two objects are identical
	try { return (obj1.length != obj2.length)?false:obj1.join('|') == obj2.join('|'); }
	catch(e) { return obj1 === obj2; }
}
function naturalSort(a, b) { // Human-perceived natural sort
	if (typeof a == "string") a = a.toLowerCase();
	if (typeof b == "string") b = b.toLowerCase();
	return (a==b?0:2*(a>b)-1); //Changes true to -1, false to 1
}
function getAll(obj, filter, doSort) { // Accepts a string as an optional filter
	var arr = [], x;
	if (!filter || typeof filter != "string") for (x in obj) arr.push(x);
	else for (x in obj) if (!String(x).search(new RegExp(filter, "i"))) arr.push(x);
	return doSort === false ? arr : arr.sort(naturalSort);
}
function query(obj, s) {
	var tags = ["", "Type: ", "Constructor: ", "Methods/Properties: "], info = [obj], result = "";
	try { info.push(typeof obj); } catch(e) { info.push(""); }
	try { info.push(obj.constructor); } catch(e) { info.push(""); }
	try { info.push(getAll(obj, s)); } catch(e) { info.push(""); }
	for (var i=0;i<tags.length;i++) result += tags[i] + info[i] + "\n";
	return result;
}
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
function loadScript(path) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = path;
	document.head.appendChild(script);
}
function loadBgImage(src) {
	if (!get('bgImage_js_unique')) {
		var bg = document.createElement("img");
		bg.id = 'bgImage_js_unique';
		//document.body.style.overflow = "hidden";
		bg.style.position = "absolute";
		bg.style.top = bg.style.left = "0px";
		bg.style.width = bg.style.height = "100%";
		bg.style.zIndex = -10;
		document.body.appendChild(bg);
	} get('bgImage_js_unique').src = src;
}