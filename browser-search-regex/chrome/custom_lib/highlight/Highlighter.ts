interface HighlightOptions {
  regex: RegExp | string;
  excludes: string[];
  limit: number;
}

namespace Highlighter {
  export const clearHighlight = (keys: string[] | string) => {
    let elements: Array<Node>;
    let nodes: Array<ChildNode>;
    let keysArray = Array<string>.prototype.concat(keys);

    for (let j = 0; j < keysArray.length; j++) {
      elements = Array.from(
        document.querySelectorAll(
          `highlight-me.chrome-regeggz-highlight-me.${keysArray[j]}`
        )
      );

      for (let i = 0; i < elements.length; i++) {
        nodes = Array.from(elements[i].childNodes);
        let nodesFragment = document.createDocumentFragment();
        for (let node in nodes) {
          nodesFragment.appendChild(nodes[node]);
        }
        elements[i].parentNode?.replaceChild(nodesFragment, elements[i]);
        elements[i] = nodes[0];
        nodes[0].parentNode?.normalize();
      }
    }
  };

  export const highlight = (
    root: HTMLElement,
    options: HighlightOptions = {
      regex: '',
      excludes: [],
      limit: 1000,
    },
    callback: (match: string, id: number) => HTMLElement
  ) => {
    options.excludes = [
      'script',
      'style',
      'iframe',
      'canvas',
      'noscript',
    ].concat(options.excludes);

    var tw = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      function (node: Node): number {
        if (!(node instanceof CharacterData)) return NodeFilter.FILTER_ACCEPT;
        if (
          node.data.trim() === '' ||
          isDescendant(options.excludes, node) ||
          // excludes.indexOf(node.parentNode.tagName.toLowerCase()) > -1 ||
          !node.parentElement?.offsetParent
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    );

    const isDescendant: any = (tags: string[], node: any) => {
      if (
        node !== document.body &&
        tags.indexOf(node.parentNode.tagName.toLowerCase()) === -1
      ) {
        return isDescendant(tags, node.parentNode);
      }
      return node !== document.body;
    };

    const trimBadHtmlNodes = (node: any) => {
      if (node.data.indexOf('\n') !== -1) {
        let before = '';
        let after = '';
        after =
          node.data[node.data.length - 1] === ' ' ||
          node.data[node.data.length - 1] === '\n'
            ? ' '
            : '';
        before = node.data[0] === ' ' || node.data[0] === '\n' ? ' ' : '';
        node.data = before + node.data.trim() + after;
      }
    };

    const getLastBlockElem = (node: any) => {
      let elem = node.parentElement;
      while (window.getComputedStyle(elem, '').display != 'block') {
        elem = elem.parentElement;
        if (elem === root) return null;
      }
      return elem;
    };

    var nodes: Node[] = [];
    var groupedNodes: any = [];
    while (tw.nextNode()) {
      trimBadHtmlNodes(tw.currentNode);
      if (groupedNodes.length === 0) {
        groupedNodes.push([]);
        groupedNodes[groupedNodes.length - 1].push(tw.currentNode);
      } else {
        if (
          getLastBlockElem(nodes[nodes.length - 1]) ===
          getLastBlockElem(
            tw.currentNode
          ) /*relativeNodes(tw.currentNode, lastElem)*/
        ) {
          groupedNodes[groupedNodes.length - 1].push(tw.currentNode);
        } else {
          groupedNodes[groupedNodes.length] = [];
          groupedNodes[groupedNodes.length - 1].push(tw.currentNode);
        }
      }
      nodes.push(tw.currentNode);
    }
    var masterStr = '';
    var test: RegExpExecArray | null;
    var test2: any;
    var tag;
    var newNode;
    var insertedNode: any;
    var count = 0;
    var nodeList: any[] = [];

    var groupedNodesLength = groupedNodes.length;
    for (
      let i = 0;
      i < groupedNodesLength && nodeList.length < options.limit;
      i++
    ) {
      masterStr = groupedNodes[i].map((elem: any) => elem.data).join('');

      if (typeof options.regex !== 'string') {
        while (
          (test = options.regex.exec(masterStr)) &&
          test[0] !== '' &&
          nodeList.length < options.limit
        ) {
          var lastRegIndex = options.regex.lastIndex;

          count++;

          var j = 0;
          var nodeParts = '' + groupedNodes[i][j].data;

          var testIndex = test.index;
          while (testIndex > nodeParts.length - 1) {
            j++;
            nodeParts = nodeParts + groupedNodes[i][j].data;
          }

          options.regex.lastIndex = 0;

          test2 = options.regex.exec(groupedNodes[i][j].data);

          var inThisNode = nodeParts.substring(testIndex);

          test2 ||
            ((test2 = []),
            (test2[0] = inThisNode),
            (test2['index'] =
              groupedNodes[i][j].data.length - inThisNode.length),
            (test2['input'] = groupedNodes[i][j].data),
            (test2['groups'] = undefined));

          var helpArr: string[] = [];

          helpArr.push(test2[0]);

          var sameMatchID = 0;
          nodeList.push([]);
          for (let k = 0; helpArr.join('').length < test[0].length; k++) {
            newNode = groupedNodes[i][j].splitText(
              groupedNodes[i][j].length - helpArr[k].length
            );
            tag = callback(helpArr[k], sameMatchID);
            newNode.data = '';
            insertedNode = newNode.parentNode.insertBefore(tag, newNode);
            nodeList[nodeList.length - 1].push(insertedNode);
            if (groupedNodes[i][j].data.length === 0) {
              groupedNodes[i][j] = insertedNode.firstChild;
            } else {
              groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
              j++;
            }
            j++;
            sameMatchID++;
            helpArr.push(groupedNodes[i][j].data);
          }
          var lastNode = helpArr.pop();
          if (helpArr[0] && lastNode != null) {
            newNode = groupedNodes[i][j].splitText(0);
            tag = callback(
              lastNode.substring(0, test[0].length - helpArr.join('').length),
              -1
            );
            newNode.data = newNode.data.substr(
              test[0].length - helpArr.join('').length
            );
            insertedNode = newNode.parentNode.insertBefore(tag, newNode);
            nodeList[nodeList.length - 1].push(insertedNode);

            groupedNodes[i][j] = insertedNode.firstChild;
            if (newNode.data.length > 0) {
              groupedNodes[i].splice(j + 1, 0, newNode);
            }
            sameMatchID++;
          } else {
            newNode = groupedNodes[i][j].splitText(test2.index);

            tag = callback(test2[0], -1);
            newNode.data = newNode.data.substr(test2[0].length);
            insertedNode = newNode.parentNode.insertBefore(tag, newNode);

            nodeList[nodeList.length - 1].push(insertedNode);

            if (groupedNodes[i][j].data === '') {
              if (newNode.data === '') {
                groupedNodes[i].splice(j, 1, insertedNode.firstChild);
              } else {
                groupedNodes[i].splice(j, 1, insertedNode.firstChild, newNode);
              }
            } else {
              if (newNode.data === '') {
                groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
              } else {
                groupedNodes[i].splice(
                  j + 1,
                  0,
                  insertedNode.firstChild,
                  newNode
                );
              }
            }
          }
          nodeParts = '';
          options.regex.lastIndex = lastRegIndex;
        }
        options.regex.lastIndex = 0;
      } else {
        let match = findClosestMatch(options.regex, masterStr);
        if (match.percent > 80) {
          count++;

          var j = 0;
          var nodeParts = '' + groupedNodes[i][j].data;

          while (match.index > nodeParts.length - 1) {
            j++;
            nodeParts = nodeParts + groupedNodes[i][j].data;
          }
          let nodeStartIndex =
            match.index - (nodeParts.length - groupedNodes[i][j].data.length);
          var sameMatchID = 0;

          nodeList.push([]);
          if (nodeStartIndex + match.size <= groupedNodes[i][j].data.length) {
            newNode = groupedNodes[i][j].splitText(nodeStartIndex);
            tag = callback(match[0], sameMatchID);
            newNode.data = newNode.data.substring(match.size);
            insertedNode = newNode.parentNode.insertBefore(tag, newNode);
            nodeList[nodeList.length - 1].push(insertedNode);
            if (groupedNodes[i][j].data.length === 0) {
              groupedNodes[i][j] = insertedNode.firstChild;
            } else {
              groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
              j++;
            }
            j++;
            sameMatchID++;
          } else {
            var helpStr = '';
            newNode = groupedNodes[i][j].splitText(nodeStartIndex);
            helpStr += newNode.data;
            tag = callback(newNode.data, sameMatchID);
            newNode.data = '';
            insertedNode = newNode.parentNode.insertBefore(tag, newNode);
            nodeList[nodeList.length - 1].push(insertedNode);
            if (groupedNodes[i][j].data.length === 0) {
              groupedNodes[i][j] = insertedNode.firstChild;
            } else {
              groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
              j++;
            }
            j++;
            sameMatchID++;

            while ((helpStr + groupedNodes[i][j].data).length < match.size) {
              helpStr += groupedNodes[i][j].data;
              newNode = groupedNodes[i][j].splitText(0);
              tag = callback(newNode.data, sameMatchID);
              newNode.data = '';
              insertedNode = newNode.parentNode.insertBefore(tag, newNode);
              nodeList[nodeList.length - 1].push(insertedNode);
              if (groupedNodes[i][j].data.length === 0) {
                groupedNodes[i][j] = insertedNode.firstChild;
              } else {
                groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
                j++;
              }
              sameMatchID++;
              j++;
            }

            newNode = groupedNodes[i][j].splitText(0);
            tag = callback(
              newNode.data.substring(0, match.size - helpStr.length),
              sameMatchID
            );
            newNode.data = newNode.data.substring(match.size - helpStr.length);
            insertedNode = newNode.parentNode.insertBefore(tag, newNode);
            nodeList[nodeList.length - 1].push(insertedNode);
            if (groupedNodes[i][j].data.length === 0) {
              groupedNodes[i][j] = insertedNode.firstChild;
            } else {
              groupedNodes[i].splice(j + 1, 0, insertedNode.firstChild);
            }
            sameMatchID++;
          }
        }
      }
    }
    return {
      count,
      elements: nodeList,
    };
  };

  export const lev_distance = (str1: string, str2: string) => {
    let mat = [];
    mat.length = str1.length + 1;
    for (let i = 0; i <= str1.length; i++) {
      mat[i] = [i];
    }
    for (let i = 1; i <= str2.length; i++) {
      mat[0][i] = i;
    }
    for (let i = 1; i < mat.length; i++) {
      for (let j = 1; j < mat[0].length; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          mat[i][j] = mat[i - 1][j - 1];
        } else {
          mat[i][j] =
            Math.min(mat[i - 1][j], mat[i - 1][j - 1], mat[i][j - 1]) + 1;
        }
      }
    }
    return mat[mat.length - 1][mat[mat.length - 1].length - 1];
  };

