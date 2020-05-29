const fs = require('fs');
const path = require('path');
const babel = require("@babel/core");

const genId = (function () { //generates an id for a file
    let id = 0;
    return function () {
        id += 1;
        return id;
    }
})();

function createAsset(target) {
    const targetFile = fs.readFileSync(__dirname + target.replace('.', ''), 'utf-8');
    const ast = babel.transform(targetFile, { ast: true }).ast;
    const imports = []
    babel.traverse(ast, {
        ImportDeclaration: ({node}) => {
            imports.push(node.source.value)
        }
    });
    const id = genId();
    const {code} = babel.transformFromAst(ast, null, {
        presets: [
            "@babel/preset-env",
        ]
    });

    return {
        id,
        target,
        imports,
        code
    }
}

function generateGraph(entry) {
    const mainAsset = createAsset(entry);

    const queue = [mainAsset];

    for (asset of queue) {
        const directory = path.dirname(asset.target);
        asset.mapping = {};

        asset.imports.forEach((dir) => {
            const absolutePath = directory + dir.replace('.', '');

            const child = createAsset(absolutePath);

            asset.mapping[dir] = child.id;

            queue.push(child);
        })
    };

    return queue;
}

function bundle(graph) {
    let moduleMapping = '';

    graph.forEach(mod => {
        moduleMapping += `${mod.id}: [
            function(require, module, exports) {
                ${mod.code}
            },
            ${JSON.stringify(mod.mapping)}
        ],`
    })

    const result = `
    (function (moduleMapping) {
        function require(id) {
            var [func, map] = moduleMapping[id];
    
            function scopedRequire(relativePath) {
                return require(map[relativePath])
            };
    
            var module = { exports: {} };
    
            func(scopedRequire, module, module.exports);
    
            return module.exports;
        }
    
        require(1);
    })({
        ${ moduleMapping }
    })
    `

    return result;
}

// console.log(generateGraph('.\\content\\index.js'));
fs.writeFileSync('./output.js',bundle(generateGraph('./content/index.js')));