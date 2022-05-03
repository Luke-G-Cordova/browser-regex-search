

function lev_distance(str1, str2){
    let mat = [];
    mat.length = str1.length+1;
    for(let i = 0;i<=str1.length;i++){
        mat[i] = [i];
    }
    for(let i = 1;i<=str2.length;i++){
        mat[0][i] = i;
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
function lev_distance_matrix(str1, str2){
    let mat = [];
    mat.length = str1.length+1;
    for(let i = 0;i<=str1.length;i++){
        mat[i] = [i];
    }
    for(let i = 1;i<=str2.length;i++){
        mat[0][i] = i;
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
    return mat;
}



function findClosestMatch(str1, str2){
    let mat = lev_distance_matrix(str1, str2);
    
    let i, j;
    for(j = mat[mat.length -1].length - 2; j>=1 && mat[mat.length -1][j] < mat[mat.length-1][j+1];j--);
    j+=1;
    let nStr2 = str2.substring(0, j);
    const len1 = str1.length;
    const len2 = nStr2.length;
    let rStr1 = '', rStr2 = '';
    for(let k = len1-1;k>=0;k--)rStr1 = rStr1 + str1[k];
    for(let k = len2-1;k>=0;k--)rStr2 = rStr2 + nStr2[k];

    let mat2 = lev_distance_matrix(rStr1, rStr2);
    for(i = mat2[mat2.length -1].length - 2; i>=1 && mat2[mat2.length -1][i] < mat2[mat2.length-1][i+1];i--);
    i+=1;
    i = rStr2.length - i;

    let changes = lev_distance(str1, str2.substring(i, j));
    let match = [];
    match[0] = str2.substring(i, j);
    match['input'] = str1;
    match['size'] = match[0].length;
    match['percent'] = (1 - (changes/Math.max(str1.length, match.size))) * 100;
    match['changes'] = changes;
    match['index'] = i;
    match['endIndex'] = j;
    match['length'] = 6;
    return match;
}