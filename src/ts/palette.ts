import { NodeType, Shape, Type, type CategoryNode } from "./types";

export const palette: CategoryNode[] =  [
  {
    nodeType: NodeType.category,
    op: "EVENTS",
    title: "Events",
    color: "rgb(255, 190, 0)",
    borderColor: "rgb(227, 170, 0)",
    textColor: "#fff",
    children: [
      {
        id: "",
        nodeType: NodeType.block,
        op: "EVENTS_PROJECT_START",
        shape: Shape.top,
        category: "EVENTS",
        children: []
      }
    ]
  },
  {
    nodeType: NodeType.category,
    op: "CONTROL",
    title: "Control",
    color: "rgb(255, 162, 0)",
    borderColor: "rgb(200, 140, 0)",
    textColor: "#fff",
    children: [
      {
        id: "",
        nodeType: NodeType.block,
        op: "CONTROL_WAIT",
        shape: Shape.middle,
        category: "CONTROL",
        children: [
          {
            value: "3",
            nodeType: NodeType.value,
            type: Type.num
          }
        ]
      },
      {
        id: "",
        nodeType: NodeType.block,
        op: "CONTROL_STOP_ALL",
        shape: Shape.bottom,
        category: "CONTROL",
        children: []
      }
    ]
  },
  {
    op: "OPERATORS",
    nodeType: NodeType.category,
    title: "Operators",
    color: "#80ff00",
    borderColor: "#6ad400",
    textColor: "#fff",
    children: [
      {
        id: "",
        nodeType: NodeType.block,
        op: "OPERATORS_ADD",
        shape: Shape.reporter,
        category: "OPERATORS",
        children: [
          {
            value: "1",
            nodeType: NodeType.value,
            type: Type.num
          },
          {
            value: "2",
            nodeType: NodeType.value,
            type: Type.num
          }
        ]
      }
    ]
  },
  {
    nodeType: NodeType.category,
    op: "DEBUG",
    title: "Debugging",
    color: "#1bd3a5",
    borderColor: "#1ea886",
    textColor: "#fff",
    children: [
      {
        id: "",
        nodeType: NodeType.block,
        op: "DEBUG_LOG",
        shape: Shape.middle,
        category: "DEBUG",
        children: [
          {
            value: "Hello",
            nodeType: NodeType.value,
            type: Type.str
          }
        ]
      },
      {
        id: "",
        nodeType: NodeType.block,
        op: "DEBUG_ERROR",
        shape: Shape.bottom,
        category: "DEBUG",
        children: [
          {
            value: "Error!",
            nodeType: NodeType.value,
            type: Type.str
          }
        ]
      },
      {
        id: "",
        nodeType: NodeType.block,
        op: "DEBUG_BOOL",
        shape: Shape.boolean,
        children: [],
        category: "DEBUG"
      }
    ]
  },
  {
    nodeType: NodeType.category,
    op: "JSINJECT",
    title: "Patch blocks",
    color: "#1bd3a5",
    borderColor: "#1ea886",
    textColor: "#fff",
    children: [
      {
        id: "",
        nodeType: NodeType.block,
        op: "JSINJECT_PATCH1",
        shape: Shape.middle,
        category: "JSINJECT",
        children: [
          {
            value: "console.log('hi!')",
            nodeType: NodeType.value,
            type: Type.str
          }
        ]
      },
      {
        id: "",
        nodeType: NodeType.block,
        op: "JSINJECT_PATCH2",
        shape: Shape.middle,
        category: "JSINJECT",
        children: [
          {
            value: "console.log",
            nodeType: NodeType.value,
            type: Type.str
          },
          {
            value: "('yay')",
            nodeType: NodeType.value,
            type: Type.str
          }
        ]
      },
      {
        id: "",
        nodeType: NodeType.block,
        op: "JSINJECT_PATCH3",
        shape: Shape.middle,
        category: "JSINJECT",
        children: [
          {
            value: "console.log(",
            nodeType: NodeType.value,
            type: Type.str
          },
          {
            value: "'hello'",
            nodeType: NodeType.value,
            type: Type.str
          },
          {
            value: ")",
            nodeType: NodeType.value,
            type: Type.str
          },
        ]
      },
    ]
  }
];

  export const BlockContents: Record<string, string> = {
      "DEBUG_LOG": "Log $$",
      "DEBUG_BOOL": "true",
      "DEBUG_ERROR": "Throw $$",
      "EVENTS_PROJECT_START": "when project starts",
      "CONTROL_WAIT": "Wait $$ seconds",
      "JSINJECT_PATCH1": "Patch $$",
      "JSINJECT_PATCH2": "Patch $$ $$",
      "JSINJECT_PATCH3": "Patch $$ $$ $$",
      "CONTROL_STOP_ALL": "Stop all",

      "OPERATORS_ADD": "$$ + $$"
  }