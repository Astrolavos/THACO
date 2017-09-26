const ObjectId = require('objectid');

const walk = (result, day, item, parents) => {
  const objId = new ObjectId();
  const children = item.children.map(child =>
    walk(result, day, child, parents.concat([{
      _id: objId,
      group: item.group,
    }]))
  );

  result.push({
    _id: objId,
    parents: parents.concat([{
      _id: objId,
      group: item.group,
    }]),
    children,
  });

  return ({
    _id: objId,
    group: item.group,
    domains: item.size,
    blacklisted: item.color,
    isLeaf: !item.children.length,
  });
};

module.exports = {
  walk,
};
