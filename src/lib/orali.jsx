/** @jsx Reaxt.addNode*/

let Reaxt = require("jsx-latex");
let _ = require("lodash");
let { $yaml, $fs } = require("zaccaria-cli");
let geometry = ["margin={1.05cm, 3cm}", "paper=a4paper"].join(", ");

require("./markdown");

Reaxt.createComponent("ruler", () => {
  let x = -0.6;
  return [
    <vspace space={`${x}cm`} />,
    <hrule />,
    <vspace space={`${-1 * x / 2}cm`} />
  ].join("");
});

Reaxt.createComponent("centered", (props, ...rchildren) => {
  return (
    <minipage>
      <centering>
        <text>
          {" "}{rchildren.join("")}{" "}
        </text>
      </centering>
    </minipage>
  );
});

Reaxt.createComponent("ask", (props, ...rchildren) => {
  let space = parseInt(_.get(props, "space", 10));
  let spaces = _.map(_.range(0, space), () => "\\_").join("");
  return (
    <text>
      {" "}{rchildren.join("")} {spaces}{" "}
    </text>
  );
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

Reaxt.createComponent("subtitle", props => {
  let info = props.info;
  return (
    <centered>
      <ask space="20">
        {info.studentname}
      </ask>
      <ask>
        {info.studentnumber}
      </ask>
      <ask>
        {info.start}
      </ask>
      <ask>
        {info.finish}
      </ask>
    </centered>
  );
});

let sStyle = { title: { numbered: false } };

Reaxt.createComponent("question", props => {
  let info = props.info;
  let title = `${info.question} ${props.topic}`;
  let txt;
  let usemarkdown = false;
  if (!_.isUndefined(props.markdown)) {
    txt = <markdown text={props.markdown} />;
    usemarkdown = true;
  } else {
    txt = props.text;
  }
  if (!_.isUndefined(props.answers)) {
    return (
      <section style={sStyle} title={title}>
        {" "}{txt}
        <text style={{ fontsize: 0.7 }}>
          <br />
          ({info.answercheckmark})
        </text>
        <vspace space=".5cm" />
        {_.map(props.answers, it => {
          if (!usemarkdown) {
            return (
              <text>
                <br />☐ {it}
                <br />
              </text>
            );
          } else {
            return (
              <text>
                <br />☐ <markdown text={it} />
                <br />
              </text>
            );
          }
        }).join("")}
      </section>
    );
  } else {
    return (
      <section style={sStyle} title={title}>
        {" "}{txt}
        <vspace space=".5cm" />
        <text style={{ fontsize: 0.7 }}>
          <br />
          {info.answer}:
        </text>
        <vspace space="4cm" />
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
    return <question info={info} {...it} />;
  });
  let oq = _.map(open, it => {
    return <question info={info} {...it} />;
  });
  /* console.error(JSON.stringify({ open, closed }));*/

  return [
    <title info={info} />,
    <br />,
    <subtitle info={info} />,
    <br />,
    cq.join(""),
    oq.join(""),
    "\\newpage{}"
  ].join("");
});

let preamble = `
\\usepackage{color}
\\usepackage{fancyvrb}
\\newcommand{\\VerbBar}{|}
\\newcommand{\\VERB}{\\Verb[commandchars=\\\\\\{\\}]}
\\DefineVerbatimEnvironment{Highlighting}{Verbatim}{commandchars=\\\\\\{\\}}
% Add ',fontsize=\\small' for more characters per line
\\newenvironment{Shaded}{}{}
\\newcommand{\\KeywordTok}[1]{\\textcolor[rgb]{0.00,0.44,0.13}{\\textbf{{#1}}}}
\\newcommand{\\DataTypeTok}[1]{\\textcolor[rgb]{0.56,0.13,0.00}{{#1}}}
\\newcommand{\\DecValTok}[1]{\\textcolor[rgb]{0.25,0.63,0.44}{{#1}}}
\\newcommand{\\BaseNTok}[1]{\\textcolor[rgb]{0.25,0.63,0.44}{{#1}}}
\\newcommand{\\FloatTok}[1]{\\textcolor[rgb]{0.25,0.63,0.44}{{#1}}}
\\newcommand{\\ConstantTok}[1]{\\textcolor[rgb]{0.53,0.00,0.00}{{#1}}}
\\newcommand{\\CharTok}[1]{\\textcolor[rgb]{0.25,0.44,0.63}{{#1}}}
\\newcommand{\\SpecialCharTok}[1]{\\textcolor[rgb]{0.25,0.44,0.63}{{#1}}}
\\newcommand{\\StringTok}[1]{\\textcolor[rgb]{0.25,0.44,0.63}{{#1}}}
\\newcommand{\\VerbatimStringTok}[1]{\\textcolor[rgb]{0.25,0.44,0.63}{{#1}}}
\\newcommand{\\SpecialStringTok}[1]{\\textcolor[rgb]{0.73,0.40,0.53}{{#1}}}
\\newcommand{\\ImportTok}[1]{{#1}}
\\newcommand{\\CommentTok}[1]{\\textcolor[rgb]{0.38,0.63,0.69}{\\textit{{#1}}}}
\\newcommand{\\DocumentationTok}[1]{\\textcolor[rgb]{0.73,0.13,0.13}{\\textit{{#1}}}}
\\newcommand{\\AnnotationTok}[1]{\\textcolor[rgb]{0.38,0.63,0.69}{\\textbf{\\textit{{#1}}}}}
\\newcommand{\\CommentVarTok}[1]{\\textcolor[rgb]{0.38,0.63,0.69}{\\textbf{\\textit{{#1}}}}}
\\newcommand{\\OtherTok}[1]{\\textcolor[rgb]{0.00,0.44,0.13}{{#1}}}
\\newcommand{\\FunctionTok}[1]{\\textcolor[rgb]{0.02,0.16,0.49}{{#1}}}
\\newcommand{\\VariableTok}[1]{\\textcolor[rgb]{0.10,0.09,0.49}{{#1}}}
\\newcommand{\\ControlFlowTok}[1]{\\textcolor[rgb]{0.00,0.44,0.13}{\\textbf{{#1}}}}
\\newcommand{\\OperatorTok}[1]{\\textcolor[rgb]{0.40,0.40,0.40}{{#1}}}
\\newcommand{\\BuiltInTok}[1]{{#1}}
\\newcommand{\\ExtensionTok}[1]{{#1}}
\\newcommand{\\PreprocessorTok}[1]{\\textcolor[rgb]{0.74,0.48,0.00}{{#1}}}
\\newcommand{\\AttributeTok}[1]{\\textcolor[rgb]{0.49,0.56,0.16}{{#1}}}
\\newcommand{\\RegionMarkerTok}[1]{{#1}}
\\newcommand{\\InformationTok}[1]{\\textcolor[rgb]{0.38,0.63,0.69}{\\textbf{\\textit{{#1}}}}}
\\newcommand{\\WarningTok}[1]{\\textcolor[rgb]{0.38,0.63,0.69}{\\textbf{\\textit{{#1}}}}}
\\newcommand{\\AlertTok}[1]{\\textcolor[rgb]{1.00,0.00,0.00}{\\textbf{{#1}}}}
\\newcommand{\\ErrorTok}[1]{\\textcolor[rgb]{1.00,0.00,0.00}{\\textbf{{#1}}}}
\\newcommand{\\NormalTok}[1]{{#1}}
`;

function parseYaml(f, options) {
  return $fs.readFileAsync(f).then(it => {
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
    data = _.map(_.range(0, options.sheets), () => {
      let closed = getRandom(data["false"], orig.options.nclose);
      let open = getRandom(data["true"], orig.options.nopen);
      return <sheet open={open} closed={closed} info={info} />;
    });
    Reaxt.render(
      <article geometry={geometry} preamble={preamble}>
        {" "}{data.join("")}{" "}
      </article>
    );
  });
}

module.exports = { parseYaml };
