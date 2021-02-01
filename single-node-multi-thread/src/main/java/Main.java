/*Main*/
import java.util.ArrayList;
import java.util.List;
import graphModel.*;
import multithread.*;
import util.*;
import validation.*;

import java.time.Duration;
import java.time.Instant;

class Main{

    private static final String INPUT_FILE = "D:/Documents/ECE465-Cloud-Computing/single-node-multi-thread/input50.txt";
    public static void main(String[] args){
        Graph graph;
        try {
            graph = IOUtils.readGraph(INPUT_FILE);
            Instant start = Instant.now();
            List<Integer> results = runDijkstra(graph);
            Instant finish = Instant.now();
            long timeElapsed = Duration.between(start, finish).toMillis();
            IOUtils.writeResults("output50.txt", results, timeElapsed);
        } catch (InvalidDataException e) {
            System.out.println(e.getMessage());
        }
    }

    private static List<Integer> runDijkstra(Graph graph){
        ArrayList<Node> nodeList = new ArrayList<Node>();
        ArrayList<ArrayList<Integer>> sortedEdges = new ArrayList<ArrayList<Integer>>();
        for (int i = 0; i < graph.getNumberOfNodes(); i++){
            if(i == 0){
                nodeList.add(new Node(i,0));
            }
            else{
                nodeList.add(new Node(i,Integer.MAX_VALUE));
            }
            sortedEdges.add(sortEdges(graph.getEdges().get(i)));
        }
        ArrayList<Integer> path = new ArrayList<Integer>();
        path.add(0);
        ArrayList<Thread> threads = new ArrayList<Thread>();
        for(int i = 0; i < sortedEdges.get(0).size(); i++) {
            ArrayList<Integer> nextPath = new ArrayList<>(path);
            nextPath.add(sortedEdges.get(0).get(i));
            Thread thread = new Thread(new Dthread(nodeList.get(sortedEdges.get(0).get(i)),
                    graph,
                    sortedEdges,
                    path,
                    graph.getEdges().get(0).get(sortedEdges.get(0).get(i)),
                    nodeList));
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


