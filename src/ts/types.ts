export enum Type {
    str,
    num,
    bool,
    obj,
    block
};

export enum BlockNodeContentType {
    text,
    value
}

export enum Shape {
    middle,
    top,
    bottom,
    boolean,
    reporter
};

export enum Operator {
    add,
    sub,
    mult,
    div,
    pow,
    sqrt
}

export enum NodeType {
    operator,
    value, 
    block,
    category
}

export interface BlockStyle {
    color: string;
    borderColor: string;
    textColor: string;
}

export interface BlockNodeContent {
    type: BlockNodeContentType;
    op?: string;
    value: BlockNode | string;
    accepts?: Array<Type>;
};

export interface ValueNode {
    nodeType: NodeType;
    type: Type;
    value: string;
};

export interface BlockNode {
    nodeType: NodeType;
    op: string;
    children: Array<ValueNode | BlockNode>;
    shape: Shape;
    category: string;
    id: string;
};

export interface CategoryNode {
    nodeType: NodeType;
    op: string;
    title: string;
    children: Array<BlockNode>
    color: string;
    borderColor: string;
    textColor: string;
}

export interface Variable {
    value: string;
    type: Type;
}

export interface ProjectHeader {
    name: string;
    description: string;
    blocks: Array<ScriptNode>;
    variables: Record<string, Variable>;
}

export interface ScriptNode {
    x: number;
    y: number;
    id: string;
    children: Array<BlockNode>
}

export type BlockReference = {
    block: BlockNode;
    script: ScriptNode;
    index: number;
};

export enum PopupElementTag {
    p = "p",
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    pre = "pre",
    code = "code",
    br = "br"
};

export interface PopupElementObject {
    tag: PopupElementTag,
    content: string;
    class: string
}

export interface EventObject {
    start: Array<Function>;
}

export interface Theme {
    dark: boolean;
}