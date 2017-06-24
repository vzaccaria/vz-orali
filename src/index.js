const prog = require("caporal");

let { parseYaml } = require("./lib/orali");

prog
  .version("1.0.0")
  .description("Generates latex for random question sheets")
  .argument("<questions>", "YAML file containing questions")
  .option("--sheets <num>", "Number of sheets", prog.INT, 1)
  .action(function(args, options) {
    return parseYaml(args.questions, options);
  });

prog.parse(process.argv);
