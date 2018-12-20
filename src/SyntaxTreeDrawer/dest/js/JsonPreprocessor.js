"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var containers = {
    "ellipse": "ellipse",
    "rectangle": "rect"
};

var types = {
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

var keys = {
    "identifier": "identifier",
    "name": "name",
    "op": "op"
};

var properties = {
    "id": "id",
    "no_parent": "no_parent",
    "hidden": "hidden"
};
var factorTypes = {
    "const": "const",
    "id": "id"
};

var JsonPreprocessor = function () {
    function JsonPreprocessor(json) {
        _classCallCheck(this, JsonPreprocessor);

        this.json = json;
        this.syntaxTree;
        this.nodeRefrences = [];
        this.counter = 0;
        this.siblings = [];
    }

    _createClass(JsonPreprocessor, [{
        key: "stmtSequenceToChildren",
        value: function stmtSequenceToChildren(currentNode) {
            if (currentNode.children === undefined) currentNode.children = [];
            if (currentNode.rhs === undefined && currentNode.type === types.stmt_sequence) {
                return currentNode;
            } else if (currentNode.rhs) {
                currentNode.children.push(this.stmtSequenceToChildren(currentNode.lhs));
                currentNode.children.push(this.stmtSequenceToChildren(currentNode.rhs));
            } else if (currentNode.type === types.if) {
                currentNode.children.push(this.stmtSequenceToChildren(currentNode.test));
                currentNode.children.push(this.stmtSequenceToChildren(currentNode.then));
                if (currentNode.else !== "null") currentNode.children.push(this.stmtSequenceToChildren(currentNode.else));
            }
            return currentNode;
        }
    }, {
        key: "preprocess",
        value: function preprocess() {
            var nodes = this.generateNode(_extends({}, this.json));
            var tree = this.generateJSON(_extends({}, nodes));
            var cleanTree = this.cleanChildrenArrays(_extends({}, tree));
            this.syntaxTree = tree;
        }
    }, {
        key: "getSyntaxTree",
        value: function getSyntaxTree() {
            return this.syntaxTree;
        }
    }, {
        key: "getSiblingsArray",
        value: function getSiblingsArray() {
            return this.siblings;
        }
    }, {
        key: "generateNode",
        value: function generateNode(currentNode) {
            var _this = this;

            var hasParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var node = {};
            var currentCounter = this.counter++;
            currentNode.id = currentCounter;
            switch (currentNode.type) {
                case types.repeat:
                    node = {
                        id: currentCounter++,
                        name: "" + currentNode.type,
                        no_parent: !hasParent,
                        children: [this.generateNode(currentNode.body), this.generateNode(currentNode.test)],
                        container: containers.rectangle
                    };
                    break;
                case types.if:
                    node = {
                        id: currentCounter++,
                        name: "" + currentNode.type,
                        no_parent: !hasParent,
                        children: currentNode.else != "null" ? [this.generateNode(currentNode.test), this.generateNode(currentNode.then), this.generateNode(currentNode.else)] : [this.generateNode(currentNode.test), this.generateNode(currentNode.then)],
                        container: containers.rectangle
                    };
                    break;
                case types.read:
                    node = {
                        id: currentCounter++,
                        name: currentNode.type + "(" + currentNode.identifier + ")",
                        no_parent: !hasParent,
                        container: containers.rectangle
                    };
                    break;
                case types.assign:
                    node = {
                        id: currentCounter++,
                        name: currentNode.type + "(" + currentNode.identifier + ")",
                        no_parent: !hasParent,
                        children: [this.generateNode(currentNode.exp, true)],
                        container: containers.rectangle
                    };
                    break;
                case types.write:
                    node = {
                        id: currentCounter++,
                        name: "" + currentNode.type,
                        no_parent: !hasParent,
                        children: [this.generateNode(currentNode.exp, true)],
                        container: containers.rectangle
                    };
                    break;
                case types.term:
                case types.exp:
                case types.simple_exp:
                    node = {
                        id: currentCounter++,
                        name: keys.op + "(" + currentNode.op + ")",
                        no_parent: !hasParent,
                        children: [this.generateNode(currentNode.lhs), this.generateNode(currentNode.rhs)],
                        container: containers.ellipse
                    };
                    break;
                case types.factor:
                    if (_typeof(currentNode.value) === "object") {
                        node = this.generateNode(currentNode.value);
                    } else {
                        node = {
                            id: currentCounter++,
                            name: (isNaN(Number(currentNode.value)) ? "" + factorTypes.id : "" + factorTypes.const) + ("(" + currentNode.value + ")"),
                            no_parent: !hasParent,
                            container: containers.ellipse
                        };
                    }
                    break;
                case types.stmt_sequence:
                    var children = [];
                    var numberOfConnectedChildren = currentNode.children.length;
                    currentNode.children.map(function (child, i) {
                        return children.push(_this.generateNode(child, i === 0 && currentCounter > 0));
                    });
                    node = {
                        id: currentCounter++,
                        name: "",
                        hidden: true,
                        no_parent: true,
                        children: children,
                        container: containers.rectangle
                    };
                    for (var i = 1; i < currentNode.children.length; i++) {
                        this.siblings.push({
                            source: {
                                id: currentNode.children[i - 1].id
                            },
                            target: {
                                id: currentNode.children[i].id
                            }
                        });
                    }break;
            }
            this.nodeRefrences[currentCounter - 1] = node;
            return node;
        }
    }, {
        key: "siftUpEmptyNodes",
        value: function siftUpEmptyNodes(currentNode) {
            var toBeDeleted = [];
            if (currentNode.children && currentNode.children.length > 0) {
                for (var childCounter = 0; childCounter < currentNode.children.length; childCounter++) {
                    if (currentNode.children[childCounter] && currentNode.children[childCounter].name === "") {
                        for (var c = 0; c < currentNode.children[childCounter].children.length; c++) {
                            currentNode.children.push(currentNode.children[childCounter].children[c]);
                        }
                        toBeDeleted.push(childCounter);
                    }
                }
                for (var i = 0; i < toBeDeleted.length; i++) {
                    if (currentNode.children[toBeDeleted[i]]) delete currentNode.children[toBeDeleted[i]];
                }currentNode.children.filter(function () {
                    return true;
                });
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

    }, {
        key: "generateJSON",
        value: function generateJSON(currentNode) {
            if (currentNode && currentNode.children) {
                for (var i = 0; i < currentNode.children.length; i++) {
                    this.generateJSON(currentNode.children[i]);
                    this.siftUpEmptyNodes(currentNode);
                }
            }
            return currentNode;
        }
    }, {
        key: "cleanChildrenArrays",
        value: function cleanChildrenArrays(currentNode) {
            if (!currentNode.children || currentNode.children.length === 0) return;

            currentNode.children = currentNode.children.filter(function () {
                return true;
            });
            for (var i = 0; i < currentNode.children.length; i++) {
                if (currentNode) this.cleanChildrenArrays(currentNode.children[i]);
            }
        }
    }]);

    return JsonPreprocessor;
}();