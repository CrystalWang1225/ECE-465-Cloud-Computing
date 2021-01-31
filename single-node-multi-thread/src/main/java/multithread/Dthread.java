package multithread;

import graphModel.*;
import java.util.ArrayList;
import java.util.List;

public class Dthread implements Runnable {
    private Node currentNode;
    private Graph graph;
    private ArrayList<Integer> path;
    private int costSoFar;
    private ArrayList<Node> nodeList;
    public Dthread(Node currentNode, Graph graph, ArrayList<Integer> path, int costSoFar, ArrayList<Node> nodeList){
        this.currentNode = currentNode;
        this.graph = graph;
        this.path = path;
        this.costSoFar = costSoFar;
        this.nodeList = nodeList;
    }
    public void run(){
        System.out.println ("Thread ID: " +
                Thread.currentThread().getId());
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
        for(int i = 0; i < currentEdges.size(); i++){ // index corresponds to nodeID
            if(currentEdges.get(i)> 0){
                if(!path.contains(i)){
                    //spawn a new thread for this edge
                    Node nextNode = nodeList.get(i);
                    int nextCost = costSoFar + currentEdges.get(i);
                    if(nextCost < nextNode.getDistance()) {
                        ArrayList<Integer> nextPath = new ArrayList<Integer>(path);
                        nextPath.add(nextNode.getNode());
                        Thread thread = new Thread(new Dthread(nextNode, graph, nextPath, nextCost, nodeList));
                        thread.start();
                        threads.add(thread);
                    }
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
