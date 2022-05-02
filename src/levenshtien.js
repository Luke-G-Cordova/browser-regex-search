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
    let dis = mat[mat.length - 1][mat[mat.length - 1].length - 1];
    return dis;
}


function findClosestMatch(search, content){
    let keep = true;
    let oldDist = lev_distance(search, content);
    let left = 1, right = 0;
    let takingLeft = true;
    while(keep){
        let newDist = lev_distance(search, content.substring(left, content.length - right));
        if(newDist < oldDist){
            if(takingLeft){
                left++;
            }else{
                right++;
            }
            oldDist = newDist;
        }else if(newDist === oldDist){
            if(takingLeft){
                right++;
            }
        }else{
            if(takingLeft){
                left--;
                right++;
                takingLeft = !takingLeft;
            }else{
                right--;
                keep = false;
            }
        }
    }
    let match = [];
    match[0] = content.substring(left, content.length - right);
    match['size'] = match[0].length;
    match['percent'] = (1 - (oldDist/Math.max(search.length, match.size))) * 100;
    match['index'] = left;
    match['length'] = 4;
    return match;
}
