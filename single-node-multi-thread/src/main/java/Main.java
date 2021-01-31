
import java.util.ArrayList;
import java.util.List;
import graphModel.*;
import multithread.*;
import util.*;
import validation.*;

import java.time.Duration;
import java.time.Instant;

class Main{

    private static final String INPUT_FILE = "D:/Documents/ECE465-Cloud-Computing/single-node-multi-thread/input.txt";
    public static void main(String[] args){
        Graph graph;
        try {
            graph = IOUtils.readGraph(INPUT_FILE);
            Instant start = Instant.now();
            List<Integer> results = runDijkstra(graph);
            Instant finish = Instant.now();
            long timeElapsed = Duration.between(start, finish).toMillis();
            System.out.println(timeElapsed);
            IOUtils.writeResults("output.txt", results);
        } catch (InvalidDataException e) {
            System.out.println(e.getMessage());
        }
    }

    private static List<Integer> runDijkstra(Graph graph){
        ArrayList<Node> nodeList = new ArrayList<Node>();
        nodeList.add(new Node(0,0));
        for (int i = 1; i < graph.getNumberOfNodes(); i++){
            nodeList.add(new Node(i,Integer.MAX_VALUE));
        }
        ArrayList<Integer> path = new ArrayList<Integer>();
        path.add(0);
        Thread thread = new Thread(new Dthread(nodeList.get(0),
                graph,
                path,
                0,
                nodeList));
        thread.start();
        try {
            thread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        List<Integer> results = new ArrayList<Integer>();
        for (int i = 0; i < graph.getNumberOfNodes(); i++){
            results.add(nodeList.get(i).getDistance());
        }
        return results;
    }
}


