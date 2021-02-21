package multinodeModel;

import graphModel.*;
import messages.*;
import multithread.ManagerThread;

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
    private ArrayList<Integer> visited;
    private PriorityBlockingQueue<Node> localQ;
    private AtomicBoolean queueEmpty;
    private CyclicBarrier barrier;
    private int port;
    private int numCores;
    private int coreCount;
    private ArrayList<Thread> threads;

    public LocalDijkstras(int port, int numCores){
        this.port = port;
        this.numCores = numCores;
    }

    public void runDijkstras(){
        threads = new ArrayList<Thread>();
        coreCount = 0;
        while(!localQ.isEmpty()){
            Node currentNode = localQ.poll();
            if(currentNode.getDistance() >= visited.get(currentNode.getNode())){
                //No need to reevaluate distance of nodes adjacent to node i if visited[i] is less
                continue;
            }
            else{
                visited.set(currentNode.getNode(), currentNode.getDistance());
            }
            for(int i = 0; i < graph.getNumberOfNodes(); i++) {
                if(coreCount == numCores) { //Don't spawn more threads than cores available
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
                            localQ));
                    thread.start();
                    threads.add(thread);
                    coreCount++;
                }
            }
            for (int j = 0; j < threads.size(); j++) { //wait for last group of threads to finish
                try {
                    threads.get(j).join();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            coreCount = 0;
        }

    }

    public void setup(int numCores){
        System.out.println("Setting up LocalDijkstras on port " + port);
        try{
            Socket client = new Socket("localhost", port);
            System.out.println("LocalDijkstras client established connection with port " + port);
            ObjectInputStream clientInput = new ObjectInputStream(client.getInputStream());
            ObjectOutputStream clientOutput = new ObjectOutputStream(client.getOutputStream());
            SetupData setupdata = (SetupData)clientInput.readObject();
            this.graph = setupdata.getGraph();
            this.firstNode = setupdata.getFirstNode();
            this.lastNode = setupdata.getLastNode();
            this.queueEmpty = new AtomicBoolean(false);
            this.localQ = new PriorityBlockingQueue<Node>;
            this.visited = new ArrayList<Integer>();
            this.nodeList = new ArrayList<Node>();
            for (int i = 0; i < graph.getNumberOfNodes(); i++){//initialize nodeList, visited, and localQ
                if(i == 0){
                    nodeList.add(new Node(i,0));
                }
                else{
                    nodeList.add(new Node(i,Integer.MAX_VALUE));
                }
                //minimum distance for visited nodes, nodes visited multiple times
                visited.add(Integer.MAX_VALUE);
            }
            localQ.offer(nodeList.get(0));
            System.out.println("Setup on port " + port + " is done.");
        }
        catch(IOException | ClassNotFoundException e){
            e.printStackTrace();
        }
    }

    public static class updateLocalMin{
        public updateLocalMin(){

        }
    }

}
