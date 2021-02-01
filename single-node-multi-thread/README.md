### Single-Node Multithreaded Dijkstra Algorithm
##### Professor: Rob Marano

This directory consists of single-node multithreaded Dijkstra Algorithm using Java and Maven

#### Introduction
Dijkstra's Algorithm is a graph greedy algorithm that finds the shortest paths between nodes in a directed graph, given the source node and the non-negative cost for each edges. [More about Dikstra's Algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

#### Complexities
The Algorithm itself has a time complexity of O(v<sup>2</sup> + e), a space complexity of O(v) where v is the number of vertices (nodes) and e is th number of edges in the input graph.

#### Construction of the Algorithm
* Graph Representation
Graph can be represented using an adjacency matrix of size of the product of the total number of vertices and the total number of edges. The [Node](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/src/main/java/graphModel/Node.java) is constructed so that it records the shortest distance of the node from the source node and its order (the number of the node).  The [Graph](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/src/main/java/graphModel/Graph.java) is constructed so that it contains the source node, the total number of nodes, and all the edges in a graph. The [util](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/tree/main/single-node-multi-thread/src/main/java/util)folder consists of programs that read a given graph or generate a graph from scratch with desired edge density. Graph implementations are taken from [Graph Construction](https://github.com/MireaRadu/parallel-dijkstra-multithreading/tree/master/src/model)
* Multi-threaded Algorithm and Concurrency
A single-threaded Dijkstra's algorithm necessarily traverses all possible paths through a graph in order to find the shortest distance to each node in the graph from a sourch node. Using multi-threading, multiple threads can traverse multiple paths concurrently and update the distances of each node concurrently, as opposed to the sequential traversal of a single-threaded algorithm.  
In order for multi-threading to work, certain data structures must be shared among all threads. The list of all nodes must be shared so that any thread can get and set the shortest distance of each node when required, and the updates would be automatically shared to the other threads. A simple non-blocking concurrency algorithm (Atomic compare and set While-Loop) is used to ensure distance is set properly. The graph must be shared so that each thread knows the edge weights of each node. To make the greedy algorithm faster for each thread, the graph is processed before any threads are created such that the adjacent nodes of each node are sorted according to edge weight and arranged in a 2-dimensional list. Thie sorted edge list is also shared among all threads.  
At the start of the algorithm, all node distances are infinity except for the source node, which has 0. The graph is processed, and the sorted edge list is used to determine the order in which to create threads. Starting from the closest adjacent node (lowest edge weight), a thread is created, and following one thread is create for each adjacent node. In addition to all the shared data structures, each thread takes in a list parameter called path, which contains the nodes that have been traversed by the thread, and an integer parameter called costSoFar, which contains the sum of all the edge weights traversed by the thread. For the very first thread, path would be {source node, closest adjacent node}, and costSoFar would equal the weight of the connecting edge to the closest adjacent node. The main thread which creates all the threads then waits for all the threads to finish.  
Each thread then updates the node distances of the node it is currently on (if costSoFar is less than the current node distance) and determines which adjacent nodes to go to. For each adjacent node that isn't already in the path and has a node distance larger than the combined cost of the edge weight and costSoFar, a new thread is created with an updated path and updated costSoFar. The thread makes the decision for each adjacent node starting from the closest adjacent node (using the sorted edge list), adhering to the greedy behavior of Dijkstras. After all adjacent nodes have been considered, this thread will wait for all its children thread to finish running before finishing itself.  
This process repeats until eventually there will be no more nodes to go to, since all paths will have been traversed and the shortest distance to each node will have been found. After all threads finish running, the main thread will simply look at each node in the list of all nodes and get the shortest distance.

#### Test Cases:
* Small directed graph with 6 nodes and 50% edge density (15 edges total)
[input](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/input6.txt) & [output](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/output6.txt)
* Medium directed graph with 20 nodes and 50% edge density (190 edges total)
[input](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/input20.txt) & [output](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/output20.txt)
* Big directed graph with 50 nodes and 50% edge density (1225 edges total)
[input](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/input50.txt) & [output](https://github.com/CrystalWang1225/ECE465-Cloud-Computing/blob/main/single-node-multi-thread/input50.txt)

#### Run Time
* Small: 2 ms
* Medium: 16 ms
* Big: 47 ms


