/*Main*/
import java.util.ArrayList;
import java.util.List;
import graphModel.*;
import multithread.*;
import util.*;
import validation.*;
import java.util.concurrent.PriorityBlockingQueue;

import java.time.Duration;
import java.time.Instant;

class Main{

    private static final String INPUT_FILE = "D:/Documents/ECE465-Cloud-Computing/single-node-multi-thread/input6.txt";
    public static void main(String[] args){
        Graph graph;
        try {
            graph = IOUtils.readGraph(INPUT_FILE);
            Instant start = Instant.now();
            List<Integer> results = runDijkstra(graph);
            Instant finish = Instant.now();
            long timeElapsed = Duration.between(start, finish).toMillis();
            IOUtils.writeResults("output6.txt", results, timeElapsed);
        } catch (InvalidDataException e) {
            System.out.println(e.getMessage());
        }
    }

    private static List<Integer> runDijkstra(Graph graph){
        ArrayList<Node> nodeList = new ArrayList<Node>();
        ArrayList<ArrayList<Integer>> sortedEdges = new ArrayList<ArrayList<Integer>>();
        ArrayList<Integer> visited = new ArrayList<>();
        //Initialize list of nodes and sort edges for each node
        for (int i = 0; i < graph.getNumberOfNodes(); i++){
            if(i == 0){
                nodeList.add(new Node(i,0));
            }
            else{
                nodeList.add(new Node(i,Integer.MAX_VALUE));
            }
            sortedEdges.add(sortEdges(graph.getEdges().get(i)));
            visited.add(Integer.MAX_VALUE);
        }
        PriorityBlockingQueue<Node> nodeQ = new PriorityBlockingQueue<Node>();
        nodeQ.offer(nodeList.get(0));
        ArrayList<Thread> threads = new ArrayList<Thread>();
        while(!nodeQ.isEmpty()){
            Node currentNode = nodeQ.poll();
            if(currentNode.getDistance() >= visited.get(currentNode.getNode())){
                continue;
            }
            else{
                visited.set(currentNode.getNode(), currentNode.getDistance());
            }
            for(int i = 0; i < sortedEdges.get(currentNode.getNode()).size(); i++) {
                Node nextNode = nodeList.get(sortedEdges.get(currentNode.getNode()).get(i));

                // check and update distance if needed
                if(currentNode.getDistance() +
                        graph.getEdges().get(currentNode.getNode()).get(nextNode.getNode())
                        < nextNode.getDistance()){
                   nextNode.casDistance(nextNode.getDistance(),
                            currentNode.getDistance() +
                                    graph.getEdges().get(currentNode.getNode()).get(nextNode.getNode()));
                }
                visited.set(nextNode.getNode(), nextNode.getDistance());
                Thread thread = new Thread(new Dthread(currentNode,
                        nextNode,
                        graph,
                        sortedEdges,
                        nodeList,
                        nodeQ));
                thread.start();
                threads.add(thread);
            }
            for (int i = 0; i < threads.size(); i++) {
                try {
                    threads.get(i).join();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
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


