const canvas = document.getElementById('levCanvas');
const ctx = canvas.getContext('2d');
canvas.style.backgroundColor = 'white';
const border = 10;





let lev = levenshteinDist('ad hello', 'dsf ad heldlo asdf');
// console.log(lev);


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
    let findClosest = function(matrix){
        let leastChange = Math.min(...distance[rows-1]);
        let indexes = [];
        let lcind = matrix[rows-1].indexOf(leastChange);
        let i = matrix.length - 1;
        while(i>0){
            if(Math.min(matrix[i][lcind], matrix[i][lcind-1])===matrix[i][lcind]){
                lcind = lcind;
                indexes.push(lcind);
        }else{
                indexes.push(lcind);
                lcind = lcind - 1;
                indexes.push(lcind);

            }
            i--;
            lcind--;
        }
        return [indexes[indexes.length-1]-1, indexes[0]];
    }

    createMatrix(rows, cols, distance);
    transMatrix(distance);
    // findClosest(distance);


    // let stg = '0   0   '+ test.split('').join('   ') + '\n';
    // for(let i = 0;i<distance.length;i++){
    //     for(let k = 0;k<distance[i].length;k++){
    //         stg += (k===0?(i===0?0:search[i-1])+'   ':'') + distance[i][k] + (distance[i][k]>9?'  ':'   ');
    //     }
    //     stg += '\n';
    // }
    // console.log(stg);

    if(ratio_calc){
        return ((search.length + test.length) - distance[rows-1][cols-1]) / (search.length + test.length)
    }else{
        return {
            likely: distance[rows-1][cols-1],
            closest: findClosest(distance)
        }
    }
}