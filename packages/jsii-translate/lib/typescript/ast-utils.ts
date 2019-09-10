import ts = require('typescript');

export function stripCommentMarkers(comment: string, multiline: boolean) {
  if (multiline) {
    return comment
      .replace(/^\/(\*)+( )?/gm, '')
      .replace(/\*\/\s*$/gm, '')
      .replace(/^ \*( )?/gm, '');
  } else {
    return comment.replace(/^\/\/ /gm, '');
  }
}

/**
 * Extract the literal module name from a ModuleReference
 */
export function extractModuleName(ref: ts.ModuleReference) {
  if (ts.isExternalModuleReference(ref)) {
    return stringFromLiteral(ref.expression);
  }

  return '???';
}

export function stringFromLiteral(expr: ts.Expression) {
  if (ts.isStringLiteral(expr)) {
    return expr.text;
  }
  return '???';
}

export function isStarImport(expr: ts.Expression) {