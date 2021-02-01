### Single-Node Multithreaded Dijstra Algorithm
##### Professor: Rob Marano

This directory consists of single-node multithreaded Dijkstra Algorithm using Java and Maven

#### Introduction
Dijkstra's Algorithm is a graph greedy algorithm that finds the shortest paths between nodes in a directed graph, given the source node and the non-negative cost for each edges. [More about Dikstra's Algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

#### Complexities
The Algorithm itself has a time complexity of O(v<sup>2</sup> + e), a space complexity of O(v) where v is the number of vertices and e is th number of edges in the input graph.

#### Construction of the Algorithm
* Graph Representation
Graph can be represented using an adjacency matrix of size of the product of the total number of vertices and the total number of edges. The [Node](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/src/main/java/graphModel/Node.java) is constructed so that it records the shortest distance of the node from the source node and its order.  The [Graph](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/src/main/java/graphModel/Graph.java) is constructed so that it contains the source node, and the total number of nodes, and all the edges in a graph.The[util](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/tree/main/single-node-multi-thread/src/main/java/util)folder consists of programs that read a given graph or generate a graph from scratch with desired edge density. Graph implementations are taken from [Graph Construction](https://github.com/MireaRadu/parallel-dijkstra-multithreading/tree/master/src/model)
* Concurrency
* Algorithm Construction

#### Test Cases:
* Small dataset with how many nodes
[input](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/input.txt) & [output]()
* Big dataset with how many nodes
[input](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/input.txt) & [output]()

#### Run Time


