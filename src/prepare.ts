const fs = require("fs");
const path = require("path");

const rawData = fs.readFileSync(path.resolve(__dirname, 'entry.json'));
const { entryPoints } = JSON.parse(rawData);

for (let entryPoint of entryPoints) {
    formEntry(entryPoint);
}

function formEntry(args: {name: string, template: string}): void {
    const { name, template } = args;
    const rawData = fs.readFileSync(path.resolve(__dirname, `${template}.pug`), 'utf8');
    const comps = getComponents(rawData);
    console.log(comps);
    const deps = getDependencies(comps);
    console.log(deps);

    fs.open(path.resolve(__dirname, `${name}.js`), `w+`, (err, fd) => {
        fs.write(fd, deps.toString(), 0, 'utf8', () => {});
        fs.close(fd, () => {});
    });
}

function getComponents(str: string): string[] {
    const re = new RegExp(/include.*/gm);
    let rawList = str.match(re);

    rawList.map((str, i, arr) => {
        arr[i] = str.match(/(?<=\w\/)(.*(?=\/))/)[0];
    });

    rawList = removeDuplicates(rawList);

    return rawList;
}

function getDependencies(comp: string[]): string[] {
    let res = [],
        i = 0;

    while (comp.length !== i) {
        const root = `common.blocks/${comp[i]}/${comp[i]}`,
              file = `${root}.deps.json`;

        if(!fs.existsSync(path.resolve(__dirname, file))) {
            i = i + 1;
            console.log(`File ${file} doesn't exist!`);
            continue;
        }

        const fd = fs.readFileSync(path.resolve(__dirname, file)),
              obj = JSON.parse(fd),
              depss = obj.deps || [],
              techs = obj.tech || [];

        depss.forEach(
            (deps) => { 
                if (!comp.includes(deps)) {
                    comp.push(deps)
                }
            }
        );

        techs.forEach(
            (tech) => res.push(`import "./${root}.${tech}"`)
        );
        
        i = i + 1;
    }

    return res;
}

function removeDuplicates(arr: string[]): string[] {
    return arr.filter(
        (val, index, arr) => arr.indexOf(val) === index
    );
}