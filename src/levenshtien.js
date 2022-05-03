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
    let left = 0, right = 1;
    let takingRight = true;
    let twoEquals = false;
    let lastMoves = [0, 0];
    while(keep){
        let newDist = lev_distance(search, content.substring(left, content.length - right));
        if(newDist < oldDist){
            if(takingRight){
                right++;
                lastMoves = [0, 1];
            }else{
                left++;
                lastMoves = [1, 0];
            }
            oldDist = newDist;
            twoEquals = false;
        }else if(newDist === oldDist){
            if(takingRight){
                if(!twoEquals){
                    left++;
                    right--;
                    lastMoves = [1, -1];
                }else{
                    left++;
                    lastMoves = [1, 0];
                    takingRight = false;
                }
            }else{
                left--;
                right++;
                lastMoves = [-1, 1];
                takingRight = true;
            }
            twoEquals = true;
        }else{
            if(twoEquals&&takingRight){
                left -= lastMoves[0];
                right -= lastMoves[1];
                keep = false;
            }else if(takingRight){
                left++;
                right--;
                lastMoves = [1, -1];
                takingRight = !takingRight;
            }else{
                left -= lastMoves[0];
                right -= lastMoves[1];
                keep = false;
            }
            twoEquals = false;
        }
    }
    let match = [];
    match[0] = content.substring(left, content.length - right);
    match['input'] = search;
    match['size'] = match[0].length;
    match['percent'] = (1 - (oldDist/Math.max(search.length, match.size))) * 100;
    match['changes'] = oldDist;
    match['index'] = left;
    match['endIndex'] = content.length - right;
    match['length'] = 4;
    return match;
}