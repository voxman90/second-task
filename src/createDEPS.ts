(function() {
    const fs = require("fs");
    const path = require("path");

    const getDir = (source) => fs.readdirSync(source, {withFileTypes: true})
    .filter(ent => ent.isDirectory())
    .map(dir => dir.name);

    const dirs = getDir(path.resolve(__dirname, "./common.blocks/"));
    dirs.forEach(createDepsJSON);

    function createDepsJSON(dir: string) {
        const root = `./common.blocks/${dir}/${dir}`;
        const file = path.resolve(__dirname, `${root}.deps.json`);
        const obj = {
            name: dir,
            techs: extractTechs(root),
            deps: extractDeps(root)
        }
        const json = JSON.stringify(obj, null, ' ');

        if(!fs.existsSync(file)) {
            fs.writeFileSync(file, json);
        }
    }

    function extractDeps(root: string): string[] {
        const file = `${root}.pug`;
        const re = new RegExp(/(?<=\+)[a-z\-]*?(?=\(|$)/gm);

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

    function extractTechs(root: string): string[] {
        const js = `${root}.js`;
        const scss = `${root}.scss`;
        const pug = `${root}.pug`;
        let techs = [];
        
        if (fs.existsSync(path.resolve(__dirname, js))) {
            techs.push("js");
        }

        if (fs.existsSync(path.resolve(__dirname, scss))) {
            techs.push("scss");
        }

        if (fs.existsSync(path.resolve(__dirname, pug))) {
            techs.push("pug");
        }

        if (techs.length === 0) {
            techs = null;
        }

        return techs;
    }
}());