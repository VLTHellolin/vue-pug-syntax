import pug from "pug";
import plugin from "../dist/index.js";

const template = pug.compileFile("./test/test.pug", {
  pretty: true,
  plugins: [
    plugin,
    {
      preParse(code, options) {
        return code;
      },
      postParse(ast, options) {
        return ast;
      },
    },
  ],
});

console.log(template({}));
