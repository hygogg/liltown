function setCookie(key, val, tmp) {
    tmp = key + "=" + escape(val) + "; ";
    // tmp += "path=" + location.pathname + "; ";
    tmp += "expires=Tue, 31-Dec-2030 23:59:59; ";
    document.cookie = tmp;
};

function getCookie(key,  tmp1, tmp2, xx1, xx2, xx3) {
    tmp1 = " " + document.cookie + ";";
    xx1 = xx2 = 0;
    len = tmp1.length;
    while (xx1 < len) {
        xx2 = tmp1.indexOf(";", xx1);
        tmp2 = tmp1.substring(xx1 + 1, xx2);
        xx3 = tmp2.indexOf("=");
        if (tmp2.substring(0, xx3) == key) {
            return(unescape(tmp2.substring(xx3 + 1, xx2 - xx1 - 1)));
        }
        xx1 = xx2 + 1;
    }
    return("");
};

function clearCookie(key) {
    document.cookie = key + "=" + "xx; expires=Tue, 1-Jan-1980 00:00:00;";
};