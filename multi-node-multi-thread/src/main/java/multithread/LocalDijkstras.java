package multithread;

import graphModel.*;
import java.net.Socket;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;
import java.io.*;
import java.util.ArrayList;

public class LocalDijkstras {
    private Graph graph;
    private int firstNode, lastNode;
    private Node currentNode;
    private ArrayList<Node> nodeList;
    private PriorityBlockingQueue<Node> localQ;
    private AtomicBoolean queueEmpty;
    private CyclicBarrier barrier;
    private int port;

    public LocalDijkstras(int port){
        this.port = port;
    }

    public void setup(int numCores){
        System.out.println("Setting up LocalDijkstras on port " + port);
        try{
            Socket client = new Socket("localhost", port);
            System.out.println("LocalDijkstras client established connection with port " + port);
            ObjectInputStream clientInput = new ObjectInputStream(client.getInputStream());
            ObjectOutputStream clientOutput = new ObjectOutputStream(client.getOutputStream());
        }
        catch(IOException e){
            e.printStackTrace();
        }
    }

}
