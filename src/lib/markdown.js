/** @jsx Reaxt.addNode*/

let Reaxt = require("jsx-latex");
let $s = require("shelljs");

Reaxt.createComponent("markdown", props => {
  let txt = props.text;
  let tmp = $s.tempdir();
  txt.to(`${tmp}/file.md`);

  return $s.exec(`pandoc ${tmp}/file.md -t latex`, { silent: true }).output;
});