  export const lev_distance_matrix = (str1: string, str2: string) => {
    let mat = [];
    mat.length = str1.length + 1;
    for (let i = 0; i <= str1.length; i++) {
      mat[i] = [i];
    }
    for (let i = 1; i <= str2.length; i++) {
      mat[0][i] = i;
    }
    for (let i = 1; i < mat.length; i++) {
      for (let j = 1; j < mat[0].length; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          mat[i][j] = mat[i - 1][j - 1];
        } else {
          mat[i][j] =
            Math.min(mat[i - 1][j], mat[i - 1][j - 1], mat[i][j - 1]) + 1;
        }
      }
    }
    return mat;
  };

  export const findClosestMatch = (str1: string, str2: string) => {
    let mat = lev_distance_matrix(str1, str2);

    let i, j;
    for (
      j = mat[mat.length - 1].length - 2;
      j >= 1 && mat[mat.length - 1][j] < mat[mat.length - 1][j + 1];
      j--
    );
    j += 1;
    let nStr2 = str2.substring(0, j);
    const len1 = str1.length;
    const len2 = nStr2.length;
    let rStr1 = '',
      rStr2 = '';
    for (let k = len1 - 1; k >= 0; k--) rStr1 = rStr1 + str1[k];
    for (let k = len2 - 1; k >= 0; k--) rStr2 = rStr2 + nStr2[k];

    let mat2 = lev_distance_matrix(rStr1, rStr2);
    for (
      i = mat2[mat2.length - 1].length - 2;
      i >= 1 && mat2[mat2.length - 1][i] < mat2[mat2.length - 1][i + 1];
      i--
    );
    i += 1;
    i = rStr2.length - i;

    let changes = lev_distance(str1, str2.substring(i, j));
    let match: any = [];
    match[0] = str2.substring(i, j);
    match['input'] = str1;
    match['size'] = match[0].length;
    match['percent'] = (1 - changes / Math.max(str1.length, match.size)) * 100;
    match['changes'] = changes;
    match['index'] = i;
    match['endIndex'] = j;
    match['length'] = 6;
    return match;
  };
}
