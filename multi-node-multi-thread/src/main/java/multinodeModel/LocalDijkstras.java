package multinodeModel;

import graphModel.*;
import messages.*;
import multithread.LocalDijkstrasThread;

import java.awt.image.AreaAveragingScaleFilter;
import java.net.Socket;
import java.util.concurrent.PriorityBlockingQueue;
import java.io.*;
import java.util.ArrayList;

public class LocalDijkstras {
    private Graph graph;
    private int firstNode, lastNode;
    private Node currentNode;
    private ArrayList<Node> nodeList;
    private ArrayList<Integer> visited;
    private PriorityBlockingQueue<Node> localQ;
    private int port;
    private int numThreads;
    private Node localMin;
    private ObjectOutputStream clientOutput;
    private ObjectInputStream clientInput;
    private Socket client;

    public LocalDijkstras(int port, int numThreads){
        this.port = port;
        this.numThreads = numThreads;
    }

    private void queueEmptyRoutine(){
        if (localQ.isEmpty()) {
            System.out.println("LocalQ Empty");
            System.out.println("localMin number: "+localMin.getNode()+" localMin distance: "+localMin.getDistance());
            GlobalMinNode sendMin = new GlobalMinNode(localMin.getNode(), localMin.getDistance());
            try {
                clientOutput.writeObject(sendMin);
                clientOutput.reset();
                GlobalMinNode newMin = (GlobalMinNode) clientInput.readObject();
                System.out.println("New Min number: "+newMin.getNode()+" New Min distance: "+newMin.getDistance());
                if (newMin.getNode() >= 0) {
                    nodeList.get(newMin.getNode()).setDistance(newMin.getDistance());
                    localQ.offer(nodeList.get(newMin.getNode()));
                    localMin = new Node(-1, Integer.MAX_VALUE); //reset local min for next round
                }
            } catch (IOException | ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
    }

    public void runDijkstras(){
        ArrayList<Thread> threads = new ArrayList<Thread>();
        int coreCount = 0;
        while(!localQ.isEmpty()) {
            currentNode = localQ.poll();
            GlobalMinNode sendMin = new GlobalMinNode(currentNode.getNode(), currentNode.getDistance());
            System.out.println("sendMin number: "+sendMin.getNode()+" sendMin distance: "+sendMin.getDistance());
            if(sendMin.getNode() > 0) {
                try {
                    clientOutput.writeObject(sendMin);
                    clientOutput.reset();
                    GlobalMinNode newMin = (GlobalMinNode) clientInput.readObject();
                    System.out.println("New Min number: " + newMin.getNode() + " New Min distance: " + newMin.getDistance());
                    if (newMin.getNode() >= 0) {
                        nodeList.get(newMin.getNode()).setDistance(newMin.getDistance());
                        localQ.offer(nodeList.get(newMin.getNode()));
                    }
                } catch (IOException | ClassNotFoundException e) {
                    e.printStackTrace();
                }
            }
            //if(currentNode.getNode() < lastNode && currentNode.getNode() >= firstNode) {
                if (currentNode.getDistance() >= visited.get(currentNode.getNode())) {
                    //No need to reevaluate distance of nodes adjacent to node i if visited[i] is less
                    //queueEmptyRoutine();
                    continue;
                } else {
                    visited.set(currentNode.getNode(), currentNode.getDistance());
                    if (currentNode.getDistance() < localMin.getDistance()) {
                        localMin = currentNode;
                    }
                }
            //}
            for (int i = firstNode; i < lastNode; i++) {
                if (coreCount == numThreads) { //Don't spawn more threads than cores available
                    for (int j = 0; j < threads.size(); j++) {
                        try {
                            threads.get(j).join();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    threads.clear();
                    coreCount = 0;
                }
                Node nextNode = nodeList.get(i);
                if (graph.getEdges().get(currentNode.getNode()).get(i) <= 0){  //no edge
                    continue;
                }
                // check and update distance if needed
                if (currentNode.getDistance() +
                        graph.getEdges().get(currentNode.getNode()).get(nextNode.getNode())
                        < nextNode.getDistance()) {
                    nextNode.casDistance(nextNode.getDistance(),
                            currentNode.getDistance() +
                                    graph.getEdges().get(currentNode.getNode()).get(nextNode.getNode()));
                    visited.set(nextNode.getNode(), nextNode.getDistance());
                    Thread thread = new Thread(new LocalDijkstrasThread(graph, firstNode, lastNode,
                            currentNode, nodeList, localQ));
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
            threads.clear();
            coreCount = 0;
            //If localQ is now empty, send local minimum to Manager, wait for new global minimum to begin from
            //queueEmptyRoutine();
        }
        try {
            System.out.println("All done");
            ArrayList<Integer> distances = new ArrayList<>();
            for(int i = firstNode; i < lastNode; i++){
                distances.add(visited.get(i));
            }
            clientOutput.writeObject(visited);
            clientOutput.reset();
            client.close();
        }
        catch (IOException e){
            e.printStackTrace();
        }
    }

    public void setup(){
        System.out.println("Setting up LocalDijkstras on port " + port);
        try{
            client = new Socket("localhost", port);
            System.out.println("LocalDijkstras client established connection with port " + port);
            clientInput = new ObjectInputStream(client.getInputStream());
            clientOutput = new ObjectOutputStream(client.getOutputStream());
            SetupData setupdata = (SetupData)clientInput.readObject();
            this.graph = setupdata.getGraph();
            this.firstNode = setupdata.getFirstNode();
            this.lastNode = setupdata.getLastNode();
            this.localQ = new PriorityBlockingQueue<Node>();
            this.visited = new ArrayList<Integer>();
            this.nodeList = new ArrayList<Node>();
            for (int i = 0; i < graph.getNumberOfNodes(); i++){//initialize nodeList, visited, and localQ
                if(i == 0){
                    nodeList.add(new Node(0, 0));
                }
                else {
                    nodeList.add(new Node(i, Integer.MAX_VALUE));
                    //minimum distance for visited nodes, nodes visited multiple times
                }
                visited.add(Integer.MAX_VALUE);
            }
            localMin = new Node(-1, Integer.MAX_VALUE);
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
