interface HighlightOptions {
  regex: RegExp | string;
  excludes: string[];
  limit: number;
}
interface ClosestMatch extends Array<string> {
  input: string;
  size: number;
  percent: number;
  changes: number;
  index: number;
  endIndex: number;
  length: number;
}
interface NodeParts {
  nodeParts: string;
  indexOfNodeThatMatchStartsIn: number;
}

namespace Highlighter {
  export const clearHighlight = (keys: string[] | string) => {
    let elements: Array<Node>;
    let nodes: Array<ChildNode>;
    let keysArray: Array<string> = Array.prototype.concat(keys);

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

    let tw = makeTreeWalker(options.excludes, root);

    let groupedNodes = makeGroupedNodeArray(tw, root);

    let masterStr = '';
    let test: RegExpExecArray | null;
    let test2: RegExpExecArray | null;
    let tag: HTMLElement;
    let newNode: Text;
    let insertedNode: Node | undefined;
    let amountOfSelectedMatches = 0;
    let nodeList: Node[][] = [];
    let groupedNodesLength = groupedNodes.length;

    // loop through all groups of nodes or until we have looped options.limit times
    for (
      let i = 0;
      i < groupedNodesLength && nodeList.length < options.limit;
      i++
    ) {
      // assign a pointer to the groupedNodes array that represents the current node for readability
      let curGroupOfNodes = groupedNodes[i];

      // get a string that is formed from a group of nodes
      masterStr = curGroupOfNodes.map((elem: Text) => elem.data).join('');

      let sameMatchID = 0;

      // determine wether or not the search string
      // is a regular expression or a string
      if (options.regex instanceof RegExp) {
        // loop through the matches in masterStr
        while (
          (test = options.regex.exec(masterStr)) &&
          test[0] !== '' &&
          nodeList.length < options.limit
        ) {
          // store the index of the last match
          let lastRegIndex = options.regex.lastIndex;
          amountOfSelectedMatches++;

          // find the node index j in curGroupOfNodes that the first match occurs in
          let { nodeParts, indexOfNodeThatMatchStartsIn: j } = getNodeParts(
            test.index,
            curGroupOfNodes
          );

          options.regex.lastIndex = 0;

          // try to find the whole match in the node the match first appears in
          test2 = options.regex.exec(curGroupOfNodes[j].data);

          // if match is in several nodes, test2 == null
          if (test2 == null) {
            // get the string that starts at the found match
            // and ends at the end of the containing nodes text
            let inThisNode = nodeParts.substring(test.index);

            test2 = makeCustomRegExpExecArray(
              inThisNode,
              curGroupOfNodes[j].data.length - inThisNode.length,
              curGroupOfNodes[j].data
            );

            let nodeGroup = insertOverSeveralNodes(
              test[0].length,
              test2[0],
              curGroupOfNodes,
              j,
              callback
            );

            nodeList.push(nodeGroup);
          } else {
            // else if the match occurs in only one node

            // create a tag
            tag = callback(test2[0], -1);

            let { insertedNode, insertedText, newNode } = replacePartOfNode(
              curGroupOfNodes[j],
              tag,
              test2.index,
              test2[0].length
            );

            // push the inserted node to the last group in nodeList
            nodeList.push([insertedNode]);

            // if the match occurred at the beginning of the node, curGroupOfNodes[j].data === ''
            // this means that we did not create a new node, we just replaced one and don't need to increment j
            if (curGroupOfNodes[j].data === '') {
              // if the match occurs across the rest of the node, newNode.data === ''
              // this means that we need to delete newNode from curGroupOfNodes because we added an empty node
              if (newNode.data === '') {
                // delete newNode from curGroupOfNodes and replace it with insertedNodes text
                curGroupOfNodes.splice(j, 1, insertedText);
              } else {
                // insert insertedNodes text into curGroupOfNodes while keeping newNode
                curGroupOfNodes.splice(j, 1, insertedText, newNode);
              }
            } else {
              if (newNode.data === '') {
                curGroupOfNodes.splice(j + 1, 0, insertedText);
              } else {
                curGroupOfNodes.splice(j + 1, 0, insertedText, newNode);
              }
            }
          }
          // replace the current regex match index with the last matches index
          options.regex.lastIndex = lastRegIndex;
        }
        options.regex.lastIndex = 0;
      } else {
        // find the closest match in the masterStr
        let match = findClosestMatch(options.regex, masterStr);

        // if the match is within 80% of the test string
        if (match.percent > 80) {
          amountOfSelectedMatches++;

          // create nodeParts array and find the index j signifying the node that the match starts in
          let { nodeParts, indexOfNodeThatMatchStartsIn: j } = getNodeParts(
            match.index,
            curGroupOfNodes
          );

          // find the index at which the match occurs within the first node
          let nodeStartIndex =
            match.index - (nodeParts.length - curGroupOfNodes[j].data.length);

          // if the full match is across multiple nodes
          if (nodeStartIndex + match.size > curGroupOfNodes[j].data.length) {
            // get the string that starts at the found match
            // and ends at the end of the containing nodes text
            let inThisNode = nodeParts.substring(match.index);

            test2 = makeCustomRegExpExecArray(
              inThisNode,
              curGroupOfNodes[j].data.length - inThisNode.length,
              curGroupOfNodes[j].data
            );

            let nodeGroup = insertOverSeveralNodes(
              match.size,
              test2[0],
              curGroupOfNodes,
              j,
              callback
            );

            nodeList.push(nodeGroup);
          } else {
            // else if the match occurs in only one node

            // create a tag
            tag = callback(match[0], -1);

            let { insertedNode, insertedText, newNode } = replacePartOfNode(
              curGroupOfNodes[j],
              tag,
              match.index,
              match.size
            );

            // push the inserted node to the last group in nodeList
            nodeList.push([insertedNode]);

            // if the match occurred at the beginning of the node, curGroupOfNodes[j].data === ''
            // this means that we did not create a new node, we just replaced one and don't need to increment j
            if (curGroupOfNodes[j].data === '') {
              // if the match occurs across the rest of the node, newNode.data === ''
              // this means that we need to delete newNode from curGroupOfNodes because we added an empty node
              if (newNode.data === '') {
                // delete newNode from curGroupOfNodes and replace it with insertedNodes text
                curGroupOfNodes.splice(j, 1, insertedText);
              } else {
                // insert insertedNodes text into curGroupOfNodes while keeping newNode
                curGroupOfNodes.splice(j, 1, insertedText, newNode);
              }
            } else {
              if (newNode.data === '') {
                curGroupOfNodes.splice(j + 1, 0, insertedText);
              } else {
                curGroupOfNodes.splice(j + 1, 0, insertedText, newNode);
              }
            }
          }
        }
      }
    }
    // return the amountOfSelectedMatches and the elements that contain the matches
    return {
      amountOfSelectedMatches,
      elements: nodeList,
    };
  };
}

