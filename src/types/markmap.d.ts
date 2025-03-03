
declare module 'markmap-lib' {
  export class Transformer {
    transform(markdown: string): { root: any };
  }
}

declare module 'markmap-view' {
  export class Markmap {
    static create(container: HTMLElement, options?: any, data?: any): Markmap;
  }
}
