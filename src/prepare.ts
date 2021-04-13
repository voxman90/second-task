'use strict';

class Vertex {
  value: number | string;
  links: Vertex[];
  [key: string]: any;

  constructor(value: number | string) {
    this.value = (typeof value !== undefined) ? value : null;
    this.links = [];
  }

  linkVertex(vertex: Vertex) {
    this.links.push(vertex);
  }

  setValue(value: number | string) {
    this.value = value;
  }
}

class Graph {
  vertices: Vertex[];

  constructor() {
    this.vertices = [];
  }

  addVertex(vertex: Vertex): void {
    this.vertices.push(vertex);
  }
}

class ComponentsGraph extends Graph {
  getTechs(): { templates: string[], styles: string[], scripts: string[] } {
    const templates = [];
    const styles = [];
    const scripts = [];

    this.vertices.forEach((vertex) => {
      if (vertex.techs.includes('pug')) {
        templates.unshift(vertex.value);
      }

      if (vertex.techs.includes('scss')) {
        styles.unshift(vertex.value);
      }

      if (vertex.techs.includes('js')) {
        scripts.unshift(vertex.value);
      }
    });

    return { templates, styles, scripts };
  }
}

// A wrapper class for topological sorting
class TopologicalSort {
  list: Vertex[];
  stack: Vertex[];

  constructor(graph: Graph) {
    this.list = [];
    this.stack = [];

    const isMoreThenOneVertex = graph.vertices.length > 0;
    if (isMoreThenOneVertex) {
      this.sort(graph);
      this.removeServiceProperties();
    }

    graph.vertices = [...this.stack];
  }

  sort(graph: Graph) {
    graph.vertices.forEach(
      (vertex) => vertex.color = 'white'
    );

    this.list.push(graph.vertices[0]);

    let done = false;
    while (!done) {
      const lastAddedVertex = this.list[this.list.length - 1];
      this.bypass(lastAddedVertex);
      done = true;

      graph.vertices.some(
        (vertex) => {
          if (vertex.color === 'white') {
            this.list.push(vertex);
            done = false;
            return true;
          }
        }
      );
    }
  }

  bypass(root: Vertex) {
    root.color = 'grey';

    root.links.forEach((vertex) => {
      if (vertex.color === 'white') {
        this.list.push(vertex);
        this.bypass(vertex);
      } else if (vertex.color === 'grey') {
        console.log(`(TopologicalSort -> sort -> bypass) Loop found, sorting is not possible [vertex = ${vertex}]`);
      }
    });

    root.color = 'black';
    this.stack.unshift(root);
  }

  removeServiceProperties() {
    this.stack.forEach((vertex) => {
      delete vertex.color;
    });
  }
}