// highlight methods
const makeTreeWalker = (excludes: string[], root: HTMLElement): TreeWalker => {
  return document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    function (node: Node): number {
      if (!(node instanceof CharacterData)) return NodeFilter.FILTER_ACCEPT;
      if (
        node.data.trim() === '' ||
        isDescendant(excludes, node) ||
        // excludes.indexOf(node.parentNode.tagName.toLowerCase()) > -1 ||
        !node.parentElement?.offsetParent
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  );
};

const isDescendant = (tags: string[], node: Node): boolean => {
  if (node.parentElement == null) return false;
  if (
    node !== document.body &&
    tags.indexOf(node.parentElement.tagName.toLowerCase()) === -1
  ) {
    return isDescendant(tags, node.parentElement);
  }
  return node !== document.body;
};

const trimBadHtmlNodes = (node: Node): void => {
  if (!(node instanceof CharacterData)) return;
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

const getLastBlockElem = (node: Node, root: HTMLElement) => {
  let elem = node.parentElement;
  while (elem != null && window.getComputedStyle(elem, '').display != 'block') {
    elem = elem.parentElement;
    if (elem === root) return null;
  }
  return elem;
};

const replacePartOfNode = (
  nodeToReplace: Text,
  replaceWith: HTMLElement,
  startOfReplace: number,
  endOfReplace: number
) => {
  // split the node at index startOfReplace
  let newNode = nodeToReplace.splitText(startOfReplace);

  // replace newNode's data with the text after index endOfReplace
  newNode.data = newNode.data.substring(endOfReplace);

  // insert replaceWith node before the newNode
  let insertedNode = newNode.parentNode?.insertBefore(replaceWith, newNode);
  if (insertedNode != null && insertedNode.firstChild instanceof Text) {
    let insertedText = insertedNode.firstChild;
    return { insertedNode, insertedText, newNode };
  } else {
    throw 'replacePartOfNode() tried inserting something that is not a node';
  }
};

const makeGroupedNodeArray = (tw: TreeWalker, root: HTMLElement) => {
  let groupedNodes: Text[][] = [];
  let nodes: Node[] = [];
  while (tw.nextNode()) {
    if (tw.currentNode instanceof Text) {
      trimBadHtmlNodes(tw.currentNode);
      if (groupedNodes.length === 0) {
        groupedNodes.push([]);
        groupedNodes[groupedNodes.length - 1].push(tw.currentNode);
      } else {
        if (
          getLastBlockElem(nodes[nodes.length - 1], root) ===
          getLastBlockElem(tw.currentNode, root)
        ) {
          groupedNodes[groupedNodes.length - 1].push(tw.currentNode);
        } else {
          groupedNodes[groupedNodes.length] = [];
          groupedNodes[groupedNodes.length - 1].push(tw.currentNode);
        }
      }
      nodes.push(tw.currentNode);
    }
  }
  return groupedNodes;
};

const makeCustomRegExpExecArray = (
  inThisNode: string,
  index: number,
  input: string
): RegExpExecArray => {
  let test2: any = [];
  test2[0] = inThisNode;
  test2['index'] = index;
  test2['input'] = input;
  test2['groups'] = undefined;
  return test2;
};

/**
 * Using the part of the match in the first node where the match was found, this replaces
 * every text node containing the match, cutting both the first and last nodes so that it
 * will only replace the matched text.
 *
 * ex:
 *
 * For:
 *
 *  `curGroupOfNodes = ['hi I am a', 'different', 'text node', 'that is blue']`
 *
 * And a search string:
 *
 * `'I am a different text no'`
 *
 * a proper call looks like:
 *
 * `insertOverSeveralNodes(24, 'I am a', curGroupOfNodes, 0, callback)`
 *
 * This function will:
 * - Split `curGroupOfNodes[0]` at index 2 and replace the text from index 3 to index `curGroupOfNodes[0].length-1` with the element `callback('I am a', 0)`
 * - Split `curGroupOfNodes[1]` at index 0 and replace the text from index 0 to index `curGroupOfNodes[1].length-1` with the element `callback('different', 1)`
 * - Split `curGroupOfNodes[2]` at index 0 and replace the text from index 0 to index 6 with the element `callback('text no')`
 *
 *
 * @param fullMatchLength the length of the full match across all nodes
 * @param partOfMatchInFirstNode the first part of the match appearing in a node curGroupOfNodes[index]
 * @param curGroupOfNodes the group of nodes that the match occurs over
 * @param index the nodes index that the first part of the match appears in
 * @param callback the callback to make an HTMLElement to insert
 * @returns the group of nodes that has just been inserted into the dom
 */
const insertOverSeveralNodes = (
  fullMatchLength: number, // test[0].length
  partOfMatchInFirstNode: string, // test2[0]
  curGroupOfNodes: Text[],
  index: number, // index of curGroupOfNodes
  callback: (match: string, id: number) => HTMLElement
) => {
  let tag;
  let sameMatchID = 0;
  let nodeGroup: Node[] = [];

  let helpArr: string[] = [];
  // push the match or first part of the match to the helpArr
  helpArr.push(partOfMatchInFirstNode);

  // insert all nodes leading up to the last one containing the match
  for (let k = 0; helpArr.join('').length < fullMatchLength; k++) {
    // get the tag to be inserted from the callback
    tag = callback(helpArr[k], sameMatchID);

    let { insertedNode, insertedText } = replacePartOfNode(
      curGroupOfNodes[index],
      tag,
      curGroupOfNodes[index].length - helpArr[k].length,
      curGroupOfNodes[index].data.length
    );
    // push the inserted node to the last group in nodeList
    nodeGroup.push(insertedNode);

    // if the splitText() call happened on index 0 of the
    // text node in curGroupOfNodes[index], replace that node
    // with the inserted node and do not increment index.
    // if the splitText() call happened on an index other than
    // 0, insert the text node into the groupedNodes array after
    // curGroupOfNodes[index] and make sure to increment index.
    if (curGroupOfNodes[index].data.length === 0) {
      curGroupOfNodes[index] = insertedText;
    } else {
      curGroupOfNodes.splice(index + 1, 0, insertedText);
      index++;
    }

    // move on to the next node and increment sameMatchID for tag
    index++;
    sameMatchID++;

    // push the text of the next node to helpArr for the continuation of the loop
    helpArr.push(curGroupOfNodes[index].data);
  }

  // get the full text of the last node containing the match
  let lastNode = helpArr.pop();
  if (lastNode == null) {
    throw 'helpArr is an empty array';
  }
  // get the tag and provide, the part of the match that is in this node,
  // from the start or 0 index to the length of the match minus the length
  // of the text of the nodes containing the match, and provide -1 to signify
  // this is the last node containing the match
  tag = callback(
    lastNode.substring(0, fullMatchLength - helpArr.join('').length),
    -1
  );
  let { insertedNode, insertedText, newNode } = replacePartOfNode(
    curGroupOfNodes[index],
    tag,
    0,
    fullMatchLength - helpArr.join('').length
  );

  // if the inserted was successful
  // push the inserted node to the last group in nodeList
  nodeGroup.push(insertedNode);

  // replace curGroupOfNodes[j] with the inserted text node
  curGroupOfNodes[index] = insertedText;

  // if newNode has text, make sure to insert it back into curGroupOfNodes after index j
  if (newNode.data.length > 0) {
    curGroupOfNodes.splice(index + 1, 0, newNode);
  }

  return nodeGroup;
};

const findClosestMatch = (str1: string, str2: string): ClosestMatch => {
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

/**
 *
 * @param testIndex the index of the found match in the master string
 * @param currentGroupOfNodes the group of nodes who's text forms the master string
 * @returns `NodeParts` interface that stores a nodeParts array or the text from each node
 * in the current group of nodes and the index of the node from which the current match was found in
 */
const getNodeParts = (
  testIndex: number,
  currentGroupOfNodes: Text[]
): NodeParts => {
  let j = 0;
  let nodeParts = '' + currentGroupOfNodes[j].data;

  while (testIndex > nodeParts.length - 1) {
    j++;
    nodeParts = nodeParts + currentGroupOfNodes[j].data;
  }
  return { nodeParts, indexOfNodeThatMatchStartsIn: j };
};

// levenshtein comparison

const lev_distance = (str1: string, str2: string) => {
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

const lev_distance_matrix = (str1: string, str2: string) => {
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
