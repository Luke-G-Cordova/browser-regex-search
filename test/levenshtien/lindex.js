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
    console.log(str2);
    // return (1 - (dis/Math.max(str1.length, str2.length))) * 100;
    return dis;
}

// console.log(lev_distance('word', 't'));         // 4
// console.log(lev_distance('word', 'th'));        // 4
// console.log(lev_distance('word', 'the'));       // 4
// console.log(lev_distance('word', 'the '));      // 4
// console.log(lev_distance('word', 'the w'));     // 5
// console.log(lev_distance('word', 'he w'));      // 4
// console.log(lev_distance('word', 'he wo'));     // 5
// console.log(lev_distance('word', 'e wo'));      // 4
// console.log(lev_distance('word', 'e wor'));     // 3
// console.log(lev_distance('word', 'e word'));    // 2
// console.log(lev_distance('word', 'e word '));   // 3
// console.log(lev_distance('word', ' word '));    // 2
// console.log(lev_distance('word', ' word i'));   // 3
// console.log(lev_distance('word', 'word i'));    // 2
// console.log(lev_distance('word', 'word is'));   // 3

// let count = 0;
// let str = 'the word is';
// let bfI = 0, afI = 1;
// let lastDist = lev_distance('word', str.substring(bfI, afI));
// while(count < 14){
//     let dist = lev_distance('word', str.substring(bfI, afI));
//     if(dist === lastDist){
//         afI++;
//         lastDist = dist;
//     }else if(dist < lastDist){
//         afI++;
//     }else if(dist > lastDist){
//         bfI++;
//     }
//     console.log(dist);
//     count++;
// }

// console.log(lev_distance('word', 'the word is'));   // 7
// console.log(lev_distance('word', 'the word i'));    // 6
// console.log(lev_distance('word', 'the word '));     // 5
// console.log(lev_distance('word', 'the word'));      // 4
// console.log(lev_distance('word', 'the wor'));       // 5
// console.log(lev_distance('word', 'the word'));      // 4
// console.log(lev_distance('word', 'he word'));       // 3
// console.log(lev_distance('word', 'e word'));        // 2
// console.log(lev_distance('word', ' word'));         // 1
// console.log(lev_distance('word', 'word'));          // 0

function recurse(str1, str2){
    let dist = lev_distance(str1, str2);
    let newDist = recurse(str1, str2.substring(0, str2.length - 1));
    if(newDist < dist){
        return newDist;
    } else if(newDist > dist){
        newDist = recurse(str1.substring(1, str2));
    }
    return dist;
}


function findClosestMatch(search, content, minPercent = 50){
    let matches = [];
    let percent = 0;
    let bPercent = 0;

    for(let i = 0;i + search.length - 1 < content.length;i++){
        let curSelection = content.substring(i, i+search.length);
        percent = lev_distance(search, curSelection);
        if(percent >= bPercent){
            if(percent > bPercent){
                matches = [];
                bPercent = percent;
            }
            let end = 0;
            let nbPercent = bPercent;
            let lastPercent = bPercent;
            let longSelection;
            do{
                end++;
                lastPercent = nbPercent;
                nbPercent = percent;
                longSelection = content.substring(i, i+search.length + end);
                percent = lev_distance(search, longSelection);
            }while(percent > nbPercent);
            match = [];
            match[0] = content.substring(i, i + search.length + end - 1);
            match['size'] = match[0].length;
            match['percent'] = nbPercent;
            match['index'] = i;
            match['length'] = 4;
            matches.push(match);
        }
    }
    if(!matches[0] || matches[0].percent <= minPercent){
        return null;
    }
    matches = matches.reduce((prev, cur) => {
        if(prev.length === 0 || cur.percent === prev[0].percent){
            prev.push(cur);
        }else if(cur.percent > prev[0].percent){
            prev = [];
            prev.push(cur);
        }
        return prev;
    }, []);
    return matches;
}