(function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({

    1: [function (require, module, exports) {
        const weightedSearchAlgorithm = require("../pathfindingAlgorithms/weightedSearchAlgorithm");
        const unweightedSearchAlgorithm = require("../pathfindingAlgorithms/unweightedSearchAlgorithm");
        function launchAnimations(board, success, type, object, algorithm, heuristic) {
            let nodes = object ? board.objectNodesToAnimate.slice(0) : board.nodesToAnimate.slice(0);
            let speed = board.speed === "fast" ?
                0 : board.speed === "average" ?
                    100 : 500;
            let shortestNodes;
            function timeout(index) {
                setTimeout(function () {
                    if (index === nodes.length) {
                        if (object) {
                            board.objectNodesToAnimate = [];
                            if (success) {
                                board.addShortestPath(board.object, board.start, "object");
                                board.clearNodeStatuses();
                                let newSuccess;
                                if (board.currentAlgorithm === "bidirectional") {
                                } else {
                                    if (type === "weighted") {
                                        newSuccess = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm, heuristic);
                                    } else {
                                        newSuccess = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
                                    }
                                }
                                document.getElementById(board.object).className = "visitedObjectNode";
                                launchAnimations(board, newSuccess, type);
                                return;
                            } else {
                                console.log("Failure.");
                                board.reset();
                                board.toggleButtons();
                                return;
                            }
                        } else {
                            board.nodesToAnimate = [];
                            if (success) {
                                if (document.getElementById(board.target).className !== "visitedTargetNodeBlue") {
                                    document.getElementById(board.target).className = "visitedTargetNodeBlue";
                                }
                                if (board.isObject) {
                                    board.addShortestPath(board.target, board.object);
                                    board.drawShortestPathTimeout(board.target, board.object, type, "object");
                                    board.objectShortestPathNodesToAnimate = [];
                                    board.shortestPathNodesToAnimate = [];
                                    board.reset("objectNotTransparent");
                                } else {
                                    board.drawShortestPathTimeout(board.target, board.start, type);
                                    board.objectShortestPathNodesToAnimate = [];
                                    board.shortestPathNodesToAnimate = [];
                                    board.reset();
                                }
                                shortestNodes = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
                                return;
                            } else {
                                console.log("Failure.");
                                board.reset();
                                board.toggleButtons();
                                return;
                            }
                        }
                    } else if (index === 0) {
                        if (object) {
                            document.getElementById(board.start).className = "visitedStartNodePurple";
                        } else {
                            if (document.getElementById(board.start).className !== "visitedStartNodePurple") {
                                document.getElementById(board.start).className = "visitedStartNodeBlue";
                            }
                        }
                        if (board.currentAlgorithm === "bidirectional") {
                            document.getElementById(board.target).className = "visitedTargetNodeBlue";
                        }
                        change(nodes[index])
                    } else if (index === nodes.length - 1 && board.currentAlgorithm === "bidirectional") {
                        change(nodes[index], nodes[index - 1], "bidirectional");
                    } else {
                        change(nodes[index], nodes[index - 1]);
                    }
                    timeout(index + 1);
                }, speed);
            }

            function change(currentNode, previousNode, bidirectional) {
                let currentHTMLNode = document.getElementById(currentNode.id);
                let relevantClassNames = ["start", "target", "object", "visitedStartNodeBlue", "visitedStartNodePurple", "visitedObjectNode", "visitedTargetNodePurple", "visitedTargetNodeBlue"];
                if (!relevantClassNames.includes(currentHTMLNode.className)) {
                    currentHTMLNode.className = !bidirectional ?
                        "current" : currentNode.weight === 15 ?
                            "visited weight" : "visited";
                }
                if (currentHTMLNode.className === "visitedStartNodePurple" && !object) {
                    currentHTMLNode.className = "visitedStartNodeBlue";
                }
                if (currentHTMLNode.className === "target" && object) {
                    currentHTMLNode.className = "visitedTargetNodePurple";
                }
                if (previousNode) {
                    let previousHTMLNode = document.getElementById(previousNode.id);
                    if (!relevantClassNames.includes(previousHTMLNode.className)) {
                        if (object) {
                            previousHTMLNode.className = previousNode.weight === 15 ? "visitedobject weight" : "visitedobject";
                        } else {
                            previousHTMLNode.className = previousNode.weight === 15 ? "visited weight" : "visited";
                        }
                    }
                }
            }

            function shortestPathTimeout(index) {
                setTimeout(function () {
                    if (index === shortestNodes.length) {
                        board.reset();
                        if (object) {
                            shortestPathChange(board.nodes[board.target], shortestNodes[index - 1]);
                            board.objectShortestPathNodesToAnimate = [];
                            board.shortestPathNodesToAnimate = [];
                            board.clearNodeStatuses();
                            let newSuccess;
                            if (type === "weighted") {
                                newSuccess = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
                            } else {
                                newSuccess = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
                            }
                            launchAnimations(board, newSuccess, type);
                            return;
                        } else {
                            shortestPathChange(board.nodes[board.target], shortestNodes[index - 1]);
                            board.objectShortestPathNodesToAnimate = [];
                            board.shortestPathNodesToAnimate = [];
                            return;
                        }
                    } else if (index === 0) {
                        shortestPathChange(shortestNodes[index])
                    } else {
                        shortestPathChange(shortestNodes[index], shortestNodes[index - 1]);
                    }
                    shortestPathTimeout(index + 1);
                }, 40);
            }

            function shortestPathChange(currentNode, previousNode) {
                let currentHTMLNode = document.getElementById(currentNode.id);
                if (type === "unweighted") {
                    currentHTMLNode.className = "shortest-path-unweighted";
                } else {
                    if (currentNode.direction === "up") {
                        currentHTMLNode.className = "shortest-path-up";
                    } else if (currentNode.direction === "down") {
                        currentHTMLNode.className = "shortest-path-down";
                    } else if (currentNode.direction === "right") {
                        currentHTMLNode.className = "shortest-path-right";
                    } else if (currentNode.direction === "left") {
                        currentHTMLNode.className = "shortest-path-left";
                    } else if (currentNode.direction = "down-right") {
                        currentHTMLNode.className = "wall"
                    }
                }
                if (previousNode) {
                    let previousHTMLNode = document.getElementById(previousNode.id);
                    previousHTMLNode.className = "shortest-path";
                } else {
                    let element = document.getElementById(board.start);
                    element.className = "shortest-path";
                    element.removeAttribute("style");
                }
            }

            timeout(0);

        };

        module.exports = launchAnimations;

    }, { "../pathfindingAlgorithms/unweightedSearchAlgorithm": 15, "../pathfindingAlgorithms/weightedSearchAlgorithm": 16 }], 2: [function (require, module, exports) {
        const weightedSearchAlgorithm = require("../pathfindingAlgorithms/weightedSearchAlgorithm");
        const unweightedSearchAlgorithm = require("../pathfindingAlgorithms/unweightedSearchAlgorithm");

        function launchInstantAnimations(board, success, type, object, algorithm, heuristic) {
            let nodes = object ? board.objectNodesToAnimate.slice(0) : board.nodesToAnimate.slice(0);
            let shortestNodes;
            for (let i = 0; i < nodes.length; i++) {
                if (i === 0) {
                    change(nodes[i]);
                } else {
                    change(nodes[i], nodes[i - 1]);
                }
            }
            if (object) {
                board.objectNodesToAnimate = [];
                if (success) {
                    board.drawShortestPath(board.object, board.start, "object");
                    board.clearNodeStatuses();
                    let newSuccess;
                    if (type === "weighted") {
                        newSuccess = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm, heuristic);
                    } else {
                        newSuccess = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
                    }
                    launchInstantAnimations(board, newSuccess, type);
                    shortestNodes = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
                } else {
                    console.log("Failure.");
                    board.reset();
                    return;
                }
            } else {
                board.nodesToAnimate = [];
                if (success) {
                    if (board.isObject) {
                        board.drawShortestPath(board.target, board.object);
                    } else {
                        board.drawShortestPath(board.target, board.start);
                    }
                    shortestNodes = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
                } else {
                    console.log("Failure");
                    board.reset();
                    return;
                }
            }

            let j;
            for (j = 0; j < shortestNodes.length; j++) {
                if (j === 0) {
                    shortestPathChange(shortestNodes[j]);
                } else {
                    shortestPathChange(shortestNodes[j], shortestNodes[j - 1]);
                }
            }
            board.reset();
            if (object) {
                shortestPathChange(board.nodes[board.target], shortestNodes[j - 1]);
                board.objectShortestPathNodesToAnimate = [];
                board.shortestPathNodesToAnimate = [];
                board.clearNodeStatuses();
                let newSuccess;
                if (type === "weighted") {
                    newSuccess = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
                } else {
                    newSuccess = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
                }
                launchInstantAnimations(board, newSuccess, type);
            } else {
                shortestPathChange(board.nodes[board.target], shortestNodes[j - 1]);
                board.objectShortestPathNodesToAnimate = [];
                board.shortestPathNodesToAnimate = [];
            }

            function change(currentNode, previousNode) {
                let currentHTMLNode = document.getElementById(currentNode.id);
                let relevantClassNames = ["start", "shortest-path", "instantshortest-path", "instantshortest-path weight"];
                if (previousNode) {
                    let previousHTMLNode = document.getElementById(previousNode.id);
                    if (!relevantClassNames.includes(previousHTMLNode.className)) {
                        if (object) {
                            previousHTMLNode.className = previousNode.weight === 15 ? "instantvisitedobject weight" : "instantvisitedobject";
                        } else {
                            previousHTMLNode.className = previousNode.weight === 15 ? "instantvisited weight" : "instantvisited";
                        }
                    }
                }
            }

            function shortestPathChange(currentNode, previousNode) {
                let currentHTMLNode = document.getElementById(currentNode.id);
                if (type === "unweighted") {
                    currentHTMLNode.className = "shortest-path-unweighted";
                } else {
                    if (currentNode.direction === "up") {
                        currentHTMLNode.className = "shortest-path-up";
                    } else if (currentNode.direction === "down") {
                        currentHTMLNode.className = "shortest-path-down";
                    } else if (currentNode.direction === "right") {
                        currentHTMLNode.className = "shortest-path-right";
                    } else if (currentNode.direction === "left") {
                        currentHTMLNode.className = "shortest-path-left";
                    }
                }
                if (previousNode) {
                    let previousHTMLNode = document.getElementById(previousNode.id);
                    previousHTMLNode.className = previousNode.weight === 15 ? "instantshortest-path weight" : "instantshortest-path";
                } else {
                    let element = document.getElementById(board.start);
                    element.className = "startTransparent";
                }
            }

        };

        module.exports = launchInstantAnimations;

    }, { "../pathfindingAlgorithms/unweightedSearchAlgorithm": 15, "../pathfindingAlgorithms/weightedSearchAlgorithm": 16 }], 3: [function (require, module, exports) {
        function mazeGenerationAnimations(board) {
            let nodes = board.wallsToAnimate.slice(0);
            let speed = board.speed === "fast" ?
                5 : board.speed === "average" ?
                    25 : 75;
            function timeout(index) {
                setTimeout(function () {
                    if (index === nodes.length) {
                        board.wallsToAnimate = [];
                        board.toggleButtons();
                        return;
                    }
                    nodes[index].className = board.nodes[nodes[index].id].weight === 15 ? "unvisited weight" : "wall";
                    timeout(index + 1);
                }, speed);
            }

            timeout(0);
        };

        module.exports = mazeGenerationAnimations;

    }, {}], 4: [function (require, module, exports) {
        const Node = require("./node");
        const launchAnimations = require("./animations/launchAnimations");
        const launchInstantAnimations = require("./animations/launchInstantAnimations");
        const mazeGenerationAnimations = require("./animations/mazeGenerationAnimations");
        const weightedSearchAlgorithm = require("./pathfindingAlgorithms/weightedSearchAlgorithm");
        const unweightedSearchAlgorithm = require("./pathfindingAlgorithms/unweightedSearchAlgorithm");
        const recursiveDivisionMaze = require("./mazeAlgorithms/recursiveDivisionMaze");
        const otherMaze = require("./mazeAlgorithms/otherMaze");
        const otherOtherMaze = require("./mazeAlgorithms/otherOtherMaze");
        const astar = require("./pathfindingAlgorithms/astar");
        const stairDemonstration = require("./mazeAlgorithms/stairDemonstration");
        const weightsDemonstration = require("./mazeAlgorithms/weightsDemonstration");
        const simpleDemonstration = require("./mazeAlgorithms/simpleDemonstration");
        const bidirectional = require("./pathfindingAlgorithms/bidirectional");
        const getDistance = require("./getDistance");

        function Board(height, width) {
            this.height = height;
            this.width = width;
            this.start = null;
            this.target = null;
            this.object = null;
            this.boardArray = [];
            this.nodes = {};
            this.nodesToAnimate = [];
            this.objectNodesToAnimate = [];
            this.shortestPathNodesToAnimate = [];
            this.objectShortestPathNodesToAnimate = [];
            this.wallsToAnimate = [];
            this.mouseDown = false;
            this.pressedNodeStatus = "normal";
            this.previouslyPressedNodeStatus = null;
            this.previouslySwitchedNode = null;
            this.previouslySwitchedNodeWeight = 0;
            this.keyDown = false;
            this.algoDone = false;
            this.currentAlgorithm = null;
            this.currentHeuristic = null;
            this.numberOfObjects = 0;
            this.isObject = false;
            this.buttonsOn = false;
            this.speed = "fast";
        }

        Board.prototype.initialise = function () {
            this.createGrid();
            this.addEventListeners();
            this.toggleTutorialButtons();
        };

        Board.prototype.createGrid = function () {
            let tableHTML = "";
            for (let r = 0; r < this.height; r++) {
                let currentArrayRow = [];
                let currentHTMLRow = `<tr id="row ${r}">`;
                for (let c = 0; c < this.width; c++) {
                    let newNodeId = `${r}-${c}`, newNodeClass, newNode;
                    if (r === Math.floor(this.height / 2) && c === Math.floor(this.width / 4)) {
                        newNodeClass = "start";
                        this.start = `${newNodeId}`;
                    } else if (r === Math.floor(this.height / 2) && c === Math.floor(3 * this.width / 4)) {
                        newNodeClass = "target";
                        this.target = `${newNodeId}`;
                    } else {
                        newNodeClass = "unvisited";
                    }
                    newNode = new Node(newNodeId, newNodeClass);
                    currentArrayRow.push(newNode);
                    currentHTMLRow += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
                    this.nodes[`${newNodeId}`] = newNode;
                }
                this.boardArray.push(currentArrayRow);
                tableHTML += `${currentHTMLRow}</tr>`;
            }
            let board = document.getElementById("board");
            board.innerHTML = tableHTML;
        };

        Board.prototype.addEventListeners = function () {
            let board = this;
            for (let r = 0; r < board.height; r++) {
                for (let c = 0; c < board.width; c++) {
                    let currentId = `${r}-${c}`;
                    let currentNode = board.getNode(currentId);
                    let currentElement = document.getElementById(currentId);
                    currentElement.onmousedown = (e) => {
                        e.preventDefault();
                        if (this.buttonsOn) {
                            board.mouseDown = true;
                            if (currentNode.status === "start" || currentNode.status === "target" || currentNode.status === "object") {
                                board.pressedNodeStatus = currentNode.status;
                            } else {
                                board.pressedNodeStatus = "normal";
                                board.changeNormalNode(currentNode);
                            }
                        }
                    }
                    currentElement.onmouseup = () => {
                        if (this.buttonsOn) {
                            board.mouseDown = false;
                            if (board.pressedNodeStatus === "target") {
                                board.target = currentId;
                            } else if (board.pressedNodeStatus === "start") {
                                board.start = currentId;
                            } else if (board.pressedNodeStatus === "object") {
                                board.object = currentId;
                            }
                            board.pressedNodeStatus = "normal";
                        }
                    }
                    currentElement.onmouseenter = () => {
                        if (this.buttonsOn) {
                            if (board.mouseDown && board.pressedNodeStatus !== "normal") {
                                board.changeSpecialNode(currentNode);
                                if (board.pressedNodeStatus === "target") {
                                    board.target = currentId;
                                    if (board.algoDone) {
                                        board.redoAlgorithm();
                                    }
                                } else if (board.pressedNodeStatus === "start") {
                                    board.start = currentId;
                                    if (board.algoDone) {
                                        board.redoAlgorithm();
                                    }
                                } else if (board.pressedNodeStatus === "object") {
                                    board.object = currentId;
                                    if (board.algoDone) {
                                        board.redoAlgorithm();
                                    }
                                }
                            } else if (board.mouseDown) {
                                board.changeNormalNode(currentNode);
                            }
                        }
                    }
                    currentElement.onmouseleave = () => {
                        if (this.buttonsOn) {
                            if (board.mouseDown && board.pressedNodeStatus !== "normal") {
                                board.changeSpecialNode(currentNode);
                            }
                        }
                    }
                }
            }
        };

        Board.prototype.getNode = function (id) {
            let coordinates = id.split("-");
            let r = parseInt(coordinates[0]);
            let c = parseInt(coordinates[1]);
            return this.boardArray[r][c];
        };

        Board.prototype.changeSpecialNode = function (currentNode) {
            let element = document.getElementById(currentNode.id), previousElement;
            if (this.previouslySwitchedNode) previousElement = document.getElementById(this.previouslySwitchedNode.id);
            if (currentNode.status !== "target" && currentNode.status !== "start" && currentNode.status !== "object") {
                if (this.previouslySwitchedNode) {
                    this.previouslySwitchedNode.status = this.previouslyPressedNodeStatus;
                    previousElement.className = this.previouslySwitchedNodeWeight === 15 ?
                        "unvisited weight" : this.previouslyPressedNodeStatus;
                    this.previouslySwitchedNode.weight = this.previouslySwitchedNodeWeight === 15 ?
                        15 : 0;
                    this.previouslySwitchedNode = null;
                    this.previouslySwitchedNodeWeight = currentNode.weight;

                    this.previouslyPressedNodeStatus = currentNode.status;
                    element.className = this.pressedNodeStatus;
                    currentNode.status = this.pressedNodeStatus;

                    currentNode.weight = 0;
                }
            } else if (currentNode.status !== this.pressedNodeStatus && !this.algoDone) {
                this.previouslySwitchedNode.status = this.pressedNodeStatus;
                previousElement.className = this.pressedNodeStatus;
            } else if (currentNode.status === this.pressedNodeStatus) {
                this.previouslySwitchedNode = currentNode;
                element.className = this.previouslyPressedNodeStatus;
                currentNode.status = this.previouslyPressedNodeStatus;
            }
        };

        Board.prototype.changeNormalNode = function (currentNode) {
            let element = document.getElementById(currentNode.id);
            let relevantStatuses = ["start", "target", "object"];
            let unweightedAlgorithms = ["dfs", "bfs"]
            if (!this.keyDown) {
                if (!relevantStatuses.includes(currentNode.status)) {
                    element.className = currentNode.status !== "wall" ?
                        "wall" : "unvisited";
                    currentNode.status = element.className !== "wall" ?
                        "unvisited" : "wall";
                    currentNode.weight = 0;
                }
            } else if (this.keyDown === 87 && !unweightedAlgorithms.includes(this.currentAlgorithm)) {
                if (!relevantStatuses.includes(currentNode.status)) {
                    element.className = currentNode.weight !== 15 ?
                        "unvisited weight" : "unvisited";
                    currentNode.weight = element.className !== "unvisited weight" ?
                        0 : 15;
                    currentNode.status = "unvisited";
                }
            }
        };

        Board.prototype.drawShortestPath = function (targetNodeId, startNodeId, object) {
            let currentNode;
            if (this.currentAlgorithm !== "bidirectional") {
                currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
                if (object) {
                    while (currentNode.id !== startNodeId) {
                        this.objectShortestPathNodesToAnimate.unshift(currentNode);
                        currentNode = this.nodes[currentNode.previousNode];
                    }
                } else {
                    while (currentNode.id !== startNodeId) {
                        this.shortestPathNodesToAnimate.unshift(currentNode);
                        document.getElementById(currentNode.id).className = `shortest-path`;
                        currentNode = this.nodes[currentNode.previousNode];
                    }
                }
            } else {
                if (this.middleNode !== this.target && this.middleNode !== this.start) {
                    currentNode = this.nodes[this.nodes[this.middleNode].previousNode];
                    secondCurrentNode = this.nodes[this.nodes[this.middleNode].otherpreviousNode];
                    if (secondCurrentNode.id === this.target) {
                        this.nodes[this.target].direction = getDistance(this.nodes[this.middleNode], this.nodes[this.target])[2];
                    }
                    if (this.nodes[this.middleNode].weight === 0) {
                        document.getElementById(this.middleNode).className = `shortest-path`;
                    } else {
                        document.getElementById(this.middleNode).className = `shortest-path weight`;
                    }
                    while (currentNode.id !== startNodeId) {
                        this.shortestPathNodesToAnimate.unshift(currentNode);
                        document.getElementById(currentNode.id).className = `shortest-path`;
                        currentNode = this.nodes[currentNode.previousNode];
                    }
                    while (secondCurrentNode.id !== targetNodeId) {
                        this.shortestPathNodesToAnimate.unshift(secondCurrentNode);
                        document.getElementById(secondCurrentNode.id).className = `shortest-path`;
                        if (secondCurrentNode.otherpreviousNode === targetNodeId) {
                            if (secondCurrentNode.otherdirection === "left") {
                                secondCurrentNode.direction = "right";
                            } else if (secondCurrentNode.otherdirection === "right") {
                                secondCurrentNode.direction = "left";
                            } else if (secondCurrentNode.otherdirection === "up") {
                                secondCurrentNode.direction = "down";
                            } else if (secondCurrentNode.otherdirection === "down") {
                                secondCurrentNode.direction = "up";
                            }
                            this.nodes[this.target].direction = getDistance(secondCurrentNode, this.nodes[this.target])[2];
                        }
                        secondCurrentNode = this.nodes[secondCurrentNode.otherpreviousNode]
                    }
                } else {
                    document.getElementById(this.nodes[this.target].previousNode).className = `shortest-path`;
                }
            }
        };

        Board.prototype.addShortestPath = function (targetNodeId, startNodeId, object) {
            let currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
            if (object) {
                while (currentNode.id !== startNodeId) {
                    this.objectShortestPathNodesToAnimate.unshift(currentNode);
                    currentNode.relatesToObject = true;
                    currentNode = this.nodes[currentNode.previousNode];
                }
            } else {
                while (currentNode.id !== startNodeId) {
                    this.shortestPathNodesToAnimate.unshift(currentNode);
                    currentNode = this.nodes[currentNode.previousNode];
                }
            }
        };

        Board.prototype.drawShortestPathTimeout = function (targetNodeId, startNodeId, type, object) {
            let board = this;
            let currentNode;
            let secondCurrentNode;
            let currentNodesToAnimate;

            if (board.currentAlgorithm !== "bidirectional") {
                currentNode = board.nodes[board.nodes[targetNodeId].previousNode];
                if (object) {
                    board.objectShortestPathNodesToAnimate.push("object");
                    currentNodesToAnimate = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
                } else {
                    currentNodesToAnimate = [];
                    while (currentNode.id !== startNodeId) {
                        currentNodesToAnimate.unshift(currentNode);
                        currentNode = board.nodes[currentNode.previousNode];
                    }
                }
            } else {
                if (board.middleNode !== board.target && board.middleNode !== board.start) {
                    currentNode = board.nodes[board.nodes[board.middleNode].previousNode];
                    secondCurrentNode = board.nodes[board.nodes[board.middleNode].otherpreviousNode];
                    if (secondCurrentNode.id === board.target) {
                        board.nodes[board.target].direction = getDistance(board.nodes[board.middleNode], board.nodes[board.target])[2];
                    }
                    if (object) {

                    } else {
                        currentNodesToAnimate = [];
                        board.nodes[board.middleNode].direction = getDistance(currentNode, board.nodes[board.middleNode])[2];
                        while (currentNode.id !== startNodeId) {
                            currentNodesToAnimate.unshift(currentNode);
                            currentNode = board.nodes[currentNode.previousNode];
                        }
                        currentNodesToAnimate.push(board.nodes[board.middleNode]);
                        while (secondCurrentNode.id !== targetNodeId) {
                            if (secondCurrentNode.otherdirection === "left") {
                                secondCurrentNode.direction = "right";
                            } else if (secondCurrentNode.otherdirection === "right") {
                                secondCurrentNode.direction = "left";
                            } else if (secondCurrentNode.otherdirection === "up") {
                                secondCurrentNode.direction = "down";
                            } else if (secondCurrentNode.otherdirection === "down") {
                                secondCurrentNode.direction = "up";
                            }
                            currentNodesToAnimate.push(secondCurrentNode);
                            if (secondCurrentNode.otherpreviousNode === targetNodeId) {
                                board.nodes[board.target].direction = getDistance(secondCurrentNode, board.nodes[board.target])[2];
                            }
                            secondCurrentNode = board.nodes[secondCurrentNode.otherpreviousNode]
                        }
                    }
                } else {
                    currentNodesToAnimate = [];
                    let target = board.nodes[board.target];
                    currentNodesToAnimate.push(board.nodes[target.previousNode], target);
                }

            }


            timeout(0);

            function timeout(index) {
                if (!currentNodesToAnimate.length) currentNodesToAnimate.push(board.nodes[board.start]);
                setTimeout(function () {
                    if (index === 0) {
                        shortestPathChange(currentNodesToAnimate[index]);
                    } else if (index < currentNodesToAnimate.length) {
                        shortestPathChange(currentNodesToAnimate[index], currentNodesToAnimate[index - 1]);
                    } else if (index === currentNodesToAnimate.length) {
                        shortestPathChange(board.nodes[board.target], currentNodesToAnimate[index - 1], "isActualTarget");
                    }
                    if (index > currentNodesToAnimate.length) {
                        board.toggleButtons();
                        return;
                    }
                    timeout(index + 1);
                }, 40)
            }


            function shortestPathChange(currentNode, previousNode, isActualTarget) {
                if (currentNode === "object") {
                    let element = document.getElementById(board.object);
                    element.className = "objectTransparent";
                } else if (currentNode.id !== board.start) {
                    if (currentNode.id !== board.target || currentNode.id === board.target && isActualTarget) {
                        let currentHTMLNode = document.getElementById(currentNode.id);
                        if (type === "unweighted") {
                            currentHTMLNode.className = "shortest-path-unweighted";
                        } else {
                            let direction;
                            if (currentNode.relatesToObject && !currentNode.overwriteObjectRelation && currentNode.id !== board.target) {
                                direction = "storedDirection";
                                currentNode.overwriteObjectRelation = true;
                            } else {
                                direction = "direction";
                            }
                            if (currentNode[direction] === "up") {
                                currentHTMLNode.className = "shortest-path-up";
                            } else if (currentNode[direction] === "down") {
                                currentHTMLNode.className = "shortest-path-down";
                            } else if (currentNode[direction] === "right") {
                                currentHTMLNode.className = "shortest-path-right";
                            } else if (currentNode[direction] === "left") {
                                currentHTMLNode.className = "shortest-path-left";
                            } else {
                                currentHTMLNode.className = "shortest-path";
                            }
                        }
                    }
                }
                if (previousNode) {
                    if (previousNode !== "object" && previousNode.id !== board.target && previousNode.id !== board.start) {
                        let previousHTMLNode = document.getElementById(previousNode.id);
                        previousHTMLNode.className = previousNode.weight === 15 ? "shortest-path weight" : "shortest-path";
                    }
                } else {
                    let element = document.getElementById(board.start);
                    element.className = "startTransparent";
                }
            }





        };

        Board.prototype.createMazeOne = function (type) {
            var elements = [
                '0-57', '0-58', '0-59', '0-60', '0-61', '0-62', '0-63', '0-64', '0-65', '0-66', '0-67', '0-68', '0-69', '0-70', '0-71', '0-72', '0-73', '0-74', '0-75',
                '1-57', '1-75',
                '2-0', '2-1', '2-2', '2-4', '2-5', '2-6', '2-10', '2-11', '2-12', '2-13', '2-14', '2-15', '2-16', '2-17', '2-57', '2-75',
                '3-0', '3-6', '3-10', '3-17', '3-57', '3-75',
                '4-0', '4-6', '4-10', '4-17', '4-57', '4-58', '4-59', '4-60', '4-61', '4-62', '4-63', '4-64', '4-65', '4-66', '4-67', '4-68', '4-69', '4-70', '4-71', '4-72', '4-73', '4-75', '4-77', '4-78', '4-79', '4-80', '4-81', '4-82', '4-83', '4-84', '4-85', '4-86',
                '5-0', '5-1', '5-2', '5-6', '5-10', '5-17', '5-25', '5-26', '5-27', '5-28', '5-29', '5-30', '5-31', '5-32', '5-33', '5-34', '5-35', '5-36', '5-37', '5-38', '5-40', '5-41', '5-42', '5-43', '5-44', '5-45', '5-46', '5-47', '5-48', '5-49', '5-77', '5-86',
                '6-0', '6-2', '6-6', '6-10', '6-17', '6-25', '6-28', '6-32', '6-34', '6-38', '6-40', '6-44', '6-49', '6-77', '6-86',
                '7-0', '7-6', '7-10', '7-17', '7-25', '7-28', '7-32', '7-34', '7-38', '7-40', '7-44', '7-49', '7-77', '7-86',
                '8-0', '8-2', '8-6', '8-10', '8-17', '8-25', '8-28', '8-29', '8-31', '8-32', '8-34', '8-35', '8-37', '8-38', '8-40', '8-41', '8-43', '8-44', '8-49', '8-56', '8-57', '8-58', '8-59', '8-60', '8-61', '8-62', '8-63', '8-64', '8-66', '8-67', '8-68', '8-69', '8-70', '8-71', '8-72', '8-73', '8-74', '8-77', '8-86',
                '9-0', '9-1', '9-2', '9-25', '9-6', '9-10', '9-49', '9-56', '9-74', '9-77', '9-86', '9-58', '9-62', '9-68', '9-72',
                '10-0', '10-25', '10-6', '10-10', '10-49', '10-56', '10-74', '10-77', '10-86', '10-58', '10-62', '10-68', '10-72',
                '11-0', '11-25', '11-59', '11-61', '11-69', '11-71', '11-6', '11-10', '11-20', '11-49', '11-56', '11-74', '11-77', '11-86', '11-58', '11-62', '11-68', '11-72', '11-11', '11-12', '11-13', '11-14', '11-15', '11-16', '11-17', '11-20', '11-21', '11-22', '11-23', '11-24',
                '12-0', '12-1', '12-2', '12-6', '12-20', '12-49', '12-56', '12-74', '12-77', '12-86',
                '13-0', '13-2', '13-6', '13-10', '13-20', '13-49', '13-56', '13-74', '13-77', '13-86', '13-11', '13-12', '13-13', '13-14', '13-15', '13-16', '13-17',
                '14-0', '14-6', '14-10', '14-20', '14-56', '14-74', '14-77', '14-86', '14-28', '14-29', '14-31', '14-32', '14-34', '14-35', '14-37', '14-38', '14-40', '14-41', '14-43', '14-44', '14-11', '14-12', '14-13', '14-14', '14-15', '14-16', '14-17',
                '15-0', '15-2', '15-28', '15-32', '15-34', '15-38', '15-40', '15-44', '15-10', '15-49', '15-56', '15-74', '15-77', '15-86', '15-11', '15-12', '15-13', '15-14', '15-15', '15-16', '15-17',
                '16-0', '16-1', '16-2', '16-28', '16-32', '16-34', '16-38', '16-40', '16-44', '16-6', '16-20', '16-49', '16-77', '16-86',
                '17-0', '17-6', '17-10', '17-20', '17-49', '17-56', '17-74', '17-77', '17-86', '17-11', '17-12', '17-13', '17-14', '17-15', '17-16', '17-17', '17-20', '17-21', '17-22', '17-24', '17-25', '17-26', '17-27', '17-28', '17-29', '17-30', '17-31', '17-32', '17-33', '17-34', '17-35', '17-36', '17-37', '17-38', '17-40', '17-41', '17-42', '17-43', '17-44', '17-45', '17-47', '17-48',
                '18-0', '18-17', '18-59', '18-61', '18-69', '18-71', '18-6', '18-10', '18-56', '18-74', '18-77', '18-86', '18-58', '18-62', '18-68', '18-72',
                '19-0', '19-1', '19-2', '19-17', '19-6', '19-10', '19-56', '19-74', '19-77', '19-86', '19-58', '19-62', '19-68', '19-72',
                '20-0', '20-2', '20-6', '20-10', '20-20', '20-27', '20-29', '20-45', '20-52', '20-56', '20-74', '20-77', '20-86', '20-58', '20-62', '20-68', '20-72', '20-17', '20-20', '20-21', '20-22', '20-23', '20-24', '20-25', '20-26', '20-27', '20-29', '20-30', '20-31', '20-32', '20-33', '20-34', '20-35', '20-36', '20-37', '20-38', '20-39', '20-40', '20-41', '20-42', '20-43', '20-44', '20-45', '20-49', '20-50', '20-51',
                '21-0', '21-17', '21-6', '21-10', '21-20', '21-27', '21-29', '21-45', '21-52', '21-56', '21-74', '21-77', '21-86', '21-57', '21-58', '21-59', '21-60', '21-61', '21-62', '21-63', '21-64', '21-65', '21-66', '21-67', '21-68', '21-69', '21-70', '21-71', '21-72', '21-73', '21-74', '21-77', '21-79', '21-80', '21-81', '21-82', '21-83', '21-84', '21-85',
                '22-0', '22-2', '22-17', '22-6', '22-10', '22-20', '22-27', '22-29', '22-45', '22-52',
                '23-0', '23-1', '23-2', '23-17', '23-6', '23-10', '23-20', '23-27', '23-29', '23-45', '23-52', '23-77', '23-86', '23-78', '23-79', '23-80', '23-81', '23-82', '23-83', '23-84', '23-85',
                '24-0', '24-6', '24-10', '24-27', '24-45', '24-52', '24-86',
                '25-0', '25-6', '25-10', '25-20', '25-27', '25-29', '25-45', '25-52', '25-77', '25-86',
                '26-0', '26-1', '26-2', '26-17', '26-4', '26-5', '26-11', '26-12', '26-13', '26-14', '26-15', '26-16', '26-6', '26-10', '26-20', '26-27', '26-29', '26-45', '26-52', '26-77', '26-86',
                '27-20', '27-27', '27-29', '27-45', '27-52', '27-77', '27-86', '27-30', '27-31', '27-32', '27-33', '27-34', '27-35', '27-36', '27-37', '27-38', '27-39', '27-40', '27-41', '27-42', '27-43', '27-44', '27-45', '27-49', '27-50', '27-51',
                '28-21', '28-22', '28-23', '28-25', '28-26', '28-20', '28-27', '28-77', '28-86',
                '29-77', '29-86', '29-78', '29-79', '29-80', '29-81', '29-82', '29-83', '29-84', '29-85'
            ];
            for (var element of elements) {
                document.getElementById(element).className = "wall";
                document.getElementById(element).status="wall";

            }
            Object.keys(this.nodes).forEach(node => {
            //     let random = Math.random();
                let currentHTMLNode = document.getElementById(node);
                let relevantClassNames = ["start", "target", "object"]
            //     let randomTwo = type === "wall" ? 0.25 : 0.35;
                if ( currentHTMLNode.className==="wall" &&
                    // random < randomTwo && 
                    !relevantClassNames.includes(currentHTMLNode.className)) {
                    if (type === "wall") {
                        currentHTMLNode.className = "wall";
                        this.nodes[node].status = "wall";
                        this.nodes[node].weight = 0;
                    } else if (type === "weight") {
                        currentHTMLNode.className = "unvisited weight";
                        this.nodes[node].status = "unvisited";
                        this.nodes[node].weight = 15;
                    }
                }
            });
        };

        Board.prototype.clearPath = function (clickedButton) {
            if (clickedButton) {
                let start = this.nodes[this.start];
                let target = this.nodes[this.target];
                let object = this.numberOfObjects ? this.nodes[this.object] : null;
                start.status = "start";
                document.getElementById(start.id).className = "start";
                target.status = "target";
                document.getElementById(target.id).className = "target";
                if (object) {
                    object.status = "object";
                    document.getElementById(object.id).className = "object";
                }
            }

            document.getElementById("startButtonStart").onclick = () => {
                if (!this.currentAlgorithm) {
                    document.getElementById("startButtonStart").innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>'
                } else {
                    this.clearPath("clickedButton");
                    this.toggleButtons();
                    let weightedAlgorithms = ["dijkstra", "CLA", "greedy"];
                    let unweightedAlgorithms = ["dfs", "bfs"];
                    let success;
                    if (this.currentAlgorithm === "bidirectional") {
                        if (!this.numberOfObjects) {
                            success = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
                            launchAnimations(this, success, "weighted");
                        } else {
                            this.isObject = true;
                        }
                        this.algoDone = true;
                    } else if (this.currentAlgorithm === "astar") {
                        if (!this.numberOfObjects) {
                            success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                            launchAnimations(this, success, "weighted");
                        } else {
                            this.isObject = true;
                            success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                            launchAnimations(this, success, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
                        }
                        this.algoDone = true;
                    } else if (weightedAlgorithms.includes(this.currentAlgorithm)) {
                        if (!this.numberOfObjects) {
                            success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                            launchAnimations(this, success, "weighted");
                        } else {
                            this.isObject = true;
                            success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                            launchAnimations(this, success, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
                        }
                        this.algoDone = true;
                    } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
                        if (!this.numberOfObjects) {
                            success = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
                            launchAnimations(this, success, "unweighted");
                        } else {
                            this.isObject = true;
                            success = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
                            launchAnimations(this, success, "unweighted", "object", this.currentAlgorithm);
                        }
                        this.algoDone = true;
                    }
                }
            }

            this.algoDone = false;
            Object.keys(this.nodes).forEach(id => {
                let currentNode = this.nodes[id];
                currentNode.previousNode = null;
                currentNode.distance = Infinity;
                currentNode.totalDistance = Infinity;
                currentNode.heuristicDistance = null;
                currentNode.direction = null;
                currentNode.storedDirection = null;
                currentNode.relatesToObject = false;
                currentNode.overwriteObjectRelation = false;
                currentNode.otherpreviousNode = null;
                currentNode.otherdistance = Infinity;
                currentNode.otherdirection = null;
                let currentHTMLNode = document.getElementById(id);
                let relevantStatuses = ["wall", "start", "target", "object"];
                if ((!relevantStatuses.includes(currentNode.status) || currentHTMLNode.className === "visitedobject") && currentNode.weight !== 15) {
                    currentNode.status = "unvisited";
                    currentHTMLNode.className = "unvisited";
                } else if (currentNode.weight === 15) {
                    currentNode.status = "unvisited";
                    currentHTMLNode.className = "unvisited weight";
                }
            });
        };

        Board.prototype.clearWalls = function () {
            this.clearPath("clickedButton");
            Object.keys(this.nodes).forEach(id => {
                let currentNode = this.nodes[id];
                let currentHTMLNode = document.getElementById(id);
                if (currentNode.status === "wall" || currentNode.weight === 15) {
                    currentNode.status = "unvisited";
                    currentNode.weight = 0;
                    currentHTMLNode.className = "unvisited";
                }
            });
        }

        Board.prototype.clearWeights = function () {
            Object.keys(this.nodes).forEach(id => {
                let currentNode = this.nodes[id];
                let currentHTMLNode = document.getElementById(id);
                if (currentNode.weight === 15) {
                    currentNode.status = "unvisited";
                    currentNode.weight = 0;
                    currentHTMLNode.className = "unvisited";
                }
            });
        }

        Board.prototype.clearNodeStatuses = function () {
            Object.keys(this.nodes).forEach(id => {
                let currentNode = this.nodes[id];
                currentNode.previousNode = null;
                currentNode.distance = Infinity;
                currentNode.totalDistance = Infinity;
                currentNode.heuristicDistance = null;
                currentNode.storedDirection = currentNode.direction;
                currentNode.direction = null;
                let relevantStatuses = ["wall", "start", "target", "object"];
                if (!relevantStatuses.includes(currentNode.status)) {
                    currentNode.status = "unvisited";
                }
            })
        };

        Board.prototype.instantAlgorithm = function () {
            let weightedAlgorithms = ["dijkstra", "CLA", "greedy"];
            let unweightedAlgorithms = ["dfs", "bfs"];
            let success;
            if (this.currentAlgorithm === "bidirectional") {
                if (!this.numberOfObjects) {
                    success = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
                    launchInstantAnimations(this, success, "weighted");
                } else {
                    this.isObject = true;
                }
                this.algoDone = true;
            } else if (this.currentAlgorithm === "astar") {
                if (!this.numberOfObjects) {
                    success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                    launchInstantAnimations(this, success, "weighted");
                } else {
                    this.isObject = true;
                    success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                    launchInstantAnimations(this, success, "weighted", "object", this.currentAlgorithm);
                }
                this.algoDone = true;
            }
            if (weightedAlgorithms.includes(this.currentAlgorithm)) {
                if (!this.numberOfObjects) {
                    success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                    launchInstantAnimations(this, success, "weighted");
                } else {
                    this.isObject = true;
                    success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                    launchInstantAnimations(this, success, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
                }
                this.algoDone = true;
            } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
                if (!this.numberOfObjects) {
                    success = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
                    launchInstantAnimations(this, success, "unweighted");
                } else {
                    this.isObject = true;
                    success = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
                    launchInstantAnimations(this, success, "unweighted", "object", this.currentAlgorithm);
                }
                this.algoDone = true;
            }
        };

        Board.prototype.redoAlgorithm = function () {
            this.clearPath();
            this.instantAlgorithm();
        };

        Board.prototype.reset = function (objectNotTransparent) {
            this.nodes[this.start].status = "start";
            document.getElementById(this.start).className = "startTransparent";
            this.nodes[this.target].status = "target";
            if (this.object) {
                this.nodes[this.object].status = "object";
                if (objectNotTransparent) {
                    document.getElementById(this.object).className = "visitedObjectNode";
                } else {
                    document.getElementById(this.object).className = "objectTransparent";
                }
            }
        };

        Board.prototype.resetHTMLNodes = function () {
            let start = document.getElementById(this.start);
            let target = document.getElementById(this.target);
            start.className = "start";
            target.className = "target";
        };

        Board.prototype.changeStartNodeImages = function () {
            debugger;
            let unweighted = ["bfs", "dfs"];
            let strikethrough = ["bfs", "dfs"];
            let guaranteed = ["dijkstra", "astar"];
            let name = "";
            if (this.currentAlgorithm === "bfs") {
                name = "Breath-first Search";
            } else if (this.currentAlgorithm === "dfs") {
                name = "Depth-first Search";
            } else if (this.currentAlgorithm === "dijkstra") {
                name = "Dijkstra's Algorithm";
            } else if (this.currentAlgorithm === "astar") {
                name = "A* Search";
            } else if (this.currentAlgorithm === "greedy") {
                name = "Greedy Best-first Search";
            } else if (this.currentAlgorithm === "CLA" && this.currentHeuristic !== "extraPoweredManhattanDistance") {
                name = "Swarm Algorithm";
            } else if (this.currentAlgorithm === "CLA" && this.currentHeuristic === "extraPoweredManhattanDistance") {
                name = "Convergent Swarm Algorithm";
            } else if (this.currentAlgorithm === "bidirectional") {
                name = "Bidirectional Swarm Algorithm";
            }
            if (unweighted.includes(this.currentAlgorithm)) {
                if (this.currentAlgorithm === "dfs") {
                    document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>unweighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
                } else {
                    document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>unweighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
                }
                document.getElementById("weightLegend").className = "strikethrough";
                for (let i = 0; i < 14; i++) {
                    let j = i.toString();
                    let backgroundImage = document.styleSheets["1"].rules[j].style.backgroundImage;
                    document.styleSheets["1"].rules[j].style.backgroundImage = backgroundImage.replace("triangle", "spaceship");
                }
            } else {
                if (this.currentAlgorithm === "greedy" || this.currentAlgorithm === "CLA") {
                    document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
                }
                document.getElementById("weightLegend").className = "";
                for (let i = 0; i < 14; i++) {
                    let j = i.toString();
                    let backgroundImage = document.styleSheets["1"].rules[j].style.backgroundImage;
                    document.styleSheets["1"].rules[j].style.backgroundImage = backgroundImage.replace("spaceship", "triangle");
                }
            }
            if (this.currentAlgorithm === "bidirectional") {

                document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
                document.getElementById("bombLegend").className = "strikethrough";
                document.getElementById("startButtonAddObject").className = "navbar-inverse navbar-nav disabledA";
            } else {
                document.getElementById("bombLegend").className = "";
                document.getElementById("startButtonAddObject").className = "navbar-inverse navbar-nav";
            }
            if (guaranteed.includes(this.currentAlgorithm)) {
                document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
            }
        };

        let counter = 1;
        Board.prototype.toggleTutorialButtons = function () {

            document.getElementById("skipButton").onclick = () => {
                document.getElementById("tutorial").style.display = "none";
                this.toggleButtons();
            }

            if (document.getElementById("nextButton")) {
                document.getElementById("nextButton").onclick = () => {
                    if (counter < 9) counter++;
                    this.toggleTutorialButtons();
                }
            }

            document.getElementById("previousButton").onclick = () => {
                if (counter > 1) counter--;
                this.toggleTutorialButtons()
            }

            let board = this;
            function nextPreviousClick() {
                if (counter === 1) {
                    document.getElementById("tutorial").innerHTML = `<h3>Welcome to Pathfinding Visualizer!</h3><h6>This short tutorial will walk you through all of the features of this application.</h6><p>If you want to dive right in, feel free to press the "Skip Tutorial" button below. Otherwise, press "Next"!</p><div id="tutorialCounter">1/9</div><img id="mainTutorialImage" src="public/styling/c_icon.png"><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
                } else if (counter === 2) {
                    document.getElementById("tutorial").innerHTML = `<h3>What is a pathfinding algorithm?</h3><h6>At its core, a pathfinding algorithm seeks to find the shortest path between two points. This application visualizes various pathfinding algorithms in action, and more!</h6><p>All of the algorithms on this application are adapted for a 2D grid, where 90 degree turns have a "cost" of 1 and movements from a node to another have a "cost" of 1.</p><div id="tutorialCounter">${counter}/9</div><img id="mainTutorialImage" src="public/styling/path.png"><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
                } else if (counter === 3) {
                    document.getElementById("tutorial").innerHTML = `<h3>Picking an algorithm</h3><h6>Choose an algorithm from the "Algorithms" drop-down menu.</h6><p>Note that some algorithms are <i><b>unweighted</b></i>, while others are <i><b>weighted</b></i>. Unweighted algorithms do not take turns or weight nodes into account, whereas weighted ones do. Additionally, not all algorithms guarantee the shortest path. </p><img id="secondTutorialImage" src="public/styling/algorithms.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
                } else if (counter === 4) {
                    document.getElementById("tutorial").innerHTML = `<h3>Meet the algorithms</h3><h6>Not all algorithms are created equal.</h6><ul><li><b>Dijkstra's Algorithm</b> (weighted): the father of pathfinding algorithms; guarantees the shortest path</li><li><b>A* Search</b> (weighted): arguably the best pathfinding algorithm; uses heuristics to guarantee the shortest path much faster than Dijkstra's Algorithm</li><li><b>Greedy Best-first Search</b> (weighted): a faster, more heuristic-heavy version of A*; does not guarantee the shortest path</li><li><b>Swarm Algorithm</b> (weighted): a mixture of Dijkstra's Algorithm and A*; does not guarantee the shortest-path</li><li><b>Convergent Swarm Algorithm</b> (weighted): the faster, more heuristic-heavy version of Swarm; does not guarantee the shortest path</li><li><b>Bidirectional Swarm Algorithm</b> (weighted): Swarm from both sides; does not guarantee the shortest path</li><li><b>Breath-first Search</b> (unweighted): a great algorithm; guarantees the shortest path</li><li><b>Depth-first Search</b> (unweighted): a very bad algorithm for pathfinding; does not guarantee the shortest path</li></ul><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
                } else if (counter === 5) {
                    document.getElementById("tutorial").innerHTML = `<h3>Adding walls and weights</h3><h6>Click on the grid to add a wall. Click on the grid while pressing W to add a weight. Generate mazes and patterns from the "Mazes & Patterns" drop-down menu.</h6><p>Walls are impenetrable, meaning that a path cannot cross through them. Weights, however, are not impassable. They are simply more "costly" to move through. In this application, moving through a weight node has a "cost" of 15.</p><img id="secondTutorialImage" src="public/styling/walls.gif"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
                } else if (counter === 6) {
                    document.getElementById("tutorial").innerHTML = `<h3>Adding a bomb</h3><h6>Click the "Add Bomb" button.</h6><p>Adding a bomb will change the course of the chosen algorithm. In other words, the algorithm will first look for the bomb (in an effort to diffuse it) and will then look for the target node. Note that the Bidirectional Swarm Algorithm does not support adding a bomb.</p><img id="secondTutorialImage" src="public/styling/bomb.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
                } else if (counter === 7) {
                    document.getElementById("tutorial").innerHTML = `<h3>Dragging nodes</h3><h6>Click and drag the start, bomb, and target nodes to move them.</h6><p>Note that you can drag nodes even after an algorithm has finished running. This will allow you to instantly see different paths.</p><img src="public/styling/dragging.gif"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
                } else if (counter === 8) {
                    document.getElementById("tutorial").innerHTML = `<h3>Visualizing and more</h3><h6>Use the navbar buttons to visualize algorithms and to do other stuff!</h6><p>You can clear the current path, clear walls and weights, clear the entire board, and adjust the visualization speed, all from the navbar. If you want to access this tutorial again, click on "Pathfinding Visualizer" in the top left corner of your screen.</p><img id="secondTutorialImage" src="public/styling/navbar.png"><div id="tutorialCounter">${counter}/9</div><button id="nextButton" class="btn btn-default navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
                } else if (counter === 9) {
                    document.getElementById("tutorial").innerHTML = `<h3>Enjoy!</h3><h6>I hope you have just as much fun playing around with this visualization tool as I had building it!</h6><p>If you want to see the source code for this application, check out my <a href="https://github.com/clementmihailescu/Pathfinding-Visualizer">github</a>.</p><div id="tutorialCounter">${counter}/9</div><button id="finishButton" class="btn btn-default navbar-btn" type="button">Finish</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
                    document.getElementById("finishButton").onclick = () => {
                        document.getElementById("tutorial").style.display = "none";
                        board.toggleButtons();
                    }
                }
            }

        };

        Board.prototype.toggleButtons = function () {
            document.getElementById("refreshButton").onclick = () => {
                window.location.reload(true);
            }

            if (!this.buttonsOn) {
                this.buttonsOn = true;

                document.getElementById("startButtonStart").onclick = () => {
                    if (!this.currentAlgorithm) {
                        document.getElementById("startButtonStart").innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>'
                    } else {
                        this.clearPath("clickedButton");
                        this.toggleButtons();
                        let weightedAlgorithms = ["dijkstra", "CLA", "CLA", "greedy"];
                        let unweightedAlgorithms = ["dfs", "bfs"];
                        let success;
                        if (this.currentAlgorithm === "bidirectional") {
                            if (!this.numberOfObjects) {
                                success = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
                                launchAnimations(this, success, "weighted");
                            } else {
                                this.isObject = true;
                                success = bidirectional(this.nodes, this.start, this.object, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
                                launchAnimations(this, success, "weighted");
                            }
                            this.algoDone = true;
                        } else if (this.currentAlgorithm === "astar") {
                            if (!this.numberOfObjects) {
                                success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                                launchAnimations(this, success, "weighted");
                            } else {
                                this.isObject = true;
                                success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                                launchAnimations(this, success, "weighted", "object", this.currentAlgorithm);
                            }
                            this.algoDone = true;
                        } else if (weightedAlgorithms.includes(this.currentAlgorithm)) {
                            if (!this.numberOfObjects) {
                                success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                                launchAnimations(this, success, "weighted");
                            } else {
                                this.isObject = true;
                                success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
                                launchAnimations(this, success, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
                            }
                            this.algoDone = true;
                        } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
                            if (!this.numberOfObjects) {
                                success = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
                                launchAnimations(this, success, "unweighted");
                            } else {
                                this.isObject = true;
                                success = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
                                launchAnimations(this, success, "unweighted", "object", this.currentAlgorithm);
                            }
                            this.algoDone = true;
                        }
                    }
                }

                document.getElementById("adjustFast").onclick = () => {
                    this.speed = "fast";
                    document.getElementById("adjustSpeed").innerHTML = 'Speed: Fast<span class="caret"></span>';
                }

                document.getElementById("adjustAverage").onclick = () => {
                    this.speed = "average";
                    document.getElementById("adjustSpeed").innerHTML = 'Speed: Average<span class="caret"></span>';
                }

                document.getElementById("adjustSlow").onclick = () => {
                    this.speed = "slow";
                    document.getElementById("adjustSpeed").innerHTML = 'Speed: Slow<span class="caret"></span>';
                }

                document.getElementById("startStairDemonstration").onclick = () => {
                    this.clearWalls();
                    this.clearPath("clickedButton");
                    this.toggleButtons();
                    stairDemonstration(this);
                    mazeGenerationAnimations(this);
                }


                document.getElementById("startButtonBidirectional").onclick = () => {
                    document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Bidirectional Swarm!</button>'
                    this.currentAlgorithm = "bidirectional";
                    this.currentHeuristic = "manhattanDistance";
                    if (this.numberOfObjects) {
                        let objectNodeId = this.object;
                        document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Add a Bomb</a></li>';
                        document.getElementById(objectNodeId).className = "unvisited";
                        this.object = null;
                        this.numberOfObjects = 0;
                        this.nodes[objectNodeId].status = "unvisited";
                        this.isObject = false;
                    }
                    this.clearPath("clickedButton");
                    this.changeStartNodeImages();
                }

                document.getElementById("startButtonDijkstra").onclick = () => {
                    document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Dijkstra\'s!</button>'
                    this.currentAlgorithm = "dijkstra";
                    this.changeStartNodeImages();
                }

                document.getElementById("startButtonAStar").onclick = () => {
                    document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Swarm!</button>'
                    this.currentAlgorithm = "CLA";
                    this.currentHeuristic = "manhattanDistance"
                    this.changeStartNodeImages();
                }

                document.getElementById("startButtonAStar2").onclick = () => {
                    document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize A*!</button>'
                    this.currentAlgorithm = "astar";
                    this.currentHeuristic = "poweredManhattanDistance"
                    this.changeStartNodeImages();
                }

                document.getElementById("startButtonAStar3").onclick = () => {
                    document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Convergent Swarm!</button>'
                    this.currentAlgorithm = "CLA";
                    this.currentHeuristic = "extraPoweredManhattanDistance"
                    this.changeStartNodeImages();
                }

                document.getElementById("startButtonGreedy").onclick = () => {
                    document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Greedy!</button>'
                    this.currentAlgorithm = "greedy";
                    this.changeStartNodeImages();
                }

                document.getElementById("startButtonBFS").onclick = () => {
                    document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize BFS!</button>'
                    this.currentAlgorithm = "bfs";
                    this.clearWeights();
                    this.changeStartNodeImages();
                }

                document.getElementById("startButtonDFS").onclick = () => {
                    document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize DFS!</button>'
                    this.currentAlgorithm = "dfs";
                    this.clearWeights();
                    this.changeStartNodeImages();
                }

                document.getElementById("startButtonCreateMazeOne").onclick = () => {
                    this.clearWalls();
                    this.clearPath("clickedButton");
                    this.createMazeOne("wall");
                }

                document.getElementById("startButtonCreateMazeTwo").onclick = () => {
                    this.clearWalls();
                    this.clearPath("clickedButton");
                    this.toggleButtons();
                    recursiveDivisionMaze(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false, "wall");
                    mazeGenerationAnimations(this);
                }

                document.getElementById("startButtonCreateMazeWeights").onclick = () => {
                    this.clearWalls();
                    this.clearPath("clickedButton");
                    this.createMazeOne("weight");
                }

                document.getElementById("startButtonClearBoard").onclick = () => {
                    document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Add Bomb</a></li>';



                    let navbarHeight = document.getElementById("navbarDiv").clientHeight;
                    let textHeight = document.getElementById("mainText").clientHeight + document.getElementById("algorithmDescriptor").clientHeight;
                    let height = Math.floor((document.documentElement.clientHeight - navbarHeight - textHeight) / 10);
                    let width = Math.floor(document.documentElement.clientWidth / 8);
                    let start = Math.floor(height / 2).toString() + "-" + Math.floor(width / 4).toString();
                    let target = Math.floor(height / 2).toString() + "-" + Math.floor(3 * width / 4).toString();

                    Object.keys(this.nodes).forEach(id => {
                        let currentNode = this.nodes[id];
                        let currentHTMLNode = document.getElementById(id);
                        if (id === start) {
                            currentHTMLNode.className = "start";
                            currentNode.status = "start";
                        } else if (id === target) {
                            currentHTMLNode.className = "target";
                            currentNode.status = "target"
                        } else {
                            currentHTMLNode.className = "unvisited";
                            currentNode.status = "unvisited";
                        }
                        currentNode.previousNode = null;
                        currentNode.path = null;
                        currentNode.direction = null;
                        currentNode.storedDirection = null;
                        currentNode.distance = Infinity;
                        currentNode.totalDistance = Infinity;
                        currentNode.heuristicDistance = null;
                        currentNode.weight = 0;
                        currentNode.relatesToObject = false;
                        currentNode.overwriteObjectRelation = false;

                    });
                    this.start = start;
                    this.target = target;
                    this.object = null;
                    this.nodesToAnimate = [];
                    this.objectNodesToAnimate = [];
                    this.shortestPathNodesToAnimate = [];
                    this.objectShortestPathNodesToAnimate = [];
                    this.wallsToAnimate = [];
                    this.mouseDown = false;
                    this.pressedNodeStatus = "normal";
                    this.previouslyPressedNodeStatus = null;
                    this.previouslySwitchedNode = null;
                    this.previouslySwitchedNodeWeight = 0;
                    this.keyDown = false;
                    this.algoDone = false;
                    this.numberOfObjects = 0;
                    this.isObject = false;
                }

                document.getElementById("startButtonClearWalls").onclick = () => {
                    this.clearWalls();
                }

                document.getElementById("startButtonClearPath").onclick = () => {
                    this.clearPath("clickedButton");
                }

                document.getElementById("startButtonCreateMazeThree").onclick = () => {
                    this.clearWalls();
                    this.clearPath("clickedButton");
                    this.toggleButtons();
                    otherMaze(this, 2, this.height - 3, 2, this.width - 3, "vertical", false);
                    mazeGenerationAnimations(this);
                }

                document.getElementById("startButtonCreateMazeFour").onclick = () => {
                    this.clearWalls();
                    this.clearPath("clickedButton");
                    this.toggleButtons();
                    otherOtherMaze(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false);
                    mazeGenerationAnimations(this);
                }

                document.getElementById("startButtonAddObject").onclick = () => {
                    let innerHTML = document.getElementById("startButtonAddObject").innerHTML;
                    if (this.currentAlgorithm !== "bidirectional") {
                        if (innerHTML.includes("Add")) {
                            let r = Math.floor(this.height / 2);
                            let c = Math.floor(2 * this.width / 4);
                            let objectNodeId = `${r}-${c}`;
                            if (this.target === objectNodeId || this.start === objectNodeId || this.numberOfObjects === 1) {
                                console.log("Failure to place object.");
                            } else {
                                document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Remove Bomb</a></li>';
                                this.clearPath("clickedButton");
                                this.object = objectNodeId;
                                this.numberOfObjects = 1;
                                this.nodes[objectNodeId].status = "object";
                                document.getElementById(objectNodeId).className = "object";
                            }
                        } else {
                            let objectNodeId = this.object;
                            document.getElementById("startButtonAddObject").innerHTML = '<a href="#">Add Bomb</a></li>';
                            document.getElementById(objectNodeId).className = "unvisited";
                            this.object = null;
                            this.numberOfObjects = 0;
                            this.nodes[objectNodeId].status = "unvisited";
                            this.isObject = false;
                            this.clearPath("clickedButton");
                        }
                    }

                }

                document.getElementById("startButtonClearPath").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonClearWalls").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonClearBoard").className = "navbar-inverse navbar-nav";
                if (this.currentAlgorithm !== "bidirectional") {
                    document.getElementById("startButtonAddObject").className = "navbar-inverse navbar-nav";
                }
                document.getElementById("startButtonCreateMazeOne").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonCreateMazeTwo").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonCreateMazeThree").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonCreateMazeFour").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonCreateMazeWeights").className = "navbar-inverse navbar-nav";
                document.getElementById("startStairDemonstration").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonDFS").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonBFS").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonDijkstra").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonAStar").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonAStar2").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonAStar3").className = "navbar-inverse navbar-nav";
                document.getElementById("adjustFast").className = "navbar-inverse navbar-nav";
                document.getElementById("adjustAverage").className = "navbar-inverse navbar-nav";
                document.getElementById("adjustSlow").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonBidirectional").className = "navbar-inverse navbar-nav";
                document.getElementById("startButtonGreedy").className = "navbar-inverse navbar-nav";
                document.getElementById("actualStartButton").style.backgroundColor = "";

            } else {
                this.buttonsOn = false;
                document.getElementById("startButtonDFS").onclick = null;
                document.getElementById("startButtonBFS").onclick = null;
                document.getElementById("startButtonDijkstra").onclick = null;
                document.getElementById("startButtonAStar").onclick = null;
                document.getElementById("startButtonGreedy").onclick = null;
                document.getElementById("startButtonAddObject").onclick = null;
                document.getElementById("startButtonAStar2").onclick = null;
                document.getElementById("startButtonAStar3").onclick = null;
                document.getElementById("startButtonBidirectional").onclick = null;
                document.getElementById("startButtonCreateMazeOne").onclick = null;
                document.getElementById("startButtonCreateMazeTwo").onclick = null;
                document.getElementById("startButtonCreateMazeThree").onclick = null;
                document.getElementById("startButtonCreateMazeFour").onclick = null;
                document.getElementById("startButtonCreateMazeWeights").onclick = null;
                document.getElementById("startStairDemonstration").onclick = null;
                document.getElementById("startButtonClearPath").onclick = null;
                document.getElementById("startButtonClearWalls").onclick = null;
                document.getElementById("startButtonClearBoard").onclick = null;
                document.getElementById("startButtonStart").onclick = null;
                document.getElementById("adjustFast").onclick = null;
                document.getElementById("adjustAverage").onclick = null;
                document.getElementById("adjustSlow").onclick = null;

                document.getElementById("adjustFast").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("adjustAverage").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("adjustSlow").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonClearPath").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonClearWalls").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonClearBoard").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonAddObject").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonCreateMazeOne").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonCreateMazeTwo").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonCreateMazeThree").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonCreateMazeFour").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonCreateMazeWeights").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startStairDemonstration").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonDFS").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonBFS").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonDijkstra").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonAStar").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonGreedy").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonAStar2").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonAStar3").className = "navbar-inverse navbar-nav disabledA";
                document.getElementById("startButtonBidirectional").className = "navbar-inverse navbar-nav disabledA";

                document.getElementById("actualStartButton").style.backgroundColor = "rgb(185, 15, 15)";
            }


        }

        let navbarHeight = $("#navbarDiv").height();
        let textHeight = $("#mainText").height() + $("#algorithmDescriptor").height();
        let height = Math.floor(($(document).height() - navbarHeight - textHeight) / 28);
        let width = Math.floor($(document).width() / 20);
        let newBoard = new Board(height, width)
        newBoard.initialise();

        window.onkeydown = (e) => {
            newBoard.keyDown = e.keyCode;
        }

        window.onkeyup = (e) => {
            newBoard.keyDown = false;
        }

    }, { "./animations/launchAnimations": 1, "./animations/launchInstantAnimations": 2, "./animations/mazeGenerationAnimations": 3, "./getDistance": 5, "./mazeAlgorithms/otherMaze": 6, "./mazeAlgorithms/otherOtherMaze": 7, "./mazeAlgorithms/recursiveDivisionMaze": 8, "./mazeAlgorithms/simpleDemonstration": 9, "./mazeAlgorithms/stairDemonstration": 10, "./mazeAlgorithms/weightsDemonstration": 11, "./node": 12, "./pathfindingAlgorithms/astar": 13, "./pathfindingAlgorithms/bidirectional": 14, "./pathfindingAlgorithms/unweightedSearchAlgorithm": 15, "./pathfindingAlgorithms/weightedSearchAlgorithm": 16 }], 5: [function (require, module, exports) {
        function getDistance(nodeOne, nodeTwo) {
            let currentCoordinates = nodeOne.id.split("-");
            let targetCoordinates = nodeTwo.id.split("-");
            let x1 = parseInt(currentCoordinates[0]);
            let y1 = parseInt(currentCoordinates[1]);
            let x2 = parseInt(targetCoordinates[0]);
            let y2 = parseInt(targetCoordinates[1]);
            if (x2 < x1) {
                if (nodeOne.direction === "up") {
                    return [1, ["f"], "up"];
                } else if (nodeOne.direction === "right") {
                    return [2, ["l", "f"], "up"];
                } else if (nodeOne.direction === "left") {
                    return [2, ["r", "f"], "up"];
                } else if (nodeOne.direction === "down") {
                    return [3, ["r", "r", "f"], "up"];
                }
            } else if (x2 > x1) {
                if (nodeOne.direction === "up") {
                    return [3, ["r", "r", "f"], "down"];
                } else if (nodeOne.direction === "right") {
                    return [2, ["r", "f"], "down"];
                } else if (nodeOne.direction === "left") {
                    return [2, ["l", "f"], "down"];
                } else if (nodeOne.direction === "down") {
                    return [1, ["f"], "down"];
                }
            }
            if (y2 < y1) {
                if (nodeOne.direction === "up") {
                    return [2, ["l", "f"], "left"];
                } else if (nodeOne.direction === "right") {
                    return [3, ["l", "l", "f"], "left"];
                } else if (nodeOne.direction === "left") {
                    return [1, ["f"], "left"];
                } else if (nodeOne.direction === "down") {
                    return [2, ["r", "f"], "left"];
                }
            } else if (y2 > y1) {
                if (nodeOne.direction === "up") {
                    return [2, ["r", "f"], "right"];
                } else if (nodeOne.direction === "right") {
                    return [1, ["f"], "right"];
                } else if (nodeOne.direction === "left") {
                    return [3, ["r", "r", "f"], "right"];
                } else if (nodeOne.direction === "down") {
                    return [2, ["l", "f"], "right"];
                }
            }
        }

        module.exports = getDistance;

    }, {}], 6: [function (require, module, exports) {
        function recursiveDivisionMaze(board, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) {
            if (rowEnd < rowStart || colEnd < colStart) {
                return;
            }
            if (!surroundingWalls) {
                let relevantIds = [board.start, board.target];
                if (board.object) relevantIds.push(board.object);
                Object.keys(board.nodes).forEach(node => {
                    if (!relevantIds.includes(node)) {
                        let r = parseInt(node.split("-")[0]);
                        let c = parseInt(node.split("-")[1]);
                        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
                            let currentHTMLNode = document.getElementById(node);
                            board.wallsToAnimate.push(currentHTMLNode);
                            board.nodes[node].status = "wall";
                        }
                    }
                });
                surroundingWalls = true;
            }
            if (orientation === "horizontal") {
                let possibleRows = [];
                for (let number = rowStart; number <= rowEnd; number += 2) {
                    possibleRows.push(number);
                }
                let possibleCols = [];
                for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
                    possibleCols.push(number);
                }
                let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
                let randomColIndex = Math.floor(Math.random() * possibleCols.length);
                let currentRow = possibleRows[randomRowIndex];
                let colRandom = possibleCols[randomColIndex];
                Object.keys(board.nodes).forEach(node => {
                    let r = parseInt(node.split("-")[0]);
                    let c = parseInt(node.split("-")[1]);
                    if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
                        let currentHTMLNode = document.getElementById(node);
                        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
                            board.wallsToAnimate.push(currentHTMLNode);
                            board.nodes[node].status = "wall";
                        }
                    }
                });
                if (currentRow - 2 - rowStart > colEnd - colStart) {
                    recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
                } else {
                    recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls);
                }
                if (rowEnd - (currentRow + 2) > colEnd - colStart) {
                    recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
                } else {
                    recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
                }
            } else {
                let possibleCols = [];
                for (let number = colStart; number <= colEnd; number += 2) {
                    possibleCols.push(number);
                }
                let possibleRows = [];
                for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
                    possibleRows.push(number);
                }
                let randomColIndex = Math.floor(Math.random() * possibleCols.length);
                let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
                let currentCol = possibleCols[randomColIndex];
                let rowRandom = possibleRows[randomRowIndex];
                Object.keys(board.nodes).forEach(node => {
                    let r = parseInt(node.split("-")[0]);
                    let c = parseInt(node.split("-")[1]);
                    if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
                        let currentHTMLNode = document.getElementById(node);
                        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
                            board.wallsToAnimate.push(currentHTMLNode);
                            board.nodes[node].status = "wall";
                        }
                    }
                });
                if (rowEnd - rowStart > currentCol - 2 - colStart) {
                    recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, "vertical", surroundingWalls);
                } else {
                    recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls);
                }
                if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
                    recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls);
                } else {
                    recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
                }
            }
        };

        module.exports = recursiveDivisionMaze;

    }, {}], 7: [function (require, module, exports) {
        function recursiveDivisionMaze(board, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) {
            if (rowEnd < rowStart || colEnd < colStart) {
                return;
            }
            if (!surroundingWalls) {
                let relevantIds = [board.start, board.target];
                if (board.object) relevantIds.push(board.object);
                Object.keys(board.nodes).forEach(node => {
                    if (!relevantIds.includes(node)) {
                        let r = parseInt(node.split("-")[0]);
                        let c = parseInt(node.split("-")[1]);
                        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
                            let currentHTMLNode = document.getElementById(node);
                            board.wallsToAnimate.push(currentHTMLNode);
                            board.nodes[node].status = "wall";
                        }
                    }
                });
                surroundingWalls = true;
            }
            if (orientation === "horizontal") {
                let possibleRows = [];
                for (let number = rowStart; number <= rowEnd; number += 2) {
                    possibleRows.push(number);
                }
                let possibleCols = [];
                for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
                    possibleCols.push(number);
                }
                let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
                let randomColIndex = Math.floor(Math.random() * possibleCols.length);
                let currentRow = possibleRows[randomRowIndex];
                let colRandom = possibleCols[randomColIndex];
                Object.keys(board.nodes).forEach(node => {
                    let r = parseInt(node.split("-")[0]);
                    let c = parseInt(node.split("-")[1]);
                    if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
                        let currentHTMLNode = document.getElementById(node);
                        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
                            board.wallsToAnimate.push(currentHTMLNode);
                            board.nodes[node].status = "wall";
                        }
                    }
                });
                if (currentRow - 2 - rowStart > colEnd - colStart) {
                    recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
                } else {
                    recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, "horizontal", surroundingWalls);
                }
                if (rowEnd - (currentRow + 2) > colEnd - colStart) {
                    recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls);
                } else {
                    recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
                }
            } else {
                let possibleCols = [];
                for (let number = colStart; number <= colEnd; number += 2) {
                    possibleCols.push(number);
                }
                let possibleRows = [];
                for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
                    possibleRows.push(number);
                }
                let randomColIndex = Math.floor(Math.random() * possibleCols.length);
                let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
                let currentCol = possibleCols[randomColIndex];
                let rowRandom = possibleRows[randomRowIndex];
                Object.keys(board.nodes).forEach(node => {
                    let r = parseInt(node.split("-")[0]);
                    let c = parseInt(node.split("-")[1]);
                    if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
                        let currentHTMLNode = document.getElementById(node);
                        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
                            board.wallsToAnimate.push(currentHTMLNode);
                            board.nodes[node].status = "wall";
                        }
                    }
                });
                if (rowEnd - rowStart > currentCol - 2 - colStart) {
                    recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls);
                } else {
                    recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls);
                }
                if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
                    recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls);
                } else {
                    recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
                }
            }
        };

        module.exports = recursiveDivisionMaze;

    }, {}], 8: [function (require, module, exports) {
        function recursiveDivisionMaze(board, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, type) {
            if (rowEnd < rowStart || colEnd < colStart) {
                return;
            }
            if (!surroundingWalls) {
                let relevantIds = [board.start, board.target];
                if (board.object) relevantIds.push(board.object);
                Object.keys(board.nodes).forEach(node => {
                    if (!relevantIds.includes(node)) {
                        let r = parseInt(node.split("-")[0]);
                        let c = parseInt(node.split("-")[1]);
                        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
                            let currentHTMLNode = document.getElementById(node);
                            board.wallsToAnimate.push(currentHTMLNode);
                            if (type === "wall") {
                                board.nodes[node].status = "wall";
                                board.nodes[node].weight = 0;
                            } else if (type === "weight") {
                                board.nodes[node].status = "unvisited";
                                board.nodes[node].weight = 15;
                            }
                        }
                    }
                });
                surroundingWalls = true;
            }
            if (orientation === "horizontal") {
                let possibleRows = [];
                for (let number = rowStart; number <= rowEnd; number += 2) {
                    possibleRows.push(number);
                }
                let possibleCols = [];
                for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
                    possibleCols.push(number);
                }
                let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
                let randomColIndex = Math.floor(Math.random() * possibleCols.length);
                let currentRow = possibleRows[randomRowIndex];
                let colRandom = possibleCols[randomColIndex];
                Object.keys(board.nodes).forEach(node => {
                    let r = parseInt(node.split("-")[0]);
                    let c = parseInt(node.split("-")[1]);
                    if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
                        let currentHTMLNode = document.getElementById(node);
                        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
                            board.wallsToAnimate.push(currentHTMLNode);
                            if (type === "wall") {
                                board.nodes[node].status = "wall";
                                board.nodes[node].weight = 0;
                            } else if (type === "weight") {
                                board.nodes[node].status = "unvisited";
                                board.nodes[node].weight = 15;
                            }
                        }
                    }
                });
                if (currentRow - 2 - rowStart > colEnd - colStart) {
                    recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls, type);
                } else {
                    recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls, type);
                }
                if (rowEnd - (currentRow + 2) > colEnd - colStart) {
                    recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls, type);
                } else {
                    recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls, type);
                }
            } else {
                let possibleCols = [];
                for (let number = colStart; number <= colEnd; number += 2) {
                    possibleCols.push(number);
                }
                let possibleRows = [];
                for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
                    possibleRows.push(number);
                }
                let randomColIndex = Math.floor(Math.random() * possibleCols.length);
                let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
                let currentCol = possibleCols[randomColIndex];
                let rowRandom = possibleRows[randomRowIndex];
                Object.keys(board.nodes).forEach(node => {
                    let r = parseInt(node.split("-")[0]);
                    let c = parseInt(node.split("-")[1]);
                    if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
                        let currentHTMLNode = document.getElementById(node);
                        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
                            board.wallsToAnimate.push(currentHTMLNode);
                            if (type === "wall") {
                                board.nodes[node].status = "wall";
                                board.nodes[node].weight = 0;
                            } else if (type === "weight") {
                                board.nodes[node].status = "unvisited";
                                board.nodes[node].weight = 15;
                            }
                        }
                    }
                });
                if (rowEnd - rowStart > currentCol - 2 - colStart) {
                    recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls, type);
                } else {
                    recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls, type);
                }
                if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
                    recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls, type);
                } else {
                    recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls, type);
                }
            }
        };

        module.exports = recursiveDivisionMaze;

    }, {}], 9: [function (require, module, exports) {
        function simpleDemonstration(board) {
            let currentIdY = board.width - 10;
            for (let counter = 0; counter < 7; counter++) {
                let currentIdXOne = Math.floor(board.height / 2) - counter;
                let currentIdXTwo = Math.floor(board.height / 2) + counter;
                let currentIdOne = `${currentIdXOne}-${currentIdY}`;
                let currentIdTwo = `${currentIdXTwo}-${currentIdY}`;
                let currentElementOne = document.getElementById(currentIdOne);
                let currentElementTwo = document.getElementById(currentIdTwo);
                board.wallsToAnimate.push(currentElementOne);
                board.wallsToAnimate.push(currentElementTwo);
                let currentNodeOne = board.nodes[currentIdOne];
                let currentNodeTwo = board.nodes[currentIdTwo];
                currentNodeOne.status = "wall";
                currentNodeOne.weight = 0;
                currentNodeTwo.status = "wall";
                currentNodeTwo.weight = 0;
            }
        }

        module.exports = simpleDemonstration;

    }, {}], 10: [function (require, module, exports) {
        function stairDemonstration(board) {
            let currentIdX = board.height - 1;
            let currentIdY = 0;
            let relevantStatuses = ["start", "target", "object"];
            while (currentIdX > 0 && currentIdY < board.width) {
                let currentId = `${currentIdX}-${currentIdY}`;
                let currentNode = board.nodes[currentId];
                let currentHTMLNode = document.getElementById(currentId);
                if (!relevantStatuses.includes(currentNode.status)) {
                    currentNode.status = "wall";
                    board.wallsToAnimate.push(currentHTMLNode);
                }
                currentIdX--;
                currentIdY++;
            }
            while (currentIdX < board.height - 2 && currentIdY < board.width) {
                let currentId = `${currentIdX}-${currentIdY}`;
                let currentNode = board.nodes[currentId];
                let currentHTMLNode = document.getElementById(currentId);
                if (!relevantStatuses.includes(currentNode.status)) {
                    currentNode.status = "wall";
                    board.wallsToAnimate.push(currentHTMLNode);
                }
                currentIdX++;
                currentIdY++;
            }
            while (currentIdX > 0 && currentIdY < board.width - 1) {
                let currentId = `${currentIdX}-${currentIdY}`;
                let currentNode = board.nodes[currentId];
                let currentHTMLNode = document.getElementById(currentId);
                if (!relevantStatuses.includes(currentNode.status)) {
                    currentNode.status = "wall";
                    board.wallsToAnimate.push(currentHTMLNode);
                }
                currentIdX--;
                currentIdY++;
            }
        }

        module.exports = stairDemonstration;

    }, {}], 11: [function (require, module, exports) {
        function weightsDemonstration(board) {
            let currentIdX = board.height - 1;
            let currentIdY = 35;
            while (currentIdX > 5) {
                let currentId = `${currentIdX}-${currentIdY}`;
                let currentElement = document.getElementById(currentId);
                board.wallsToAnimate.push(currentElement);
                let currentNode = board.nodes[currentId];
                currentNode.status = "wall";
                currentNode.weight = 0;
                currentIdX--;
            }
            for (let currentIdX = board.height - 2; currentIdX > board.height - 11; currentIdX--) {
                for (let currentIdY = 1; currentIdY < 35; currentIdY++) {
                    let currentId = `${currentIdX}-${currentIdY}`;
                    let currentElement = document.getElementById(currentId);
                    board.wallsToAnimate.push(currentElement);
                    let currentNode = board.nodes[currentId];
                    if (currentIdX === board.height - 2 && currentIdY < 35 && currentIdY > 26) {
                        currentNode.status = "wall";
                        currentNode.weight = 0;
                    } else {
                        currentNode.status = "unvisited";
                        currentNode.weight = 15;
                    }
                }
            }
        }

        module.exports = weightsDemonstration;

    }, {}], 12: [function (require, module, exports) {
        function Node(id, status) {
            this.id = id;
            this.status = status;
            this.previousNode = null;
            this.path = null;
            this.direction = null;
            this.storedDirection = null;
            this.distance = Infinity;
            this.totalDistance = Infinity;
            this.heuristicDistance = null;
            this.weight = 0;
            this.relatesToObject = false;
            this.overwriteObjectRelation = false;

            this.otherid = id;
            this.otherstatus = status;
            this.otherpreviousNode = null;
            this.otherpath = null;
            this.otherdirection = null;
            this.otherstoredDirection = null;
            this.otherdistance = Infinity;
            this.otherweight = 0;
            this.otherrelatesToObject = false;
            this.otheroverwriteObjectRelation = false;
        }

        module.exports = Node;

    }, {}], 13: [function (require, module, exports) {
        function astar(nodes, start, target, nodesToAnimate, boardArray, name, heuristic) {
            if (!start || !target || start === target) {
                return false;
            }
            nodes[start].distance = 0;
            nodes[start].totalDistance = 0;
            nodes[start].direction = "up";
            let unvisitedNodes = Object.keys(nodes);
            while (unvisitedNodes.length) {
                let currentNode = closestNode(nodes, unvisitedNodes);
                while (currentNode.status === "wall" && unvisitedNodes.length) {
                    currentNode = closestNode(nodes, unvisitedNodes)
                }
                if (currentNode.distance === Infinity) return false;
                nodesToAnimate.push(currentNode);
                currentNode.status = "visited";
                if (currentNode.id === target) {
                    return "success!";
                }
                updateNeighbors(nodes, currentNode, boardArray, target, name, start, heuristic);
            }
        }

        function closestNode(nodes, unvisitedNodes) {
            let currentClosest, index;
            for (let i = 0; i < unvisitedNodes.length; i++) {
                if (!currentClosest || currentClosest.totalDistance > nodes[unvisitedNodes[i]].totalDistance) {
                    currentClosest = nodes[unvisitedNodes[i]];
                    index = i;
                } else if (currentClosest.totalDistance === nodes[unvisitedNodes[i]].totalDistance) {
                    if (currentClosest.heuristicDistance > nodes[unvisitedNodes[i]].heuristicDistance) {
                        currentClosest = nodes[unvisitedNodes[i]];
                        index = i;
                    }
                }
            }
            unvisitedNodes.splice(index, 1);
            return currentClosest;
        }

        function updateNeighbors(nodes, node, boardArray, target, name, start, heuristic) {
            let neighbors = getNeighbors(node.id, nodes, boardArray);
            for (let neighbor of neighbors) {
                if (target) {
                    updateNode(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
                } else {
                    updateNode(node, nodes[neighbor]);
                }
            }
        }

        function updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
            let distance = getDistance(currentNode, targetNode);
            if (!targetNode.heuristicDistance) targetNode.heuristicDistance = manhattanDistance(targetNode, actualTargetNode);
            let distanceToCompare = currentNode.distance + targetNode.weight + distance[0];
            if (distanceToCompare < targetNode.distance) {
                targetNode.distance = distanceToCompare;
                targetNode.totalDistance = targetNode.distance + targetNode.heuristicDistance;
                targetNode.previousNode = currentNode.id;
                targetNode.path = distance[1];
                targetNode.direction = distance[2];
            }
        }

        function getNeighbors(id, nodes, boardArray) {
            let coordinates = id.split("-");
            let x = parseInt(coordinates[0]);
            let y = parseInt(coordinates[1]);
            let neighbors = [];
            let potentialNeighbor;
            if (boardArray[x - 1] && boardArray[x - 1][y]) {
                potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            if (boardArray[x + 1] && boardArray[x + 1][y]) {
                potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            if (boardArray[x][y - 1]) {
                potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            if (boardArray[x][y + 1]) {
                potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            if (boardArray[x - 1] && boardArray[x - 1][y - 1]) {
              potentialNeighbor = `${(x - 1).toString()}-${(y - 1).toString()}`
              let potentialWallOne = `${(x - 1).toString()}-${y.toString()}`
              let potentialWallTwo = `${x.toString()}-${(y - 1).toString()}`
              if (nodes[potentialNeighbor].status !== "wall" && !(nodes[potentialWallOne].status === "wall" && nodes[potentialWallTwo].status === "wall")) neighbors.push(potentialNeighbor);
            }
            if (boardArray[x + 1] && boardArray[x + 1][y - 1]) {
              potentialNeighbor = `${(x + 1).toString()}-${(y - 1).toString()}`
              let potentialWallOne = `${(x + 1).toString()}-${y.toString()}`
              let potentialWallTwo = `${x.toString()}-${(y - 1).toString()}`
              if (nodes[potentialNeighbor].status !== "wall" && !(nodes[potentialWallOne].status === "wall" && nodes[potentialWallTwo].status === "wall")) neighbors.push(potentialNeighbor);
            }
            if (boardArray[x - 1] && boardArray[x - 1][y + 1]) {
              potentialNeighbor = `${(x - 1).toString()}-${(y + 1).toString()}`
              let potentialWallOne = `${(x - 1).toString()}-${y.toString()}`
              let potentialWallTwo = `${x.toString()}-${(y + 1).toString()}`
              if (nodes[potentialNeighbor].status !== "wall" && !(nodes[potentialWallOne].status === "wall" && nodes[potentialWallTwo].status === "wall")) neighbors.push(potentialNeighbor);
            }
            if (boardArray[x + 1] && boardArray[x + 1][y + 1]) {
              potentialNeighbor = `${(x + 1).toString()}-${(y + 1).toString()}`
              let potentialWallOne = `${(x + 1).toString()}-${y.toString()}`
              let potentialWallTwo = `${x.toString()}-${(y + 1).toString()}`
              if (nodes[potentialNeighbor].status !== "wall" && !(nodes[potentialWallOne].status === "wall" && nodes[potentialWallTwo].status === "wall")) neighbors.push(potentialNeighbor);
            }
            return neighbors;
        }


        function getDistance(nodeOne, nodeTwo) {
            let currentCoordinates = nodeOne.id.split("-");
            let targetCoordinates = nodeTwo.id.split("-");
            let x1 = parseInt(currentCoordinates[0]);
            let y1 = parseInt(currentCoordinates[1]);
            let x2 = parseInt(targetCoordinates[0]);
            let y2 = parseInt(targetCoordinates[1]);
            if (x2 < x1 && y1 === y2) {
                if (nodeOne.direction === "up") {
                    return [1, ["f"], "up"];
                } else if (nodeOne.direction === "right") {
                    return [2, ["l", "f"], "up"];
                } else if (nodeOne.direction === "left") {
                    return [2, ["r", "f"], "up"];
                } else if (nodeOne.direction === "down") {
                    return [3, ["r", "r", "f"], "up"];
                } else if (nodeOne.direction === "up-right") {
                    return [1.5, null, "up"];
                } else if (nodeOne.direction === "down-right") {
                    return [2.5, null, "up"];
                } else if (nodeOne.direction === "up-left") {
                    return [1.5, null, "up"];
                } else if (nodeOne.direction === "down-left") {
                    return [2.5, null, "up"];
                }
            } else if (x2 > x1 && y1 === y2) {
                if (nodeOne.direction === "up") {
                    return [3, ["r", "r", "f"], "down"];
                } else if (nodeOne.direction === "right") {
                    return [2, ["r", "f"], "down"];
                } else if (nodeOne.direction === "left") {
                    return [2, ["l", "f"], "down"];
                } else if (nodeOne.direction === "down") {
                    return [1, ["f"], "down"];
                } else if (nodeOne.direction === "up-right") {
                    return [2.5, null, "down"];
                } else if (nodeOne.direction === "down-right") {
                    return [1.5, null, "down"];
                } else if (nodeOne.direction === "up-left") {
                    return [2.5, null, "down"];
                } else if (nodeOne.direction === "down-left") {
                    return [1.5, null, "down"];
                }
            }
            if (y2 < y1 && x1 === x2) {
                if (nodeOne.direction === "up") {
                    return [2, ["l", "f"], "left"];
                } else if (nodeOne.direction === "right") {
                    return [3, ["l", "l", "f"], "left"];
                } else if (nodeOne.direction === "left") {
                    return [1, ["f"], "left"];
                } else if (nodeOne.direction === "down") {
                    return [2, ["r", "f"], "left"];
                } else if (nodeOne.direction === "up-right") {
                    return [2.5, null, "left"];
                } else if (nodeOne.direction === "down-right") {
                    return [2.5, null, "left"];
                } else if (nodeOne.direction === "up-left") {
                    return [1.5, null, "left"];
                } else if (nodeOne.direction === "down-left") {
                    return [1.5, null, "left"];
                }
            } else if (y2 > y1 && x1 === x2) {
                if (nodeOne.direction === "up") {
                    return [2, ["r", "f"], "right"];
                } else if (nodeOne.direction === "right") {
                    return [1, ["f"], "right"];
                } else if (nodeOne.direction === "left") {
                    return [3, ["r", "r", "f"], "right"];
                } else if (nodeOne.direction === "down") {
                    return [2, ["l", "f"], "right"];
                } else if (nodeOne.direction === "up-right") {
                    return [1.5, null, "right"];
                } else if (nodeOne.direction === "down-right") {
                    return [1.5, null, "right"];
                } else if (nodeOne.direction === "up-left") {
                    return [2.5, null, "right"];
                } else if (nodeOne.direction === "down-left") {
                    return [2.5, null, "right"];
                }
            } /*else if (x2 < x1 && y2 < y1) {
        if (nodeOne.direction === "up") {
          return [1.5, ["f"], "up-left"];
        } else if (nodeOne.direction === "right") {
          return [2.5, ["l", "f"], "up-left"];
        } else if (nodeOne.direction === "left") {
          return [1.5, ["r", "f"], "up-left"];
        } else if (nodeOne.direction === "down") {
          return [2.5, ["r", "r", "f"], "up-left"];
        } else if (nodeOne.direction === "up-right") {
          return [2, null, "up-left"];
        } else if (nodeOne.direction === "down-right") {
          return [3, null, "up-left"];
        } else if (nodeOne.direction === "up-left") {
          return [1, null, "up-left"];
        } else if (nodeOne.direction === "down-left") {
          return [2, null, "up-left"];
        }
      } else if (x2 < x1 && y2 > y1) {
        if (nodeOne.direction === "up") {
          return [1.5, ["f"], "up-right"];
        } else if (nodeOne.direction === "right") {
          return [1.5, ["l", "f"], "up-right"];
        } else if (nodeOne.direction === "left") {
          return [2.5, ["r", "f"], "up-right"];
        } else if (nodeOne.direction === "down") {
          return [2.5, ["r", "r", "f"], "up-right"];
        } else if (nodeOne.direction === "up-right") {
          return [1, null, "up-right"];
        } else if (nodeOne.direction === "down-right") {
          return [2, null, "up-right"];
        } else if (nodeOne.direction === "up-left") {
          return [2, null, "up-right"];
        } else if (nodeOne.direction === "down-left") {
          return [3, null, "up-right"];
        }
      } else if (x2 > x1 && y2 > y1) {
        if (nodeOne.direction === "up") {
          return [2.5, ["f"], "down-right"];
        } else if (nodeOne.direction === "right") {
          return [1.5, ["l", "f"], "down-right"];
        } else if (nodeOne.direction === "left") {
          return [2.5, ["r", "f"], "down-right"];
        } else if (nodeOne.direction === "down") {
          return [1.5, ["r", "r", "f"], "down-right"];
        } else if (nodeOne.direction === "up-right") {
          return [2, null, "down-right"];
        } else if (nodeOne.direction === "down-right") {
          return [1, null, "down-right"];
        } else if (nodeOne.direction === "up-left") {
          return [3, null, "down-right"];
        } else if (nodeOne.direction === "down-left") {
          return [2, null, "down-right"];
        }
      } else if (x2 > x1 && y2 < y1) {
        if (nodeOne.direction === "up") {
          return [2.5, ["f"], "down-left"];
        } else if (nodeOne.direction === "right") {
          return [2.5, ["l", "f"], "down-left"];
        } else if (nodeOne.direction === "left") {
          return [1.5, ["r", "f"], "down-left"];
        } else if (nodeOne.direction === "down") {
          return [1.5, ["r", "r", "f"], "down-left"];
        } else if (nodeOne.direction === "up-right") {
          return [3, null, "down-left"];
        } else if (nodeOne.direction === "down-right") {
          return [2, null, "down-left"];
        } else if (nodeOne.direction === "up-left") {
          return [2, null, "down-left"];
        } else if (nodeOne.direction === "down-left") {
          return [1, null, "down-left"];
        }
      }*/
        }

        function manhattanDistance(nodeOne, nodeTwo) {
            let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
            let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
            let xOne = nodeOneCoordinates[0];
            let xTwo = nodeTwoCoordinates[0];
            let yOne = nodeOneCoordinates[1];
            let yTwo = nodeTwoCoordinates[1];

            let xChange = Math.abs(xOne - xTwo);
            let yChange = Math.abs(yOne - yTwo);

            return (xChange + yChange);
        }



        module.exports = astar;

    }, {}], 14: [function (require, module, exports) {
        const astar = require("./astar");

        function bidirectional(nodes, start, target, nodesToAnimate, boardArray, name, heuristic, board) {
            if (name === "astar") return astar(nodes, start, target, nodesToAnimate, boardArray, name)
            if (!start || !target || start === target) {
                return false;
            }
            nodes[start].distance = 0;
            nodes[start].direction = "right";
            nodes[target].otherdistance = 0;
            nodes[target].otherdirection = "left";
            let visitedNodes = {};
            let unvisitedNodesOne = Object.keys(nodes);
            let unvisitedNodesTwo = Object.keys(nodes);
            while (unvisitedNodesOne.length && unvisitedNodesTwo.length) {
                let currentNode = closestNode(nodes, unvisitedNodesOne);
                let secondCurrentNode = closestNodeTwo(nodes, unvisitedNodesTwo);
                while ((currentNode.status === "wall" || secondCurrentNode.status === "wall") && unvisitedNodesOne.length && unvisitedNodesTwo.length) {
                    if (currentNode.status === "wall") currentNode = closestNode(nodes, unvisitedNodesOne);
                    if (secondCurrentNode.status === "wall") secondCurrentNode = closestNodeTwo(nodes, unvisitedNodesTwo);
                }
                if (currentNode.distance === Infinity || secondCurrentNode.otherdistance === Infinity) {
                    return false;
                }
                nodesToAnimate.push(currentNode);
                nodesToAnimate.push(secondCurrentNode);
                currentNode.status = "visited";
                secondCurrentNode.status = "visited";
                if (visitedNodes[currentNode.id]) {
                    board.middleNode = currentNode.id;
                    return "success";
                } else if (visitedNodes[secondCurrentNode.id]) {
                    board.middleNode = secondCurrentNode.id;
                    return "success";
                } else if (currentNode === secondCurrentNode) {
                    board.middleNode = secondCurrentNode.id;
                    return "success";
                }
                visitedNodes[currentNode.id] = true;
                visitedNodes[secondCurrentNode.id] = true;
                updateNeighbors(nodes, currentNode, boardArray, target, name, start, heuristic);
                updateNeighborsTwo(nodes, secondCurrentNode, boardArray, start, name, target, heuristic);
            }
        }

        function closestNode(nodes, unvisitedNodes) {
            let currentClosest, index;
            for (let i = 0; i < unvisitedNodes.length; i++) {
                if (!currentClosest || currentClosest.distance > nodes[unvisitedNodes[i]].distance) {
                    currentClosest = nodes[unvisitedNodes[i]];
                    index = i;
                }
            }
            unvisitedNodes.splice(index, 1);
            return currentClosest;
        }

        function closestNodeTwo(nodes, unvisitedNodes) {
            let currentClosest, index;
            for (let i = 0; i < unvisitedNodes.length; i++) {
                if (!currentClosest || currentClosest.otherdistance > nodes[unvisitedNodes[i]].otherdistance) {
                    currentClosest = nodes[unvisitedNodes[i]];
                    index = i;
                }
            }
            unvisitedNodes.splice(index, 1);
            return currentClosest;
        }

        function updateNeighbors(nodes, node, boardArray, target, name, start, heuristic) {
            let neighbors = getNeighbors(node.id, nodes, boardArray);
            for (let neighbor of neighbors) {
                updateNode(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
            }
        }

        function updateNeighborsTwo(nodes, node, boardArray, target, name, start, heuristic) {
            let neighbors = getNeighbors(node.id, nodes, boardArray);
            for (let neighbor of neighbors) {
                updateNodeTwo(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
            }
        }

        function updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
            let distance = getDistance(currentNode, targetNode);
            let weight = targetNode.weight === 15 ? 15 : 1;
            let distanceToCompare = currentNode.distance + (weight + distance[0]) * manhattanDistance(targetNode, actualTargetNode);
            if (distanceToCompare < targetNode.distance) {
                targetNode.distance = distanceToCompare;
                targetNode.previousNode = currentNode.id;
                targetNode.path = distance[1];
                targetNode.direction = distance[2];
            }
        }

        function updateNodeTwo(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
            let distance = getDistanceTwo(currentNode, targetNode);
            let weight = targetNode.weight === 15 ? 15 : 1;
            let distanceToCompare = currentNode.otherdistance + (weight + distance[0]) * manhattanDistance(targetNode, actualTargetNode);
            if (distanceToCompare < targetNode.otherdistance) {
                targetNode.otherdistance = distanceToCompare;
                targetNode.otherpreviousNode = currentNode.id;
                targetNode.path = distance[1];
                targetNode.otherdirection = distance[2];
            }
        }

        function getNeighbors(id, nodes, boardArray) {
            let coordinates = id.split("-");
            let x = parseInt(coordinates[0]);
            let y = parseInt(coordinates[1]);
            let neighbors = [];
            let potentialNeighbor;
            if (boardArray[x - 1] && boardArray[x - 1][y]) {
                potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            if (boardArray[x + 1] && boardArray[x + 1][y]) {
                potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            if (boardArray[x][y - 1]) {
                potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            if (boardArray[x][y + 1]) {
                potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            return neighbors;
        }

        function getDistance(nodeOne, nodeTwo) {
            let currentCoordinates = nodeOne.id.split("-");
            let targetCoordinates = nodeTwo.id.split("-");
            let x1 = parseInt(currentCoordinates[0]);
            let y1 = parseInt(currentCoordinates[1]);
            let x2 = parseInt(targetCoordinates[0]);
            let y2 = parseInt(targetCoordinates[1]);
            if (x2 < x1) {
                if (nodeOne.direction === "up") {
                    return [1, ["f"], "up"];
                } else if (nodeOne.direction === "right") {
                    return [2, ["l", "f"], "up"];
                } else if (nodeOne.direction === "left") {
                    return [2, ["r", "f"], "up"];
                } else if (nodeOne.direction === "down") {
                    return [3, ["r", "r", "f"], "up"];
                }
            } else if (x2 > x1) {
                if (nodeOne.direction === "up") {
                    return [3, ["r", "r", "f"], "down"];
                } else if (nodeOne.direction === "right") {
                    return [2, ["r", "f"], "down"];
                } else if (nodeOne.direction === "left") {
                    return [2, ["l", "f"], "down"];
                } else if (nodeOne.direction === "down") {
                    return [1, ["f"], "down"];
                }
            }
            if (y2 < y1) {
                if (nodeOne.direction === "up") {
                    return [2, ["l", "f"], "left"];
                } else if (nodeOne.direction === "right") {
                    return [3, ["l", "l", "f"], "left"];
                } else if (nodeOne.direction === "left") {
                    return [1, ["f"], "left"];
                } else if (nodeOne.direction === "down") {
                    return [2, ["r", "f"], "left"];
                }
            } else if (y2 > y1) {
                if (nodeOne.direction === "up") {
                    return [2, ["r", "f"], "right"];
                } else if (nodeOne.direction === "right") {
                    return [1, ["f"], "right"];
                } else if (nodeOne.direction === "left") {
                    return [3, ["r", "r", "f"], "right"];
                } else if (nodeOne.direction === "down") {
                    return [2, ["l", "f"], "right"];
                }
            }
        }

        function getDistanceTwo(nodeOne, nodeTwo) {
            let currentCoordinates = nodeOne.id.split("-");
            let targetCoordinates = nodeTwo.id.split("-");
            let x1 = parseInt(currentCoordinates[0]);
            let y1 = parseInt(currentCoordinates[1]);
            let x2 = parseInt(targetCoordinates[0]);
            let y2 = parseInt(targetCoordinates[1]);
            if (x2 < x1) {
                if (nodeOne.otherdirection === "up") {
                    return [1, ["f"], "up"];
                } else if (nodeOne.otherdirection === "right") {
                    return [2, ["l", "f"], "up"];
                } else if (nodeOne.otherdirection === "left") {
                    return [2, ["r", "f"], "up"];
                } else if (nodeOne.otherdirection === "down") {
                    return [3, ["r", "r", "f"], "up"];
                }
            } else if (x2 > x1) {
                if (nodeOne.otherdirection === "up") {
                    return [3, ["r", "r", "f"], "down"];
                } else if (nodeOne.otherdirection === "right") {
                    return [2, ["r", "f"], "down"];
                } else if (nodeOne.otherdirection === "left") {
                    return [2, ["l", "f"], "down"];
                } else if (nodeOne.otherdirection === "down") {
                    return [1, ["f"], "down"];
                }
            }
            if (y2 < y1) {
                if (nodeOne.otherdirection === "up") {
                    return [2, ["l", "f"], "left"];
                } else if (nodeOne.otherdirection === "right") {
                    return [3, ["l", "l", "f"], "left"];
                } else if (nodeOne.otherdirection === "left") {
                    return [1, ["f"], "left"];
                } else if (nodeOne.otherdirection === "down") {
                    return [2, ["r", "f"], "left"];
                }
            } else if (y2 > y1) {
                if (nodeOne.otherdirection === "up") {
                    return [2, ["r", "f"], "right"];
                } else if (nodeOne.otherdirection === "right") {
                    return [1, ["f"], "right"];
                } else if (nodeOne.otherdirection === "left") {
                    return [3, ["r", "r", "f"], "right"];
                } else if (nodeOne.otherdirection === "down") {
                    return [2, ["l", "f"], "right"];
                }
            }
        }

        function manhattanDistance(nodeOne, nodeTwo) {
            let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
            let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
            let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
            let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
            return (xChange + yChange);
        }

        function weightedManhattanDistance(nodeOne, nodeTwo, nodes) {
            let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
            let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
            let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
            let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);

            if (nodeOneCoordinates[0] < nodeTwoCoordinates[0] && nodeOneCoordinates[1] < nodeTwoCoordinates[1]) {

                let additionalxChange = 0,
                    additionalyChange = 0;
                for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
                    let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }
                for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
                    let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }

                let otherAdditionalxChange = 0,
                    otherAdditionalyChange = 0;
                for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
                    let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }
                for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
                    let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }

                if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
                    xChange += additionalxChange;
                    yChange += additionalyChange;
                } else {
                    xChange += otherAdditionalxChange;
                    yChange += otherAdditionalyChange;
                }
            } else if (nodeOneCoordinates[0] < nodeTwoCoordinates[0] && nodeOneCoordinates[1] >= nodeTwoCoordinates[1]) {
                let additionalxChange = 0,
                    additionalyChange = 0;
                for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
                    let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }
                for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
                    let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }

                let otherAdditionalxChange = 0,
                    otherAdditionalyChange = 0;
                for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
                    let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }
                for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
                    let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }

                if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
                    xChange += additionalxChange;
                    yChange += additionalyChange;
                } else {
                    xChange += otherAdditionalxChange;
                    yChange += otherAdditionalyChange;
                }
            } else if (nodeOneCoordinates[0] >= nodeTwoCoordinates[0] && nodeOneCoordinates[1] < nodeTwoCoordinates[1]) {
                let additionalxChange = 0,
                    additionalyChange = 0;
                for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
                    let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }
                for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
                    let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }

                let otherAdditionalxChange = 0,
                    otherAdditionalyChange = 0;
                for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
                    let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }
                for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
                    let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }

                if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
                    xChange += additionalxChange;
                    yChange += additionalyChange;
                } else {
                    xChange += otherAdditionalxChange;
                    yChange += otherAdditionalyChange;
                }
            } else if (nodeOneCoordinates[0] >= nodeTwoCoordinates[0] && nodeOneCoordinates[1] >= nodeTwoCoordinates[1]) {
                let additionalxChange = 0,
                    additionalyChange = 0;
                for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
                    let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }
                for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
                    let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }

                let otherAdditionalxChange = 0,
                    otherAdditionalyChange = 0;
                for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
                    let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }
                for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
                    let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }

                if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
                    xChange += additionalxChange;
                    yChange += additionalyChange;
                } else {
                    xChange += otherAdditionalxChange;
                    yChange += otherAdditionalyChange;
                }
            }


            return xChange + yChange;


        }

        module.exports = bidirectional;

    }, { "./astar": 13 }], 15: [function (require, module, exports) {
        function unweightedSearchAlgorithm(nodes, start, target, nodesToAnimate, boardArray, name) {
            if (!start || !target || start === target) {
                return false;
            }
            let structure = [nodes[start]];
            let exploredNodes = { start: true };
            while (structure.length) {
                let currentNode = name === "bfs" ? structure.shift() : structure.pop();
                nodesToAnimate.push(currentNode);
                if (name === "dfs") exploredNodes[currentNode.id] = true;
                currentNode.status = "visited";
                if (currentNode.id === target) {
                    return "success";
                }
                let currentNeighbors = getNeighbors(currentNode.id, nodes, boardArray, name);
                currentNeighbors.forEach(neighbor => {
                    if (!exploredNodes[neighbor]) {
                        if (name === "bfs") exploredNodes[neighbor] = true;
                        nodes[neighbor].previousNode = currentNode.id;
                        structure.push(nodes[neighbor]);
                    }
                });
            }
            return false;
        }

        function getNeighbors(id, nodes, boardArray, name) {
            let coordinates = id.split("-");
            let x = parseInt(coordinates[0]);
            let y = parseInt(coordinates[1]);
            let neighbors = [];
            let potentialNeighbor;
            if (boardArray[x - 1] && boardArray[x - 1][y]) {
                potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`
                if (nodes[potentialNeighbor].status !== "wall") {
                    if (name === "bfs") {
                        neighbors.push(potentialNeighbor);
                    } else {
                        neighbors.unshift(potentialNeighbor);
                    }
                }
            }
            if (boardArray[x][y + 1]) {
                potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`
                if (nodes[potentialNeighbor].status !== "wall") {
                    if (name === "bfs") {
                        neighbors.push(potentialNeighbor);
                    } else {
                        neighbors.unshift(potentialNeighbor);
                    }
                }
            }
            if (boardArray[x + 1] && boardArray[x + 1][y]) {
                potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`
                if (nodes[potentialNeighbor].status !== "wall") {
                    if (name === "bfs") {
                        neighbors.push(potentialNeighbor);
                    } else {
                        neighbors.unshift(potentialNeighbor);
                    }
                }
            }
            if (boardArray[x][y - 1]) {
                potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`
                if (nodes[potentialNeighbor].status !== "wall") {
                    if (name === "bfs") {
                        neighbors.push(potentialNeighbor);
                    } else {
                        neighbors.unshift(potentialNeighbor);
                    }
                }
            }
            return neighbors;
        }

        module.exports = unweightedSearchAlgorithm;

    }, {}], 16: [function (require, module, exports) {
        const astar = require("./astar");

        function weightedSearchAlgorithm(nodes, start, target, nodesToAnimate, boardArray, name, heuristic) {
            if (name === "astar") return astar(nodes, start, target, nodesToAnimate, boardArray, name)
            if (!start || !target || start === target) {
                return false;
            }
            nodes[start].distance = 0;
            nodes[start].direction = "right";
            let unvisitedNodes = Object.keys(nodes);
            while (unvisitedNodes.length) {
                let currentNode = closestNode(nodes, unvisitedNodes);
                while (currentNode.status === "wall" && unvisitedNodes.length) {
                    currentNode = closestNode(nodes, unvisitedNodes)
                }
                if (currentNode.distance === Infinity) {
                    return false;
                }
                nodesToAnimate.push(currentNode);
                currentNode.status = "visited";
                if (currentNode.id === target) return "success!";
                if (name === "CLA" || name === "greedy") {
                    updateNeighbors(nodes, currentNode, boardArray, target, name, start, heuristic);
                } else if (name === "dijkstra") {
                    updateNeighbors(nodes, currentNode, boardArray);
                }
            }
        }

        function closestNode(nodes, unvisitedNodes) {
            let currentClosest, index;
            for (let i = 0; i < unvisitedNodes.length; i++) {
                if (!currentClosest || currentClosest.distance > nodes[unvisitedNodes[i]].distance) {
                    currentClosest = nodes[unvisitedNodes[i]];
                    index = i;
                }
            }
            unvisitedNodes.splice(index, 1);
            return currentClosest;
        }

        function updateNeighbors(nodes, node, boardArray, target, name, start, heuristic) {
            let neighbors = getNeighbors(node.id, nodes, boardArray);
            for (let neighbor of neighbors) {
                if (target) {
                    updateNode(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
                } else {
                    updateNode(node, nodes[neighbor]);
                }
            }
        }

        function averageNumberOfNodesBetween(currentNode) {
            let num = 0;
            while (currentNode.previousNode) {
                num++;
                currentNode = currentNode.previousNode;
            }
            return num;
        }


        function updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
            let distance = getDistance(currentNode, targetNode);
            let distanceToCompare;
            if (actualTargetNode && name === "CLA") {
                let weight = targetNode.weight === 15 ? 15 : 1;
                if (heuristic === "manhattanDistance") {
                    distanceToCompare = currentNode.distance + (distance[0] + weight) * manhattanDistance(targetNode, actualTargetNode);
                } else if (heuristic === "poweredManhattanDistance") {
                    distanceToCompare = currentNode.distance + targetNode.weight + distance[0] + Math.pow(manhattanDistance(targetNode, actualTargetNode), 2);
                } else if (heuristic === "extraPoweredManhattanDistance") {
                    distanceToCompare = currentNode.distance + (distance[0] + weight) * Math.pow(manhattanDistance(targetNode, actualTargetNode), 7);
                }
                let startNodeManhattanDistance = manhattanDistance(actualStartNode, actualTargetNode);
            } else if (actualTargetNode && name === "greedy") {
                distanceToCompare = targetNode.weight + distance[0] + manhattanDistance(targetNode, actualTargetNode);
            } else {
                distanceToCompare = currentNode.distance + targetNode.weight + distance[0];
            }
            if (distanceToCompare < targetNode.distance) {
                targetNode.distance = distanceToCompare;
                targetNode.previousNode = currentNode.id;
                targetNode.path = distance[1];
                targetNode.direction = distance[2];
            }
        }

        function getNeighbors(id, nodes, boardArray) {
            let coordinates = id.split("-");
            let x = parseInt(coordinates[0]);
            let y = parseInt(coordinates[1]);
            let neighbors = [];
            let potentialNeighbor;
            if (boardArray[x - 1] && boardArray[x - 1][y]) {
                potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            if (boardArray[x + 1] && boardArray[x + 1][y]) {
                potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            if (boardArray[x][y - 1]) {
                potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            if (boardArray[x][y + 1]) {
                potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`
                if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
            }
            return neighbors;
        }


        function getDistance(nodeOne, nodeTwo) {
            let currentCoordinates = nodeOne.id.split("-");
            let targetCoordinates = nodeTwo.id.split("-");
            let x1 = parseInt(currentCoordinates[0]);
            let y1 = parseInt(currentCoordinates[1]);
            let x2 = parseInt(targetCoordinates[0]);
            let y2 = parseInt(targetCoordinates[1]);
            if (x2 < x1) {
                if (nodeOne.direction === "up") {
                    return [1, ["f"], "up"];
                } else if (nodeOne.direction === "right") {
                    return [2, ["l", "f"], "up"];
                } else if (nodeOne.direction === "left") {
                    return [2, ["r", "f"], "up"];
                } else if (nodeOne.direction === "down") {
                    return [3, ["r", "r", "f"], "up"];
                }
            } else if (x2 > x1) {
                if (nodeOne.direction === "up") {
                    return [3, ["r", "r", "f"], "down"];
                } else if (nodeOne.direction === "right") {
                    return [2, ["r", "f"], "down"];
                } else if (nodeOne.direction === "left") {
                    return [2, ["l", "f"], "down"];
                } else if (nodeOne.direction === "down") {
                    return [1, ["f"], "down"];
                }
            }
            if (y2 < y1) {
                if (nodeOne.direction === "up") {
                    return [2, ["l", "f"], "left"];
                } else if (nodeOne.direction === "right") {
                    return [3, ["l", "l", "f"], "left"];
                } else if (nodeOne.direction === "left") {
                    return [1, ["f"], "left"];
                } else if (nodeOne.direction === "down") {
                    return [2, ["r", "f"], "left"];
                }
            } else if (y2 > y1) {
                if (nodeOne.direction === "up") {
                    return [2, ["r", "f"], "right"];
                } else if (nodeOne.direction === "right") {
                    return [1, ["f"], "right"];
                } else if (nodeOne.direction === "left") {
                    return [3, ["r", "r", "f"], "right"];
                } else if (nodeOne.direction === "down") {
                    return [2, ["l", "f"], "right"];
                }
            }
        }

        function manhattanDistance(nodeOne, nodeTwo) {
            let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
            let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
            let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
            let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
            return (xChange + yChange);
        }

        function weightedManhattanDistance(nodeOne, nodeTwo, nodes) {
            let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
            let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
            let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
            let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);

            if (nodeOneCoordinates[0] < nodeTwoCoordinates[0] && nodeOneCoordinates[1] < nodeTwoCoordinates[1]) {
                let additionalxChange = 0,
                    additionalyChange = 0;
                for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
                    let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }
                for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
                    let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }

                let otherAdditionalxChange = 0,
                    otherAdditionalyChange = 0;
                for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
                    let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }
                for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
                    let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }

                if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
                    xChange += additionalxChange;
                    yChange += additionalyChange;
                } else {
                    xChange += otherAdditionalxChange;
                    yChange += otherAdditionalyChange;
                }
            } else if (nodeOneCoordinates[0] < nodeTwoCoordinates[0] && nodeOneCoordinates[1] >= nodeTwoCoordinates[1]) {
                let additionalxChange = 0,
                    additionalyChange = 0;
                for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
                    let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }
                for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
                    let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }

                let otherAdditionalxChange = 0,
                    otherAdditionalyChange = 0;
                for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
                    let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }
                for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
                    let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }

                if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
                    xChange += additionalxChange;
                    yChange += additionalyChange;
                } else {
                    xChange += otherAdditionalxChange;
                    yChange += otherAdditionalyChange;
                }
            } else if (nodeOneCoordinates[0] >= nodeTwoCoordinates[0] && nodeOneCoordinates[1] < nodeTwoCoordinates[1]) {
                let additionalxChange = 0,
                    additionalyChange = 0;
                for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
                    let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }
                for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
                    let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }

                let otherAdditionalxChange = 0,
                    otherAdditionalyChange = 0;
                for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
                    let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }
                for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
                    let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }

                if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
                    xChange += additionalxChange;
                    yChange += additionalyChange;
                } else {
                    xChange += otherAdditionalxChange;
                    yChange += otherAdditionalyChange;
                }
            } else if (nodeOneCoordinates[0] >= nodeTwoCoordinates[0] && nodeOneCoordinates[1] >= nodeTwoCoordinates[1]) {
                let additionalxChange = 0,
                    additionalyChange = 0;
                for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
                    let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }
                for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
                    let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }

                let otherAdditionalxChange = 0,
                    otherAdditionalyChange = 0;
                for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
                    let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
                    let currentNode = nodes[currentId];
                    additionalyChange += currentNode.weight;
                }
                for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
                    let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
                    let currentNode = nodes[currentId];
                    additionalxChange += currentNode.weight;
                }

                if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
                    xChange += additionalxChange;
                    yChange += additionalyChange;
                } else {
                    xChange += otherAdditionalxChange;
                    yChange += otherAdditionalyChange;
                }
            }

            return xChange + yChange;


        }

        module.exports = weightedSearchAlgorithm;

    }, { "./astar": 13 }]
}, {}, [4]);