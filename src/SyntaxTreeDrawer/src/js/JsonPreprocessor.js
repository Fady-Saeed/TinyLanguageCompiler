const containers = {
    "ellipse": "ellipse",
    "rectangle": "rect"
}

const types = {
    "stmt_sequence": "stmt_sequence",
    "read": "read",
    "factor": "factor",
    "assign": "assign",
    "write": "write",
    "exp": "exp",
    "simple_exp": "simple_exp",
    "if": "if",
    "repeat": "repeat",
    "then": "then",
    "else": "else",
    "term": "term"
};

const keys = {
    "identifier": "identifier",
    "name": "name",
    "op": "op"
};

const properties = {
    "id": "id",
    "no_parent": "no_parent",
    "hidden": "hidden"
};
const factorTypes = {
    "const": "const",
    "id": "id"
}
class JsonPreprocessor {

    constructor(json) {
        this.json = json;
        this.syntaxTree;
        this.nodeRefrences = [];
        this.counter = 0;
        this.siblings = [];
    }

    stmtSequenceToChildren(currentNode) {
        if (currentNode.children === undefined)
            currentNode.children = [];
        if (currentNode.rhs === undefined && currentNode.type === types.stmt_sequence) {
            return currentNode;
        } else if (currentNode.rhs) {
            currentNode.children.push(this.stmtSequenceToChildren(currentNode.lhs));
            currentNode.children.push(this.stmtSequenceToChildren(currentNode.rhs));
        } else if (currentNode.type === types.if) {
            currentNode.children.push(this.stmtSequenceToChildren(currentNode.test));
            currentNode.children.push(this.stmtSequenceToChildren(currentNode.then));
            if (currentNode.else !== "null")
                currentNode.children.push(this.stmtSequenceToChildren(currentNode.else));
        }
        return currentNode;
    }
    preprocess() {
        let nodes = this.generateNode({ ...this.json
    });
        let tree = this.generateJSON({ ...nodes
    });
        let cleanTree = this.cleanChildrenArrays({ ...tree
    });
        this.syntaxTree = tree;
    }
    getSyntaxTree() {
        return this.syntaxTree;
    }
    getSiblingsArray() {
        return this.siblings;
    }
    generateNode(currentNode, hasParent = true) {
        let node = {};
        let currentCounter = this.counter++;
        currentNode.id = currentCounter;
        switch (currentNode.type) {
            case types.repeat:
                node = {
                    id: currentCounter++,
                    name: `${currentNode.type}`,
                    no_parent: !hasParent,
                    children: [
                        this.generateNode(currentNode.body),
                        this.generateNode(currentNode.test)
                    ],
                    container: containers.rectangle
                }
                break;
            case types.if:
                node = {
                    id: currentCounter++,
                    name: `${currentNode.type}`,
                    no_parent: !hasParent,
                    children: (currentNode.else != "null") ? [
                        this.generateNode(currentNode.test),
                        this.generateNode(currentNode.then),
                        this.generateNode(currentNode.else)
                    ] : [
                        this.generateNode(currentNode.test),
                        this.generateNode(currentNode.then)
                    ],
                    container: containers.rectangle
                }
                break;
            case types.read:
                node = {
                    id: currentCounter++,
                    name: `${currentNode.type}(${currentNode.identifier})`,
                    no_parent: !hasParent,
                    container: containers.rectangle
                }
                break;
            case types.assign:
                node = {
                    id: currentCounter++,
                    name: `${currentNode.type}(${currentNode.identifier})`,
                    no_parent: !hasParent,
                    children: [
                        this.generateNode(currentNode.exp, true)
                    ],
                    container: containers.rectangle
                }
                break;
            case types.write:
                node = {
                    id: currentCounter++,
                    name: `${currentNode.type}`,
                    no_parent: !hasParent,
                    children: [
                        this.generateNode(currentNode.exp, true)
                    ],
                    container: containers.rectangle
                }
                break;
            case types.term:
            case types.exp:
            case types.simple_exp:
                node = {
                    id: currentCounter++,
                    name: `${keys.op}(${currentNode.op})`,
                    no_parent: !hasParent,
                    children: [
                        this.generateNode(currentNode.lhs),
                        this.generateNode(currentNode.rhs)
                    ],
                    container: containers.ellipse
                }
                break;
            case types.factor:
                node = {
                    id: currentCounter++,
                    name: ((isNaN(Number(currentNode.value))) ? `${factorTypes.id}` : `${factorTypes.const}`) + `(${currentNode.value})`,
                    no_parent: !hasParent,
                    container: containers.ellipse
                }
                break;
            case types.stmt_sequence:
                let children = [];
                let numberOfConnectedChildren = currentNode.children.length;
                currentNode.children.map((child, i) => children.push(this.generateNode(child, i === 0 && currentCounter > 0)))
                node = {
                    id: currentCounter++,
                    name: "",
                    hidden: true,
                    no_parent: true,
                    children: children,
                    container: containers.rectangle
                }
                for (let i = 1; i < currentNode.children.length; i++)
                    this.siblings.push({
                        source: {
                            id: currentNode.children[i - 1].id
                        },
                        target: {
                            id: currentNode.children[i].id
                        }
                    });
                break;
        }
        this.nodeRefrences[currentCounter - 1] = node;
        return node;
    }
    siftUpEmptyNodes(currentNode) {
        let toBeDeleted = [];
        if (currentNode.children && currentNode.children.length > 0) {
            for (let childCounter = 0; childCounter < currentNode.children.length; childCounter++) {
                if (currentNode.children[childCounter] && currentNode.children[childCounter].name === "") {
                    for (let c = 0; c < currentNode.children[childCounter].children.length; c++) {
                        currentNode.children.push(currentNode.children[childCounter].children[c])
                    }
                    toBeDeleted.push(childCounter);
                }
            }
            for (let i = 0; i < toBeDeleted.length; i++)
                if (currentNode.children[toBeDeleted[i]])
                    delete currentNode.children[toBeDeleted[i]]

            currentNode.children.filter(() => {
                return true;
        })
        }

    }
    // generateSiblingsArray(currentNode,parentId,visitedArr = []){
    //     if(currentNode.no_parent){

    //     }else{
    //         visitedArr[currentNode.id] = true;
    //         for(let i=0;i<currentNode.children.length; i++)
    //             generateSiblingsArray(currentNode.children[i],currentNode.id,visitedArr);
    //     }
    // }

    generateJSON(currentNode) {
        if (currentNode && currentNode.children) {
            for (let i = 0; i < currentNode.children.length; i++) {
                this.generateJSON(currentNode.children[i]);
                this.siftUpEmptyNodes(currentNode);
            }
        }
        return currentNode
    }
    cleanChildrenArrays(currentNode) {
        if (!currentNode.children || currentNode.children.length === 0)
            return;

        currentNode.children = currentNode.children.filter(() => true)
        for (let i = 0; i < currentNode.children.length; i++)
            if (currentNode)
                this.cleanChildrenArrays(currentNode.children[i]);
    }
}