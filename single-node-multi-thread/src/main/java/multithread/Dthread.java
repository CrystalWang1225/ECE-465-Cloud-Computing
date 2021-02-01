package multithread;

import graphModel.*;
import java.util.ArrayList;
import java.util.List;

public class Dthread implements Runnable {
    private Node currentNode;
    private Graph graph;
    private ArrayList<ArrayList<Integer>> sortedEdges;
    private ArrayList<Integer> path;
    private int costSoFar;
    private ArrayList<Node> nodeList;
    public Dthread(Node currentNode, Graph graph, ArrayList<ArrayList<Integer>> sortedEdges,
                   ArrayList<Integer> path, int costSoFar, ArrayList<Node> nodeList){
        this.currentNode = currentNode;
        this.graph = graph;
        this.sortedEdges = sortedEdges;
        this.path = path;
        this.costSoFar = costSoFar;
        this.nodeList = nodeList;
    }
    public void run(){
        int nodeID = currentNode.getNode();
        int nodeDistance;
        boolean casFinished = false;
        // check and update distance if needed
        while(!casFinished){
            nodeDistance = currentNode.getDistance();
            if(costSoFar < nodeDistance){
                casFinished = currentNode.casDistance(nodeDistance, costSoFar);
            }
            else{
                break;
            }
        }
        List<Integer> currentEdges = new ArrayList<Integer>(graph.getEdges().get(nodeID));
        ArrayList<Thread> threads = new ArrayList<Thread>();
        for(int i = 0; i < sortedEdges.get(nodeID).size(); i++){ // loops through available edges in ascending cost
            Node nextNode = nodeList.get(sortedEdges.get(nodeID).get(i));
            int costToNext = graph.getEdges().get(nodeID).get(nextNode.getNode());
            int nextCost = costSoFar + costToNext;
            if(!path.contains(nextNode.getNode())){
                //spawn a new thread for this edge
                if(nextCost < nextNode.getDistance()) { //
                    ArrayList<Integer> nextPath = new ArrayList<Integer>(path);
                    nextPath.add(nextNode.getNode());
                    Thread thread = new Thread(new Dthread(nextNode, graph, sortedEdges, nextPath, nextCost, nodeList));
                    thread.start();
                    threads.add(thread);
                }
            }
        }
        for (int i = 0; i < threads.size(); i++) {
            try {
                threads.get(i).join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
