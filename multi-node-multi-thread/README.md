### Multi-Node Multithreaded Dijkstra Algorithm
##### Professor: Rob Marano

This directory consists of multi-node multithreaded Dijkstra Algorithm using Java and Maven

#### Introduction
Dijkstra's Algorithm is a graph greedy algorithm that finds the shortest paths between nodes in a directed graph given the source node and the non-negative cost for each edge. [More about Dijkstra's Algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

#### Complexities
The single-thread DijkstraAlgorithm itself has a time complexity of O(v<sup>2</sup> + e), a space complexity of O(v) where v is the number of vertices (nodes) and e is the number of edges in the input graph.

#### Construction of the Algorithm
This algorithm is similar to the single-node multithreaded algorithm, except the number of available nodes (referred to as cores to avoid confusion with graph nodes) can be specified. No more threads than the specified number of cores can be spawned at one time by the main(). Once that numbers of threads has been spawned, main() will wait for the threads to finish. Each thread is allocated to one core, and these threads in turn spawn their own threads for adjacent nodes. In this way, each core performs multithreading. Once all the threads in all the threads finish, main() will spawn more threads for each core, until the algorithm is complete. 
Currently, we are running this algorithm on just one computer, but it is ready to be implemented on a platform with actual multiple CPUs.

#### Test Cases
The numbers in the input file names show how much graph nodes those test cases have. Each test case has 50% graph node density. Each test was run with 4 cores.  
To run a test with an existing input file: java -jar ./target/multi-node-multi-thread-0.0.1.jar {number of cores} {input file name}  
To run a test by creating a new graph: java -jar ./target/multi-node-multi-thread-0.0.1.jar {number of cores} {number of graph nodes} {graph node density (50 = 50%)}



#### Runtimes
6 nodes: 6 ms  
20 nodes: 10 ms  
50 nodes: 18 ms  
100 nodes: 28 ms  
200 nodes: 45 ms  
300 nodes: 70 ms  
500 nodes: 110 ms  
700 nodes: 152 ms  
1000 nodes: 238 ms  

#### Time Complexity
Previously, we improved the time complexity of the single-node algorithm to close to O(v). This multi-node algorithm has slightly faster run times, but still looks like O(v).

#### Revision 2
Revision 1 involved no sockets and no sending of data, purely shared memory. That is why it ran so fast. However, in distributed systems, nodes are completely separate and must share data via the Internet. In revision 2, we made use of Java sockets to truly implement multi-node computation. However, due to the time needed to transmit data between processes, the run time has slowed down considerably. The time complexity is still close to O(v).

#### Algorithm
The algorithm of our multi-node-multi-thread is similar to single-node, with the addition of a supervisor that is in charge of the consistent sharing of data between each node. The supervisor node, called the Manager, receives the polls from the local priority queues of the individual subordinate nodes. Each individual node runs the single-node algorithm but regularly polls the head local priority queue into the Java socket so that the Manager can sort the local minimum distance vertices from each sub-node. This creates a "global priority queue" which each sub-node regularly gets data from. Currently, our algorithm still has room for improvement in terms of work division between nodes. Each node still has large amounts of overlapping work, and our attempts to decrease the overlap have lead to inaccurate algorithm results. Additionally, there is a terrifyingly long setup time for each sub-node, since the Manager node must send an entire graph over to each sub-node. For large graphs with 1000 vertices, just sending these over at the setup of a sub-node takes up to 10 seconds. The runtimes shown below are those excluding initial setup time.
#### Runtimes:
10 vertices: 20 ms (4 nodes)
100 vertices: 150 ms (4 nodes)
1000 vertices: 1900 ms (4 nodes)