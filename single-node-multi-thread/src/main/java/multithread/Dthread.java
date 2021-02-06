package multithread;

import graphModel.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.PriorityBlockingQueue;

public class Dthread implements Runnable {
    private Node prevNode;
    private Node currentNode;
    private Graph graph;
    private ArrayList<Node> nodeList;
    private PriorityBlockingQueue<Node> nodeQ;
    public Dthread(Node prevNode, Node currentNode, Graph graph,
                   ArrayList<Node> nodeList, PriorityBlockingQueue<Node> nodeQ){
        this.prevNode = prevNode;
        this.currentNode = currentNode;
        this.graph = graph;
        this.nodeList = nodeList;
        this.nodeQ = nodeQ;
    }
    public void run(){
        int nodeID = currentNode.getNode();
        for(int i = 0; i < graph.getNumberOfNodes(); i++){ // loops through available edges in ascending cost
            Node nextNode = nodeList.get(i);
            if(graph.getEdges().get(currentNode.getNode()).get(i) <= 0) continue;
            int nextID = nextNode.getNode();
            boolean casFinished = false;
            // check and update distance if needed
            while(!casFinished){
                if(currentNode.getDistance() +
                        graph.getEdges().get(nodeID).get(nextID)
                        < nextNode.getDistance()){
                    casFinished = nextNode.casDistance(nextNode.getDistance(),
                            currentNode.getDistance() +
                            graph.getEdges().get(nodeID).get(nextID));
                }
                else{
                    break;
                }
            }
            if(casFinished){
                nodeQ.put(nextNode);
            }
        }
    }
}
