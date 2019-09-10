export interface OTreeOptions {
  /**
   * Add a newline at the end of the prefix.
   *
   * Newline is subject to new indentation.
   */
  newline?: boolean;

  /**
   * Adjust indentation with the given number
   */
  indent?: number;

  /**
   * Separate children with the given string
   */
  separator?: string;

  /**
   * Suffix the token after outdenting
   */
  suffix?: string;
}

export class OTree {
  constructor(
    private readonly prefix: Array<string | OTree>,
    private readonly children?: OTree[],
    private readonly options: OTreeOptions = {}) {
  }

  public write(sink: OTreeSink) {
    const indent = this.options.indent || 0;

    const xs = Array.isArray(this.prefix) ? this.prefix : [this.prefix];
    for (const x of xs) {
      sink.write(x);
    }

    sink.adjustIndent(indent);
    if (this.options.newline) { sink.newline(); }

    let first = true;
    for (const child of this.children || []) {
      if (!first && this.options.separator) { sink.write(this.options.separator); }
      first = false;

      child.write(sink);
    }

    sink.adjustIndent(-indent);

    if (this.options.suffix) {
      sink.write(this.options.suffix);
    }
  }

  public toString() {
    return `<INCORRECTLY STRINGIFIED ${this.prefix}>`;
  }
}

export const EMPTY_NODE = new OTree([]);

export class UnknownSyntax extends OTree {
}

export class OTreeSink {
  private indent = 0;
  private readonly fragments = new Array<string>();

  public write(text: string | OTree) {
    if (text instanceof OTree) {
      text.write(this);
    } else {
      this.append(text.replace(/\n/g, '\n' + ' '.repeat(this.indent)));
    }
  }

  public newline() {
    this.write('\n');
  }

  public adjustIndent(x: number) {
    this.indent += x;
  }

  public toString() {
    // Strip trailing whitespace from every line
    return this.fragments.join('').replace(/[ \t]+$/gm, '');
  }

  private append(x: string) {
    this.fragments.push(x);
  }
}