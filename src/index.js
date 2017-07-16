const prog = require("caporal");

let { parseYaml } = require("./lib/orali");

prog
  .version("1.0.0")
  .description("Generates latex for random question sheets")
  .argument("<questions>", "YAML file containing questions")
  .option("--sheets <num>", "<num> of sheets to generate", prog.INT, 1)
  .option("--mindiff <num>", "Include difficulty from <num>", prog.INT, 1)
  .option("--maxdiff <num>", "Include difficulty up to <num>", prog.INT, 1)
  .option(
    "--modulo <modulo>",
    "take <index> out of every <modulo>",
    prog.INT,
    1
  )
  .option("--index <index>", "take <index> out of every <modulo>", prog.INT, 0)
  .action(function(args, options) {
    return parseYaml(args.questions, options);
  });

prog.parse(process.argv);
