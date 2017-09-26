export default function selector(file, path = []) {
  if (path[0] === '') path = [];
  let currentNode = file;
  let errorFlag = false;
  path.forEach(index => {
    if (currentNode.children && currentNode.children[index]) {
      currentNode = currentNode.children[index];
    } else {
      errorFlag = true;
    }
  });

  if (!currentNode || !currentNode.children || errorFlag) return null;
  const result = [];
  currentNode.children.forEach(child => {
    const newChild = {};
    Object.keys(child).forEach(key => {
      if (key === 'children') {
        // newChild[key] = child[key].length;
      } else if (key === 'group') {
        newChild.title = child[key] ? child[key] : 'Unknown';
      } else {
        newChild[key] = child[key];
      }
      if (child.children.length === 0) {
        newChild.leaf = true;
      }
    });
    result.push(newChild);
  });
  return result;
}

export function getNamedPath(file, path = []) {
  if (path[0] === '') path = [];
  const names = [];
  let currentNode = file;
  path.forEach((index, key) => {
    if (currentNode.children && currentNode.children[index]) {
      names.push({
        group: currentNode.children[index].group,
        str: path.slice(1, key + 1).join(','),
      });
      currentNode = currentNode.children[index];
    }
  });
  return names;
}

// removes all items with empty group label
// it's a very expensive operation, temp solution
export function removeEmptyGroups(node) {
  if (node && node.children && node.children.length) {
    const filtered = node.children.filter(child => !!child.group);
    if (filtered) {
      filtered.forEach(removeEmptyGroups);
    }
    node.children = filtered;
  }
}

export function reverse(s) {
  if (!s) return null;
  let o = '';
  for (let i = s.length - 1; i >= 0; i--) {
    o += s[i];
  }
  return o;
}

export function isIp(ipaddress) {
  /* eslint max-len: 0 */
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
    return true;
  }
  return false;
}

export function isDate(date) {
  if (date.length !== 8) return 0;
  return parseInt(date, 10);
}
