

function lev_distance(str1, str2){
    let mat = [];
    mat.push([0]);
    for(let index in str2){
        mat[0].push(Number(index)+1);
    }
    for(let index in str1){
        mat.push([Number(index)+1]);
    }

    for(let i = 1;i<mat.length;i++){
        for(let j = 1;j<mat[0].length;j++){
            if(str1[i-1] === str2[j-1]){
                mat[i][j] = mat[i-1][j-1];
            }else{
                mat[i][j] = Math.min(mat[i-1][j], mat[i-1][j-1], mat[i][j-1]) + 1;
            }
        }
    }
    return mat[mat.length - 1][mat[mat.length - 1].length - 1];
}

let myStr1 = 'hillo';
let myStr2 = 'hello';

let dis = lev_distance(myStr1, myStr2);

dis = (1 - (dis/Math.max(myStr1.length, myStr2.length))) * 100;
console.log(dis + '%');