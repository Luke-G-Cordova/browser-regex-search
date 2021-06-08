
const word = 'the';

// console.log(document.querySelector('body').classList.toString())
highlight();

function highlight(){
    var needEachDom = ['a', 'p', 'span', 'h1','div', 'font', 'li'];
    for (var i = 0; i < needEachDom.length; i++) {
        var dom = needEachDom[i];
        var searchText = word;
        changeDom(dom, searchText);
    }
}

function changeDom(domStr, searchText){
    var regExp = new RegExp(searchText, 'g');
    document.querySelectorAll(domStr).forEach((elm) => {
        var html = elm.innerHTML;
        var text = elm.innerText;

        var hOffset = html.indexOf(text);

        var tOffset = text.indexOf(searchText);

        

        if(hOffset !== -1&&tOffset !== -1){
            console.log(`hset: ${hOffset}, tset: ${tOffset}, both: ${hOffset+tOffset}, indexof: ${html.indexOf(searchText)}`);
            console.log(html.substring(html.indexOf(hOffset+tOffset), html.length));
            console.log(text.substring(text.indexOf(searchText), text.length));

            // var newHtml = html.replace(searchText, '<font>'+searchText+'</font>');
            // elm.innerHTML = newHtml;
        }
    });
}


