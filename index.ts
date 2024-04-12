function process(nodes: any[], insideIf: boolean = false) {
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    if (!/Each|Conditional/.test(node.type)) {
      if (node.block) node.block.nodes = process(node.block.nodes);
      if (node.type === "Code" && node.buffer && node.mustEscape) {
        delete node.buffer;
        delete node.mustEscape;
        node.type = "Text";
        node.val = `{{ ${node.val} }}`;
        delete node.isInline;
      }
      continue;
    }
    if (node.consequent) {
      let newNodes = [],
        children = process(node.consequent.nodes),
        ifLabel = insideIf ? "v-else-if" : "v-if",
        ifAttr = [{ name: ifLabel, val: `"${node.test}"`, mustEscape: false }];
      newNodes.push(
        processController(
          children,
          ifAttr,
          `empty ${ifLabel}=${node.test}`,
          node
        )
      );
      if (node.alternate) {
        if (node.alternate.type === "Block") {
          let alternate = process(node.alternate.nodes),
            elseAttr = [{ name: "v-else", val: true, mustEscape: false }];
          newNodes.push(
            processController(alternate, elseAttr, `empty v-else`, node)
          );
        } else newNodes.push(...process([node.alternate], true));
      }
      nodes.splice(i, 1, ...newNodes);
      i += newNodes.length - 1;
    } else {
      let loop =
          (node.key ? `"(${node.val}, ${node.key})` : `"${node.val}`) +
          ` in ${node.obj}"`,
        loopAttr = [{ name: "v-for", val: loop, mustEscape: false }];
      if (node.key && node.key.toLowerCase() === "key")
        loopAttr.push({
          name: ":key",
          val: `"${node.key}"`,
          mustEscape: false,
        });
      let children = process(node.block.nodes);
      nodes[i] = processController(
        children,
        loopAttr,
        `empty v-for=${loop}`,
        node
      );
    }
  }
  return nodes;
}

function processController(
  nodes: any[],
  attr: any,
  emptyStr: string,
  mainNode: any
) {
  if (nodes.length === 0) {
    return {
      type: "Comment",
      val: emptyStr,
      buffer: true,
      line: mainNode.line,
      column: mainNode.column,
      filename: mainNode.filename,
    };
  }
  if (
    nodes.length > 1 ||
    !nodes[0].attrs ||
    nodes[0].attrs.find((e: any) => /^v-(for|if|else)/.test(e.name))
  ) {
    return {
      block: { type: "Block", nodes: nodes },
      attrs: attr,
      type: "Tag",
      name: "template",
      selfClosing: false,
      attributeBlocks: [],
      isInline: false,
    };
  }
  nodes[0].attrs.push(...attr);
  return nodes[0];
}

export default {
  preCodeGen: function (ast: any, opt: any) {
    ast.nodes = process(ast.nodes);
    return ast;
  },
};
