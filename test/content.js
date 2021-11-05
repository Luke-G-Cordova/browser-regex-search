
var popup = document.createElement('iframe');
popup.style.visibility = 'hidden';
popup.style.border = 'none';
popup.setAttribute('src', chrome.runtime.getURL('popup.html'));
popup = document.body.appendChild(popup);


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    console.log('got message');
    if((msg.from === 'background') && (msg.subject === 'open_popup')){
        showPopup();
    }
});

function showPopup(){
    if(popup.style.visibility === 'hidden'){
        popup.style.visibility = 'visible';
        ogWindow = window.scrollY;
    }else{
        popup.style.visibility = 'hidden';
    }
}


let dist = levenshteinDist('Token', 'jhk Token sad Token asd token fe', true);
console.log(dist);
function levenshteinDist(search, test, ratio_calc = false){
    let rows = search.length + 1;
    let cols = test.length + 1;
    let distance = new Array(rows);
    
    // setup initial matrix
    let createMatrix = function(rows, cols, matrix){
        for(let i = 0;i<rows;i++){
            matrix[i] = new Array(cols).fill(0, 0, cols);
        }
        for(let i = 0;i<matrix.length;i++){
            matrix[i][0] = i;
            for(let k = 0;k<matrix[i].length;k++){
                matrix[0][k] = k;
            }
        }
    }

    // preform levenshtein algorithm on matrix
    let transMatrix = function(matrix){
        let cost;
        for(let i = 1;i<rows;i++){
            for(let k = 1;k<cols;k++){
                if(search[i-1] === test[k-1]){
                    cost = 0;
                }else if(ratio_calc){
                    cost = 2;
                }else{
                    cost = 1;
                }
                matrix[i][k] = Math.min(
                    matrix[i-1][k] + 1, 
                    matrix[i][k-1] + 1,
                    matrix[i-1][k-1] + cost
                );
            }
        }
    }
    createMatrix(rows, cols, distance);
    transMatrix(distance)
    console.log(distance);

    // get indexes of likely matches
    let leastChange = Math.min(...distance[rows-1]);
    let lcind = distance[rows-1].indexOf(leastChange);
    for(let i = 1, k = 0;i<=rows; i++, k++){
        console.log(distance[rows-i][lcind-k]);
    }

    if(ratio_calc){
        return ((search.length + test.length) - distance[rows-1][cols-1]) / (search.length + test.length)
    }else{
        return distance[rows-1][cols-1];
    }
}