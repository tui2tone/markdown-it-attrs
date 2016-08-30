/* eslint-env mocha */
'use strict';
var assert = require('assert');
var Md = require('markdown-it');
var markdownItAttrs = require('./');
var utils = require('./utils.js');

describe('markdown-it-attrs.utils', function() {
  it('should parse {.class #id key=val}', function () {
    var src = '{.red #head key=val}';
    var expected = [['class', 'red'], ['id', 'head'], ['key', 'val']];
    var res = utils.getAttrs(src, 1, src.length-1);
    assert.deepEqual(res, expected);
  });
});

describe('markdown-it-attrs', function() {
  var md;
  beforeEach(function(){
    md = Md().use(markdownItAttrs);
  });

  it('should add attributes when {} in end of last inline', function () {
    var src = 'some text {with=attrs}';
    var expected = '<p with="attrs">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add attributes when {} in last line', function () {
    var src = 'some text\n{with=attrs}';
    var expected = '<p with="attrs">some text\n</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add classes with {.class} dot notation', function () {
    var src = 'some text {.green}';
    var expected = '<p class="green">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add identifiers with {#id} hashtag notation', function () {
    var src = 'some text {#section2}';
    var expected = '<p id="section2">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should support classes, identifiers and attributes in same {}', function () {
    var src = 'some text {attr=lorem .class #id}';
    var expected = '<p attr="lorem" class="class" id="id">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should support attributes inside " {attr="lorem ipsum"}', function () {
    var src = 'some text {attr="lorem ipsum"}';
    var expected = '<p attr="lorem ipsum">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add classes in same class attribute {.c1 .c2} -> class="c1 c2"', function () {
    var src = 'some text {.c1 .c2}';
    var expected = '<p class="c1 c2">some text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should support empty inline tokens', function(){
    var src = ' 1 | 2 \n --|-- \n a | ';
    md.render(src);  // should not crash / throw error
  });

  it('should add classes to inline elements', function(){
    var src = 'paragraph **bold**{.red} asdf';
    var expected = '<p>paragraph <strong class="red">bold</strong> asdf</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should only remove last {}', function(){
    var src = '{{.red}';
    var expected = '<p class="red">{</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add classes for list items', function(){
    var src = '- item 1{.red}\n- item 2';
    var expected = '<ul>\n';
    expected += '<li class="red">item 1</li>\n';
    expected += '<li>item 2</li>\n';
    expected += '</ul>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should work with nested inline elements', function(){
    var src = '- **bold *italics*{.blue}**{.green}';
    var expected = '<ul>\n';
    expected += '<li><strong class="green">bold <em class="blue">italics</em></strong></li>\n';
    expected += '</ul>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should work with nested list', function(){
    var src = '- item1\n\
  - item2\n\
- item3\n\
{.red}';
    var expected = '<ul class="red">\n<li>item1\n<ul>\n<li>item2</li>\n</ul>\n</li>\n<li>item3</li>\n</ul>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });


  it('should add class to inline code block', function(){
    var src = 'bla `click()`{.c}';
    var expected = '<p>bla <code class="c">click()</code></p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should not trim unrelated white space', function(){
    var src = '- **bold** text {.red}';
    var expected = '<ul>\n';
    expected += '<li class="red"><strong>bold</strong> text</li>\n';
    expected += '</ul>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should not create empty attributes', function(){
    var src = 'text { .red }';
    var expected = '<p class="red">text</p>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add attributes to ul when below last bullet point', function(){
    var src = '- item1\n- item2\n{.red}';
    var expected = '<ul class="red">\n<li>item1</li>\n<li>item2</li>\n</ul>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should add classes for both last list item and ul', function(){
    var src = '- item{.red}\n{.blue}';
    var expected = '<ul class="blue">\n';
    expected += '<li class="red">item</li>\n';
    expected += '</ul>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should work with typography enabled', function(){
    var src = 'text {key="val with spaces"}';
    var expected = '<p key="val with spaces">text</p>\n';
    var res = md.set({ typographer: true }).render(src);
    assert.equal(res, expected);
  });

  it('should support code blocks', function(){
    var src = '```{.c a=1 #ii}\nfor i in range(10):\n```';
    var expected = '<pre><code class="c" a="1" id="ii">for i in range(10):\n</code></pre>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });

  it('should support code blocks with language defined', function(){
    var src = '```python {.c a=1 #ii}\nfor i in range(10):\n```';
    var expected = '<pre><code class="c language-python" a="1" id="ii">for i in range(10):\n</code></pre>\n';
    var res = md.render(src);
    assert.equal(res, expected);
  });
});
