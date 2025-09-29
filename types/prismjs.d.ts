declare module 'prismjs' {
  export interface Grammar {
    [key: string]: unknown;
  }

  export interface Environment {
    element?: Element;
    type?: string;
    content?: string;
    tag?: string;
    classes?: string[];
    attributes?: { [key: string]: string };
    language?: string;
    parent?: object;
  }

  export interface Token {
    type: string;
    content: string | Token[];
    tag?: string;
    classes?: string[];
    attributes?: { [key: string]: string };
    language?: string;
  }

  export function highlight(text: string, grammar: Grammar, language: string): string;
  export function highlightAll(): void;
  export function highlightAllUnder(container: Element): void;
  export function highlightElement(element: Element): void;

  export const languages: { [key: string]: Grammar };
  export const plugins: Record<string, unknown>;
  export const hooks: {
    add: (name: string, callback: (env: Environment) => void) => void;
    run: (name: string, env: Environment) => void;
  };

  export const util: {
    encode: (tokens: Token[]) => Token[];
    type: (o: unknown) => string;
    objId: (obj: object) => string;
    clone: (o: object) => object;
  };

  export const Token: {
    new (type: string, content: string | Token[], alias?: string): Token;
    stringify: (token: Token | string, language: string) => string;
  };
}

declare module 'prismjs/components/*' {
  const component: Record<string, unknown>;
  export = component;
}
