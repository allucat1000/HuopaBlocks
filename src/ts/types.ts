export enum Type {
    str = "str",
    num = "num",
    bool = "bool",
    obj = "obj"
};

export enum BlockNodeContentType {
    text = "text",
    value = "value"
}

export enum Shape {
    middle = "middle",
    top = "top",
    bottom = "bottom",
    boolean = "boolean",
    reporter = "reporter"
};

export enum NodeType {
    operator = "operator",
    value = "value", 
    block = "block",
    category = "category"
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