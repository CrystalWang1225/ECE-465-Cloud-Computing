/*Main*/
import java.io.IOException;
import java.net.*;
import java.util.ArrayList;
import java.util.List;
import graphModel.*;
import multithread.*;
import util.*;
import validation.*;
import java.util.concurrent.PriorityBlockingQueue;

import java.time.Duration;
import java.time.Instant;

class SuperMain {

    private static String inputFile, outputFile;
    public static void main(String[] args){ //number of cores, number of nodes, edge density, port numbers
        Graph graph;
        try {
            int numCores = Integer.parseInt(args[0]);
            int portList[] = new int[numCores];
            if (args.length > 2 + numCores) { //with graph generation
                inputFile = "input" + args[1] + ".txt";
                graph = GraphUtils.generateGraphMatrix(Integer.parseInt(args[1]), Integer.parseInt(args[2]));
                IOUtils.writeGraph(inputFile, graph);
                for (int i = 0; i < numCores; i++){
                    portList[i] = Integer.parseInt(args[3 + i]);
                }
            } else {
                inputFile = args[1];
                graph = IOUtils.readGraph(inputFile);
                for (int i = 0; i < numCores; i++){
                    portList[i] = Integer.parseInt(args[2 + i]);
                }
            }
            outputFile = "output" + inputFile.substring(5);
            Instant start = Instant.now(); //for execution time
            List<Integer> results = runDijkstra(graph, numCores);
            Instant finish = Instant.now();
            long timeElapsed = Duration.between(start, finish).toMillis();
            IOUtils.writeResults(outputFile, results, timeElapsed);
        } catch (InvalidDataException e) {
            System.out.println(e.getMessage());
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }
    }

    private static List<Integer> runDijkstra(Graph graph, int numCores){
        ArrayList<Node> nodeList = new ArrayList<Node>();
        ArrayList<Integer> visited = new ArrayList<>();
        //Initialize list of nodes and sort edges for each node
        for (int i = 0; i < graph.getNumberOfNodes(); i++){
            if(i == 0){
                nodeList.add(new Node(i,0));
            }
            else{
                nodeList.add(new Node(i,Integer.MAX_VALUE));
            }
            //minimum distance for visited nodes, nodes visited multiple times
            visited.add(Integer.MAX_VALUE);
        }
        PriorityBlockingQueue<Node> nodeQ = new PriorityBlockingQueue<Node>();
        nodeQ.offer(nodeList.get(0));
        ArrayList<Thread> threads = new ArrayList<Thread>();
        int coreCount = 0;
        while(!nodeQ.isEmpty()){
            Node currentNode = nodeQ.poll();
            if(currentNode.getDistance() >= visited.get(currentNode.getNode())){
                //No need to reevaluate distance of nodes adjacent to node i is visited[i] is less
                continue;
            }
            else{
                visited.set(currentNode.getNode(), currentNode.getDistance());
            }
            for(int i = 0; i < graph.getNumberOfNodes(); i++) {
                if(coreCount == numCores) { //Wait for each core to finish multithreading
                    for (int j = 0; j < threads.size(); j++) {
                        try {
                            threads.get(j).join();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    coreCount = 0;
                }
                Node nextNode = nodeList.get(i);
                if(graph.getEdges().get(currentNode.getNode()).get(i) <= 0) continue; //no edge
                // check and update distance if needed
                if(currentNode.getDistance() +
                        graph.getEdges().get(currentNode.getNode()).get(nextNode.getNode())
                        < nextNode.getDistance()){
                    nextNode.casDistance(nextNode.getDistance(),
                            currentNode.getDistance() +
                                    graph.getEdges().get(currentNode.getNode()).get(nextNode.getNode()));
                    visited.set(nextNode.getNode(), nextNode.getDistance());
                    Thread thread = new Thread(new SuperThread(currentNode,
                            nextNode,
                            graph,
                            nodeList,
                            nodeQ));
                    thread.start();
                    threads.add(thread);
                    coreCount++;
                }
            }
            for (int j = 0; j < threads.size(); j++) {
                try {
                    threads.get(j).join();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            coreCount = 0;
        }
        List<Integer> results = new ArrayList<Integer>();
        for (int i = 0; i < graph.getNumberOfNodes(); i++){
            results.add(nodeList.get(i).getDistance());
        }
        return results;
    }
    private static ArrayList<Integer> sortEdges(List<Integer> edges){
        int minIndex = -1;
        int min = 0;
        ArrayList<Integer> sorted = new ArrayList<Integer>();
        while(min != Integer.MAX_VALUE) {
            min = Integer.MAX_VALUE;
            minIndex = -1;
            for (int i = 0; i < edges.size(); i++) {
                if (edges.get(i) > 0 && !sorted.contains(i)) {
                    if (edges.get(i) < min) {
                        min = edges.get(i);
                        minIndex = i;
                    }
                }
            }
            if (minIndex != -1) sorted.add(minIndex);
        }
        return sorted;
    }
}


