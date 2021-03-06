"use strict"

class Vertex {
    value: number | string;
    links: Vertex[];
    [key: string]: any;

    constructor(value: number | string) {
        this.value = (typeof value !== undefined) ? value : null;
        this.links = [];
    }

    linkVertex(vert: Vertex) {
        this.links.push(vert);
    }

    setValue(value: number | string) {
        this.value = value;
    }
}

class Graph {
    verts: Vertex[];

    constructor() {
        this.verts = [];
    }

    addVertex(vert: Vertex): void {
        this.verts.push(vert);
    }
}

class ComponentsGraph extends Graph {
    getTechs(): {templs: string[], styles: string[], scripts: string[]} {
        const templs = [];
        const styles = [];
        const scripts = [];

        for (let vert of this.verts) {
            if (vert.techs.includes("pug")) {
                templs.unshift(vert.value);
            }

            if (vert.techs.includes("scss")) {
                styles.unshift(vert.value);
            }

            if (vert.techs.includes("js")) {
                scripts.unshift(vert.value);
            }
        }

        return {
            templs,
            styles,
            scripts
        };
    }
}

class TopologicalSort {
    graph: Graph;
    list: Vertex[];
    stack: Vertex[];

    constructor(graph: Graph) {
        this.graph = graph;
        this.list = [];
        this.stack = [];

        this.sort();
        this.removeServiceProperties();
        graph.verts = [].concat(this.stack);
    }

    sort() {
        this.graph.verts.forEach(
            (vert) => vert.color = "white"
        );

        this.list.push(this.graph.verts[0]);

        let done = false;
        while (!done) {
            const length = this.list.length;
            this.bypass(this.list[length - 1]);
            done = true;

            this.graph.verts.some(
                (vert) => {
                    if (vert.color === "white") {
                        this.list.push(vert);
                        done = false;
                        return true;
                    }
                }
            );
        }
    }

    bypass(root: Vertex) {
        root.color = "grey";

        for (let vert of root.links) {
            if (vert.color === "white") {
                this.list.push(vert);
                this.bypass(vert);
            } else if (vert.color === "grey") {
                console.log(`(TopologicalSort -> sort -> bypass) Loop found, sorting is not possible [vertex = ${vert}]`);
            }
        }

        root.color = "black";
        this.stack.unshift(root);
    }

    removeServiceProperties() {
        for (let vert of this.stack) {
            delete vert.color;
        }
    }
}

(function() {
    const fs = require("fs");
    const path = require("path");

    const rawData = fs.readFileSync(path.resolve(__dirname, "entry.json"));
    const {entries} = JSON.parse(rawData);

    for (let entry of entries) {
        createEntry(entry);
    }

    function createEntry(args: {name: string, template: string, style: string}): void {
        const {name, template, style} = args;

        const data = fs.readFileSync(path.resolve(__dirname, `${template}.pug`), 'utf8');
        let {inc, mix, comps} = extractComponentsFromTemplate(data);

        const compGraph = createComponentsGraph(comps);
        new TopologicalSort(compGraph);

        const {templs, styles, scripts} = compGraph.getTechs();
        writeIncludes(template, removeDifference(templs, inc));
        writeImports(name, style, styles, scripts);
    }

    function createComponentsGraph(comps: string[]): ComponentsGraph {
        let compGraph = new ComponentsGraph();

        compGraph.verts = createComponentsVertexList(comps);

        return compGraph;
    }

    function createComponentsVertexList(comps: string[]): Vertex[] {
        let compList = [...comps];
        let vertexList = [];

        let i = 0;
        while (compList.length !== i) {
            const root = `./common.blocks/${compList[i]}/${compList[i]}`;
            const file = `${root}.deps.json`;

            if (!fs.existsSync(path.resolve(__dirname, file))) {
                console.log(`(getComponents) File doesn't exist! [file = ${file}]`);
                compList.splice(i, 1);
            } else {
                vertexList.push(createComponentVertex(file, compList));
                i += 1;
            }
        }

        vertexList.forEach(
            (vert, i, vertList) => setVertexLinks(vert, vertList, compList)
        );

        return vertexList;
    }

    function createComponentVertex(file: string, comps: string[]): Vertex {
        const fd = fs.readFileSync(path.resolve(__dirname, file));
        const obj = JSON.parse(fd);
        let {name, deps, techs} = obj;
        if (deps === null) {
            deps = [];
        }

        const vert = new Vertex(name);
        vert.deps = deps;
        vert.techs = techs;

        for (let dep of deps) {
            if (!comps.includes(dep)) {
                comps.push(dep);
            }
        };

        return vert;
    }

    function setVertexLinks(vert: Vertex, vertList: Vertex[], compList: string[]): void {
        let {deps} = vert;

        let i = 0;
        while (i < deps.length) {
            const dep = deps[i];
            if (compList.includes(dep)) {
                const link = vertList[compList.indexOf(dep)];
                vert.links.push(link);
                i += 1;
            } else {
                vert.deps.splice(i, 1);
            }
        };
    }

    function writeIncludes(template: string, comps: string[]): void {
        const root = "./common.blocks";
        const reducer = (acc, comp) => acc += `include ${root}/${comp}/${comp}.pug\n`;
        let inc = comps.reduce(reducer, "");

        const file = path.resolve(__dirname, `${template}.pug`);
        const data = fs.readFileSync(file, "utf8");
        inc += data;

        const fd = fs.openSync(file, "w+");
        fs.writeSync(fd, inc, 0, "utf8");
        fs.closeSync(fd);
    }

    function writeImports(name: string, style: string, styles: string[], scripts: string[]): void {
        const root = "./common.blocks";
        let imports = `import "./${style}.scss";\n`;
        
        styles.forEach(
            (style) => imports += `import "${root}/${style}/${style}.scss";\n`
        );

        scripts.forEach(
            (script) => imports += `import "${root}/${script}/${script}.js";\n`
        );

        const file = path.resolve(__dirname, `${name}.entry.js`);
        const fd = fs.openSync(file, "w+");
        fs.writeSync(fd, imports, 0, "utf8");
        fs.closeSync(fd);
    }

    function extractComponentsFromTemplate(data: string): {inc: string[], mix: string[], comps: string[]} {
        const includes = new RegExp(/include.*/gm);
        const mixins = new RegExp(/(?<=\+)[a-z\-]*?(?=\(|$)/gm);
        let comps = [];
        let inc: string[];
        let mix: string[];

        inc = data.match(includes) || [];
        if (inc.length !== 0) {
            inc.map(
                (val, i, arr) => {
                    arr[i] = val.match(/(?<=\w\/)(.*(?=\/))/)[0];
                }
            );
            inc = removeDuplicates(inc);
        }
        
        mix = data.match(mixins) || [];
        if (mix.length !== 0) {
            mix = removeDuplicates(mix);
        }
        
        comps = removeDuplicates([...inc, ...mix]);
        mix = removeDifference(mix, inc);

        return {inc, mix, comps};
    }

    function removeDuplicates(arr: string[]): string[] {
        if (arr && arr.length !== 0) {
            return arr.filter(
                (value, index, array) => array.indexOf(value) === index
            );
        } else {
            return [];
        }
    }

    function removeDifference(arr: string[], toRemove: string[]): string[] {
        let acc = [].concat(arr);
        acc = acc.filter(
            (val) => !toRemove.includes(val)
        );
        return acc;
    }
}());