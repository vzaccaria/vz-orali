/** @jsx Reaxt.addNode*/

let Reaxt = require("jsx-latex");
let _ = require("lodash");
let { $yaml, $fs } = require("zaccaria-cli");
let geometry = ["margin={1.05cm, 3cm}", "paper=a4paper"].join(", ");

require("./components/markdown");

Reaxt.createComponent("ruler", () => {
  let x = -0.6;
  return [
    <vspace space={`${x}cm`} />,
    <hrule />,
    <vspace space={`${(-1) * x / 2}cm`} />
  ].join("");
});

Reaxt.createComponent("centered", (props, ...rchildren) => {
  return (
    <minipage>
      <centering>
        <text> {rchildren.join("")} </text>
      </centering>
    </minipage>
  );
});

Reaxt.createComponent("ask", (props, ...rchildren) => {
  let space = parseInt(_.get(props, "space", 10));
  let spaces = _.map(_.range(0, space), () => "\\_").join("");
  return <text> {rchildren.join("")} {spaces} </text>;
});

Reaxt.createComponent("title", props => {
  let title = props.info.title;
  return (
    <centered>
      <large>
        {title}
      </large>
      <vspace space=".7cm" />
    </centered>
  );
});

Reaxt.createComponent("subtitle", () => {
  return (
    <centered>
      <ask space="20">Nome e cogome</ask>
      <ask>Matricola</ask>
      <ask>Ora Inizio</ask>
      <ask>Ora Consegna (perentoria)</ask>
    </centered>
  );
});

let sStyle = { title: { numbered: false } };

Reaxt.createComponent("question", props => {
  let title = `Domanda su ${props.topic}`;
  let txt;
  if (!_.isUndefined(props.markdown)) {
    txt = <markdown text={props.markdown} />;
  } else {
    txt = props.text;
  }
  if (_.isUndefined(props.answers)) {
    return (
      <section style={sStyle} title={title}>
        {" "}{txt}
        <vspace space=".5cm" />
        <text style={{ fontsize: 0.7 }}><br />RISPOSTA:</text>
        <vspace space="4cm" />
      </section>
    );
  } else {
    return (
      <section style={sStyle} title={title}>
        {" "}{txt}
        <vspace space=".5cm" />
        <text style={{ fontsize: 0.7 }}>
          <br />SEGNARE LA RISPOSTA CORRETTA:
        </text>
        <vspace space="1cm" />
        {_
          .map(props.answers, it => {
            return <text><br />☐ {it}<br /></text>;
          })
          .join("")}
      </section>
    );
  }
});

function getRandom(data, size) {
  return _.take(_.shuffle(data), size);
}

Reaxt.createComponent("sheet", props => {
  let { open, closed, info } = props;
  let cq = _.map(closed, it => {
    return <question {...it} />;
  });
  let oq = _.map(open, it => {
    return <question {...it} />;
  });
  /* console.error(JSON.stringify({ open, closed }));*/

  return [
    <title info={info} />,
    <br />,
    <subtitle />,
    <br />,
    cq.join(""),
    oq.join(""),
    "\\newpage{}"
  ].join("");
});

$fs.readFileAsync("./questions.yaml").then(it => {
  let orig = $yaml(it);
  let data = orig.topics;
  let info = orig.info;
  data = _.filter(data, it => {
    return it.name !== "Hidden";
  });
  data = _.map(data, it => {
    let name = it.name;
    it.questions = _.map(it.questions, q => {
      q.topic = name;
      return q;
    });
    return it;
  });

  data = _.flatten(
    _.map(data, it => {
      return it.questions;
    })
  );

  data = _.map(data, it => {
    if (_.isUndefined(it.answers)) {
      it.open = true;
    } else {
      it.open = false;
    }
    return it;
  });
  data = _.groupBy(data, "open");
  data = _.map(_.range(0, orig.options.sheets), () => {
    let closed = getRandom(data["false"], orig.options.nclose);
    let open = getRandom(data["true"], orig.options.nopen);
    return <sheet open={open} closed={closed} info={info} />;
  });
  Reaxt.render(<article geometry={geometry}> {data.join("")} </article>);
});
