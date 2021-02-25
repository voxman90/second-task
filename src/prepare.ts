const fs = require("fs");
const path = require("path");

const rawData = fs.readFileSync(path.resolve(__dirname, 'entry.json'));
const { entryPoints } = JSON.parse(rawData);

for (let entryPoint of entryPoints) {
    formEntry(entryPoint);
}

function formEntry(args: {name: string, template: string}): void {
    const { name, template } = args,
          rawData = fs.readFileSync(path.resolve(__dirname, `${template}.pug`), 'utf8'),
          comps = getComponents(rawData),
          { depss, techs } = getDependencies(comps);

    console.log("formEntry, comps ->\n", comps);
    console.log("formEntry, depss ->\n", depss);
    console.log("formEntry, removeDifference(depss, comps) ->\n", removeDifference(depss, comps));

    writeTechs(name, techs);
    writeDependensies(template, removeDifference(depss, comps));
}

function writeTechs(name: string, techs: string[]): void {
    const file = path.resolve(__dirname, `${name}.js`);
    let acc = "";
    
    techs.forEach(
        (tech) => acc += `import "${tech}";\n`
    );

    fs.open(file, "w+", (err, fd) => {
        fs.write(fd, acc, 0, 'utf8', () => {});
        fs.close(fd, () => {});
    });
}

function writeDependensies(template: string, depss: string[]): void {
    const root = "./common.blocks",
          file = path.resolve(__dirname, `${template}.pug`);
    let acc = "";
    
    depss.forEach(
        (deps) => acc += `include ${root}/${deps}/${deps}.pug\n`
    );
    
    const data = fs.readFileSync(file, "utf8"), 
          fd = fs.openSync(file, "w+");

    acc += data;
    console.log("writeDependensies, acc ->\n", acc);
    fs.writeSync(fd, acc, 0, 'utf8');
    fs.closeSync(fd);
}

function getComponents(file: string): string[] {
    const includes = new RegExp(/include.*/gm),
          mixins = new RegExp(/(?<=\+)[a-z\-]*?(?=\(|$)/gm);
    let rawList = [],
        acc = [];

    acc = file.match(includes);
    if (acc) {
        rawList.push(...acc);
        console.log("getComponents, includes ->\n", rawList);

        rawList.map((val, i, arr) => {
            arr[i] = val.match(/(?<=\w\/)(.*(?=\/))/)[0];
        });
    }

    acc = file.match(mixins);
    if (acc) {
        console.log("getComponents, mixins ->\n", acc);
        rawList.push(...acc);
    }
    rawList = removeDuplicates(rawList);

    return rawList;
}

function getDependencies(compsArg: string[]): {depss: string[], techs: string[]} {
    let acc = [],
        comps = [...compsArg],
        i = 0;

    while (comps.length !== i) {
        const root = `./common.blocks/${comps[i]}/${comps[i]}`,
              file = `${root}.deps.json`;

        if(!fs.existsSync(path.resolve(__dirname, file))) {
            console.log(`File ${file} doesn't exist!`);
            comps.splice(i, 1);
        } else {
            const fd = fs.readFileSync(path.resolve(__dirname, file)),
                  obj = JSON.parse(fd),
                  depss = obj.deps || [],
                  techs = obj.tech || [];

            depss.forEach(
                (deps) => { 
                    if (!comps.includes(deps)) {
                        comps.push(deps)
                    }
                }
            );

            techs.forEach(
                (tech) => acc.push(`${root}.${tech}`)
            );

            i = i + 1;
        }
    }

    return {
        depss: comps,
        techs: acc
    }
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