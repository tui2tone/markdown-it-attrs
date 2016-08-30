'use strict';
var md = require('markdown-it')();
var markdownItAttrs = require('./index.js');

md.use(markdownItAttrs);

var src = '- item1\n\
- item2\n\
  - item3\n\
  - item4\n\
    - item5\n\
  - item7\n\
  {.class4}\n\
- item6\n\
- item7\n\
{.class1}\n\
\n\
\n\
\n\
- item1\n\
- item2\n\
  - item3\n\
  - item4\n\
  - item5\n\
- item6\n\
- item7\n\
{.class2}';

var res = md.render(src);

console.log(res);  // eslint-disable-line
