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
    private AtomicBoolean queueEmpty;
    private CyclicBarrier barrier;

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
        this.queueEmpty = queueEmpty;
        this.barrier = barrier;
    }

    @Override
    public void run() {

    }
}
