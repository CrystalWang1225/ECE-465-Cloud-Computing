/*Main2*/
import java.util.ArrayList;
import java.util.List;
import graphModel.*;
import multithread.*;
import util.*;
import validation.*;
import java.util.concurrent.PriorityBlockingQueue;

import java.time.Duration;
import java.time.Instant;

class SubMain {

    private static String inputFile, outputFile;
    public static void main(String[] args){
        Graph graph;
        try {
            int numThreads = Integer.parseInt(args[0]); //This should be equal to how many cores this node has
            inputFile = args[1];
            graph = IOUtils.readGraph(inputFile);
            int portNum = Integer.parseInt(args[2]);
            setupClient(portNum);
            List<Integer> results = runDijkstra(graph, numThreads);
        } catch (InvalidDataException e) {
            System.out.println(e.getMessage());
        } catch (NumberFormatException e) {
            e.printStackTrace();
            System.out.println("Invalid command format");
        }
    }

    private static void setupClient(int portNum){

    }

    private static List<Integer> runDijkstra(Graph graph, int numThreads){
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
                if(coreCount == numThreads) { //Don't spawn more threads than cores
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
                    Thread thread = new Thread(new ManagerThread(currentNode,
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


