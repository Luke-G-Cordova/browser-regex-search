

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
    return (1 - (dis/Math.max(str1.length, str2.length))) * 100;
}
function findClosestMatch(search, content){
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
            match['found'] = content.substring(i, i + search.length + end - 1);
            match['size'] = match['found'].length;
            match['percent'] = nbPercent;
            match['index'] = i;
            match['length'] = 4;
            matches.push(match);
        }
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