'use strict';

(function() {
  const fs = require("fs");
  const path = require("path");

  const TECH_EXT = ['.js', '.scss', '.pug'];
  const COMPONENT_DIR = './common.blocks'

  const subdirs = getSubdir(path.resolve(__dirname, COMPONENT_DIR));
  subdirs.forEach(createDepsJSON);

  function getSubdir(source) {
    return fs.readdirSync(source, { withFileTypes: true })
      .filter((ent) => ent.isDirectory())
      .map((dir) => dir.name);
  }

  function getPath(root, ext) {
    return path.resolve(__dirname, `${root}${ext}`);
  }

  function createDepsJSON(componentName: string): void {
    const root = `${COMPONENT_DIR}/${componentName}/${componentName}`;
    const ext = `.deps.json`
    const depsPath = getPath(root, ext);
    const isDepsFileAlreadyExists = fs.existsSync(depsPath);

    if (isDepsFileAlreadyExists) {
      return void 0;
    }

    const depsObj = {
      name: componentName,
      techs: extractTechs(root),
      deps: extractDeps(root),
    }
    const depsJSON = JSON.stringify(depsObj, null, 2) + '\n';

    fs.writeFileSync(depsPath, depsJSON);
  }

  function extractDeps(root) {
    const templatePath = getPath(root, '.pug');

    if (!fs.existsSync(templatePath)) {
      return null;
    }

    const templateData = fs.readFileSync(templatePath, 'utf8');

    const mixins = extractMixins(templateData);
    const includes = extractIncludes(templateData);
    const comps = removeDuplicates([...mixins, ...includes]);

    return (comps.length !== 0) ? comps : null;
  }

  function extractMixins(templateData: string): string[] {
    const isMixin = new RegExp(/(?<=\+)[a-z\-]*?(?=\(|$)/gm);
    const mixins = templateData.match(isMixin) || [];

    return mixins;
  }

  function extractIncludes(templateData: string): string[] {
    const isInclude = new RegExp(/include.*/gm);
    let includes = templateData.match(isInclude) || [];

    const isComponentName = new RegExp(/(?<=\w\/)(.*(?=\/))/);
    if (includes.length !== 0) {
      includes.map((include, i, arr) => {
        arr[i] = include.match(isComponentName)[0];
      });
    }

    return includes;
  }

  function removeDuplicates(arr: string[]): string[] {
    return arr.filter(
      (val, index, arr) => arr.indexOf(val) === index
    );
  }

  function extractTechs(root: string): string[] {
    const techs = [];

    TECH_EXT.forEach((ext) => {
      const techPath = getPath(root, ext);

      if (fs.existsSync(path.resolve(__dirname, techPath))) {
        techs.push(ext.substring(1));
      }
    });

    return (techs.length !== 0) ? techs : null;
  }
}());