(function() {
  type entry = { name: string, template: string, styles?: string[], scripts?: string[] };

  const fs = require('fs');
  const path = require('path');

  const ENTRIES_JSON_PATH = './entries.json';
  const COMPONENTS_DIR = './common.blocks';
  const TEMPLATES_DIR = './templates';

  const PREPEND_STYLES = [
    './styles/style.scss',
  ];

  prepareEntries();

  function prepareEntries() {
    const pathToEntriesJSON = path.resolve(__dirname, ENTRIES_JSON_PATH);
    const fd = fs.readFileSync(pathToEntriesJSON);
    const { entries } = JSON.parse(fd);

    entries.forEach((entry) => {
      prepareEntry(entry);
    });
  }

  function prepareEntry(args: entry): void {
    const { name: entryName, template: templateName } = args;
    const templatePath = getTemplatePath(entryName, templateName);
    let templateData = fs.readFileSync(templatePath, 'utf8');

    templateData = removePrependingIncludes(templateData);

    let { includes, mixins, components } = extractComponents(templateData);

    const graph = createComponentGraph(components);
    new TopologicalSort(graph);
    const { templates, styles, scripts } = graph.getTechs();
    const missingComponentIncludes = removeDifference(templates, includes);

    writeIncludesToTemplate(missingComponentIncludes, templatePath, templateData);
    writeImportsToEntryJS(args, styles, scripts);
  }

  function createComponentGraph(components: string[]): ComponentsGraph {
    const graph = new ComponentsGraph();

    graph.vertices = createComponentsVertexList(components);

    return graph;
  }

  function createComponentsVertexList(componentsFromTemplate: string[]): Vertex[] {
    const components = [...componentsFromTemplate];
    const vertices = [];

    /* Add vertices for components with the specified dependencies (in file with ".deps.json" extension).
     * And also add vertices for the unique components available through dependencies.
     */
    let i = 0;
    while (components.length !== i) {
      const componentName = components[i]
      const pathToDepsJSON = getComponentPath(componentName, '.deps.json');

      if (!fs.existsSync(pathToDepsJSON)) {
        console.log(`(createComponentsVertexList) File doesn't exist! [file = ${pathToDepsJSON}]`);
        components.splice(i, 1);
      } else {
        const componentVertex = createComponentVertex(pathToDepsJSON);
        updateComponentList(components, componentVertex);
        vertices.push(componentVertex);
        i += 1;
      }
    }

    /* In accordance with the dependencies, links are added to the vertices of the corresponding components.
     * If there is no component for the dependency, then the dependency is removed.
     */
    vertices.forEach(
      (vertex) => setVertexLinks(vertex, vertices, components)
    );

    return vertices;
  }

  function createComponentVertex(depsPath: string): Vertex {
    const fd = fs.readFileSync(depsPath);
    const depsObj = JSON.parse(fd);
    let { name, deps, techs } = depsObj;

    const vertex = new Vertex(name);
    vertex.deps = deps || [];
    vertex.techs = techs || [];

    return vertex;
  }

  function updateComponentList(components: string[], componentVertex: Vertex): void {
    const dependencies = componentVertex.deps;

    // Dependencies are specified as an array of names of the components that this component depends on.
    dependencies.forEach((dependency) => {
      if (!components.includes(dependency)) {
        components.push(dependency);
      }
    });
  }

  function setVertexLinks(vertex: Vertex, vertices: Vertex[], components: string[]): void {
    const dependencies = vertex.deps;

    let i = 0;
    while (i < dependencies.length) {
      const dependency = dependencies[i];

      /* The vertices were added in the same order as the components.
       * Therefore, the index of the component is equal to the index of the corresponding vertex.
       */
      if (components.includes(dependency)) {
        const vertexIndex = components.indexOf(dependency);
        const link = vertices[vertexIndex];
        vertex.links.push(link);
        i += 1;
      } else {
        vertex.deps.splice(i, 1);
      }
    };
  }

  function writeIncludesToTemplate(components: string[], templatePath: string, templateData: string): void {
    const includes = writeIncludesToString(components, templatePath);
    const data = includes + templateData;

    const fd = fs.openSync(templatePath, 'w+');
    fs.writeSync(fd, data, 0, 'utf8');
    fs.closeSync(fd);
  }

  function writeIncludesToString(components: string[], templatePath: string): string {
    const reduceComponentToInclude = (str, component) => {
      const componentTemplatePath = getComponentRelativePath(templatePath, component, '.pug');
      str += `include ${componentTemplatePath}\n`;
      return str;
    };

    const includes = components.reduce(reduceComponentToInclude, '');

    return includes;
  }

  function removePrependingIncludes(templateData: string): string {
    const templateDataLines = templateData.split('\n');
    const isStartWithInclude = new RegExp(/^include/);

    while (isStartWithInclude.test(templateDataLines[0])) {
      templateDataLines.splice(0, 1);
    }

    return templateDataLines.join('\n');
  }

  function writeImportsToEntryJS(args: entry, componentStyles: string[], componentScripts: string[]): void {
    const { name: entryName } = args;
    const entryPath = path.resolve(__dirname, `${entryName}.entry.js`)

    const imports = writeImportsToString(args, componentStyles, componentScripts, entryPath);

    const fd = fs.openSync(entryPath, 'w+');
    fs.writeSync(fd, imports, 0, 'utf8');
    fs.closeSync(fd);
  }

  function writeImportsToString(args: entry, componentStyles: string[], componentScripts: string[], entryPath: string): string {
    const prepImports = getPrependImports(entryPath);
    const componentStyleImports = getComponentStyleImports(componentStyles, entryPath);
    const componentScriptImports = getComponentScriptImports(componentScripts, entryPath);
    const entryImports = getEntryImports(args);

    const imports = `${prepImports}${componentStyleImports}${componentScriptImports}${entryImports}`;

    return imports;
  }

  function getPrependImports(entryPath: string): string {
    const reduceStyleToImport = (str, stylePath) => {
      const relativeStylePath = getRelativePath(entryPath, stylePath);
      str += `import '${relativeStylePath}';\n`;
      return str;
    };
    const imports = PREPEND_STYLES.reduce(reduceStyleToImport, '');

    return imports;
  }

  function getComponentStyleImports(componentStyles: string[], entryPath: string): string {
    const reduceComponentStyleToImport = makeComponentTechToImportReducer(entryPath, '.scss');
    const imports = componentStyles.reduce(reduceComponentStyleToImport, '');

    return imports;
  }

  function getComponentScriptImports(componentScripts: string[], entryPath: string): string {
    const reduceComponentScriptToImport = makeComponentTechToImportReducer(entryPath, '.js');
    const imports = componentScripts.reduce(reduceComponentScriptToImport, '');

    return imports;
  }

  function makeComponentTechToImportReducer(entryPath: string, ext: string) {
    return (str: string, componentName: string) => {
      const relativeTechPath = getComponentRelativePath(entryPath, componentName, ext);
      str += `import '${relativeTechPath}';\n`;
      return str;
    }
  }

  function getEntryImports(args: entry): string {
    const { styles, scripts } = args;
    let imports = '';

    if (isArrayAndNotEmpty(styles)) {
      styles.forEach((style) => {
        imports += `import '${style}';\n`;
      });
    }

    if (isArrayAndNotEmpty(scripts)) {
      scripts.forEach((script) => {
        imports += `import '${script}';\n`;
      });
    }

    return (imports !== '') ? imports : '\n';
  }

  function extractComponents(templateData: string): { includes: string[], mixins: string[], components: string[] } {
    const mixins = extractMixins(templateData);
    const includes = extractIncludes(templateData);
    const components = removeDuplicates([...mixins, ...includes]);

    return { mixins, includes, components };
  }

  function extractMixins(templateData: string): string[] {
    const isMixin = new RegExp(/(?<=\+)[a-z\-]*?(?=\(|$)/gm);
    const mixins = templateData.match(isMixin) || [];

    return removeDuplicates(mixins);
  }

  function extractIncludes(templateData: string): string[] {
    const isInclude = new RegExp(/include.*/gm);
    let includes = templateData.match(isInclude) || [];

    const isComponentName = new RegExp(/(?<=\w\/)(.*(?=\/))/);
    if (isArrayAndNotEmpty(includes)) {
      includes.map((include, i, arr) => {
        arr[i] = include.match(isComponentName)[0];
      });
    }

    return removeDuplicates(includes);
  }

  function removeDuplicates(arr: string[]): string[] {
    return arr.filter(
      (val, i, arr) => arr.indexOf(val) === i
    );
  }

  function removeDifference(arr: string[], toRemove: string[]): string[] {
    return arr.filter(
      (val) => !toRemove.includes(val)
    );
  }

  function getComponentPath(componentName: string, ext: string): string {
    const root = `${COMPONENTS_DIR}/${componentName}/${componentName}`;
    return path.resolve(__dirname, `${root}${ext}`);
  }

  function getTemplatePath(entryName: string, templateName: string): string {
    const root = `${TEMPLATES_DIR}/${entryName}/${templateName}`;
    return path.resolve(__dirname, `${root}.pug`);
  }

  function getComponentRelativePath(fromPath: string, componentName: string, ext: string): string {
    const techPath = getComponentPath(componentName, ext);
    return getRelativePath(fromPath, techPath);
  }

  function getRelativePath(fromPath: string, toPath: string): string {
    const fromDir = path.dirname(fromPath);
    const absoluteToPath = path.resolve(__dirname, toPath);
    const normalizeRelativePath = path.relative(fromDir, absoluteToPath).replace(/\\/g, '/');
    const relativePath = ((/^\./).test(normalizeRelativePath)) ? normalizeRelativePath : `./${normalizeRelativePath}`;
    return relativePath;
  }

  function isArrayAndNotEmpty(value: string[] | null | undefined): boolean {
    return (
      value !== undefined
      && value !== null
      && value.length !== 0
    );
  }
}());
