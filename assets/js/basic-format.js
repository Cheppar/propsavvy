function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 ;//+ x2;
}
function formatDate(date)
{
	var d=new Date(date.split("/").reverse().join("-"));
	var dd=d.getDate();
	var mm=d.getMonth()+1;
	var yy=d.getFullYear();
	return dd+"/"+mm+"/"+yy;
}

function formatWeb(web) {
        if (  (web.length >=5) && (web.substr(0, 5) != 'http:') && (web.substr(0, 5) != 'https') ) {
            return 'http://' + web;
        }else{
             return web;
        }
    }