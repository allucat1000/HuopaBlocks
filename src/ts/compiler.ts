import { type BlockNode, type ValueNode, Type } from "./types";

let extraEndSymbols = "";
export function compile(AST: Array<BlockNode>) {
    extraEndSymbols = "";
    return addBoilerplate(parseLayer(AST, true));
}

function addBoilerplate(code: string) {
    return `(function(__$runtime__){
    return function(thread){
        const shouldStop = () => thread.stopped;
        const retire = () => thread.stopped = true;
        const pauseUntil = (t) => thread.paused = t;
        return function* () {
${code}
            ${extraEndSymbols}
        }
    }
})`;
}

function toType(t: Type) {
    if (t === Type.bool) return "boolean";
    if (t === Type.num) return "number";
    if (t === Type.str) return "string";
    if (t === Type.obj) return "object";
    return "undefined";
}

function castValue(val: string, t: string, stringifyString: boolean = true): number|boolean|string|object|undefined {
    if (t === "boolean") return !!val;
    if (t === "number") return Number(val);
    if (t === "string") return stringifyString ? JSON.stringify(val) : val;
    if (t === "object") return JSON.parse(val);
    return undefined;
}

function parseExpr(r: BlockNode | ValueNode, stringifyString: boolean = true) {
    if ("value" in r) {
        const line = r as ValueNode;
        return castValue(line.value, toType(line.type), stringifyString);
        
    } else if ("op" in r) {
        const line = r as BlockNode;
        return parseLayer(line.children, true);
    }
}

function parseBlock(r: BlockNode) {
    switch (r.op) {
        case "DEBUG_LOG":
            return `console.log(${parseLayer(r.children, true)})`;
            break;

        case "OPERATOR_ADD":{
            const le = parseExpr(r.children[0])?.toString();
            const ri = parseExpr(r.children[1])?.toString()
            return `${le}+${ri}`;
        }
        case "DEBUG_BOOL":
            return true;
            break;

        case "DEBUG_ERROR":
            return `throw new Error(${parseLayer(r.children, true)})`;
            break;

        case "EVENTS_PROJECT_START":
            extraEndSymbols += "}; });";
            return `__$runtime__.events.start.push(function(thread){
const shouldStop = () => thread.stopped;
const retire = () => thread.stopped = true;
const pauseUntil = (t) => thread.paused = t;
return function* () {`;
            break;

        case "JSINJECT_PATCH1":
            return `${parseExpr(r.children[0], false)}`;
        case "JSINJECT_PATCH2":
            return `${parseExpr(r.children[0], false)}${parseExpr(r.children[1], false)}`;
        case "JSINJECT_PATCH3":
            return `${parseExpr(r.children[0], false)}${parseExpr(r.children[1], false)}${parseExpr(r.children[2], false)}`;

        case "CONTROL_WAIT":
            return `pauseUntil(__$runtime__.getTime() + (${Number(parseExpr(r.children[0])) * 1000})); yield`;

        case "CONTROL_STOP_ALL":
            return `__$runtime__.stopAllThreads(); yield`
            break;

        case "OPERATORS_ADD":
            const le = parseExpr(r.children[0])?.toString();
            const ri = parseExpr(r.children[1])?.toString()
            return `${le}+${ri}`;
        default:
            console.warn(`[COMPILER] Unrecognized OPCODE ${r.op}`)
            break;
    }
}

function parseLayer(lay: Array<BlockNode | ValueNode>, args: boolean) {
    let str = "";
    for (const r of lay) {
        if ("op" in r)
            str += parseBlock(r) + "\n";
        else 
            str += parseExpr(r) + "\n";
    }
    if (!args) str += "retire()\n";
    return str.trim();
}