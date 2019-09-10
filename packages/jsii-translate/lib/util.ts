import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import { renderTree, Source, translateTypeScript } from '.';
import { VisualizeAstVisitor } from './visitor';

export function startsWithUppercase(x: string) {
  return x.match(/^[A-Z]/);
}

export async function inTempDir<T>(block: () => Promise<T>): Promise<T> {
  const origDir = process.cwd();
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'jsii'));
  process.chdir(tmpDir);
  const ret = await block();
  process.chdir(origDir);
  await fs.remove(tmpDir);
  return ret;
}

export async function visualizeTypeScriptAst(source: Source) {
  const vis = await translateTypeScript(source, new VisualizeAstVisitor());
  return renderTree(vis.tree);
}
