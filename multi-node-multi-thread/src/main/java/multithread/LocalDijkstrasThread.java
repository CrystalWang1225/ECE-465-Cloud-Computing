package multithread;

import graphModel.Graph;
import graphModel.Node;

import java.util.ArrayList;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;

public class LocalDijkstrasThread implements Runnable{
    private Graph graph;
    private int firstNode, lastNode;
    private Node currentNode;
    private ArrayList<Node> nodeList;
    private PriorityBlockingQueue<Node> localQ;

    public LocalDijkstrasThread(Graph graph, int firstNode, int lastNode,
                          Node currentNode, ArrayList<Node> nodeList,
                          PriorityBlockingQueue<Node> localQ, AtomicBoolean queueEmpty,
                          CyclicBarrier barrier){
        this.graph = graph;
        this.firstNode = firstNode;
        this.lastNode = lastNode;
        this.currentNode = currentNode;
        this.nodeList = nodeList;
        this.localQ = localQ;
    }

    @Override
    public void run() {
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
                localQ.put(nextNode);
            }
        }
    }
}
