const axios = require('axios');
const color = require('cli-color');
const terminalLink = require('terminal-link');
const compareVersions = require('compare-versions');

const NODE_JSON_URL = 'https://nodejs.org/dist/index.json';

module.exports = async v => {
  // 拿到所有的 Node.js 版本
  const { data } = await axios.get(NODE_JSON_URL);

  // 把目标版本的 LTS 都挑选出来
  return data.filter(node => {
    const cp = v ? (compareVersions(node.version, `v${v}.0.0`) >= 0) : true;
    return node.lts && cp;
  }).map(node => {
    // 剔除 file 这个字段，其他的全部返回
    ({ files, ...node } = node);
    const doc = color.yellow(terminalLink('API', `https://nodejs.org/dist/${node.version}/docs/api/documentation.html`));
    return { ...node, doc };
  });
};
