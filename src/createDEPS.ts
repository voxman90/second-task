(function() {const fs = require("fs");
    const path = require("path");

    const getDirectories = (source) => fs.readdirSync(source, { withFileTypes: true })
        .filter(ent => ent.isDirectory())
        .map(dir => dir.name)

    const dirs = getDirectories(path.resolve(__dirname, "common.blocks/"));

    dirs.forEach(
        (dir) => createDepsJSON(dir)
    );

    function createDepsJSON(dir: string) {
        const root = `common.blocks/${dir}/${dir}`,
            file = path.resolve(__dirname, `${root}.deps.json`);

        const obj = {
            name: dir,
            tech: getTech(root),
            deps: getDeps(root)
        }

        const json = JSON.stringify(obj);

        if(!fs.existsSync(file)) {
            fs.writeFileSync(file, json);
        }
    }

    function getDeps(root: string): string[] {
        const file = `${root}.pug`,
            re = new RegExp(/(?<=\+)[a-z\-]*?(?=\(|$)/gm);

        const data = fs.readFileSync(path.resolve(__dirname, file), 'utf8');

        let comps = data.match(re);

        if (comps !== null) {
            comps = removeDuplicates(comps);
        }

        return comps;
    }

    function removeDuplicates(arr: string[]): string[] {
        return arr.filter(
            (val, index, arr) => arr.indexOf(val) === index
        );
    }

    function getTech(root: string): string[] {
        const js = `${root}.js`,
            scss = `${root}.scss`;
        let tech = [];
        
        if(fs.existsSync(path.resolve(__dirname, js))) {
            tech.push("js");
        }

        if(fs.existsSync(path.resolve(__dirname, scss))) {
            tech.push("scss");
        }

        if (tech.length === 0) {
            tech = null;
        }

        return tech;
    }
}());