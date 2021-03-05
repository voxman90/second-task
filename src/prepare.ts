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

    addVertex(vert: Vertex) {
        this.verts.push(vert);
    }
}

class TopologicalSort {
    graph: Graph;
    list: Vertex[];
    stack: Vertex[];

    constructor(graph: Graph) {
        this.graph = Object.assign({}, graph);
        this.list = [];
        this.stack = [];
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
}

(function() {
    const fs = require("fs");
    const path = require("path");

    const rawData = fs.readFileSync(path.resolve(__dirname, "entry.json"));
    const {entries} = JSON.parse(rawData);

    for (let entry of entries) {
        createEntry(entry);
    }

    function createEntry(args: {name: string, template: string}): void {
        const {name, template} = args;

        const data = fs.readFileSync(path.resolve(__dirname, `${template}.pug`), 'utf8');
        const {inc, mix, comps} = extractComponentsFromTemplate(data);

        const compGraph = createComponentsGraph(comps);

        console.log(compGraph.verts);
    }

    function createComponentsGraph(comps: string[]): Graph {
        let compGraph = new Graph();

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
            deps = []
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

    // function writeTechs(name: string, techs: string[]): void {
    //     const file = path.resolve(__dirname, `${name}.entry.js`);
    //     let acc = `import "./style.scss";\n`;
        
    //     techs.forEach(
    //         (tech) => acc += `import "${tech}";\n`
    //     );

    //     fs.open(file, "w+", (err, fd) => {
    //         fs.write(fd, acc, 0, 'utf8', () => {});
    //         fs.close(fd, () => {});
    //     });
    // }

    // function writeDependensies(template: string, depss: string[]): void {
    //     const root = "./common.blocks";
    //     const file = path.resolve(__dirname, `${template}.pug`);
    //     let acc = "";
        
    //     depss.forEach(
    //         (deps) => acc += `include ${root}/${deps}/${deps}.pug\n`
    //     );
        
    //     const data = fs.readFileSync(file, "utf8"), 
    //         fd = fs.openSync(file, "w+");

    //     acc += data;
    //     fs.writeSync(fd, acc, 0, 'utf8');
    //     fs.closeSync(fd);
    // }
}());