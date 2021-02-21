package multinodeModel;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;

import graphModel.*;
import messages.GlobalMinNode;
import multithread.ManagerThread;

public class Manager {
    private Graph graph;
    private PriorityBlockingQueue<GlobalMinNode> globalQ = new PriorityBlockingQueue<>();
    private AtomicBoolean isFinished;
    private Node current ;
    private List<Integer> visited = new ArrayList<Integer>();
    private List<Integer> distance = new ArrayList<Integer>();

    public List<Integer> multiDijk(Graph graph, int numCores, int[] portList){
        distance = new ArrayList<Integer>(graph.getNumberOfNodes());
        //Initialize the distance to infinity for every node except source node
        for (int i = 0; i < graph.getNumberOfNodes(); i++){
            distance.add(i, Integer.MAX_VALUE);
            visited.add(Integer.MAX_VALUE);
        }
        distance.set(graph.getSourceNode(), 0);

        List<Thread> threadList = new ArrayList<>();
        isFinished = new AtomicBoolean(false);
        current = new Node(Integer.MIN_VALUE, Integer.MIN_VALUE);
        this.graph = graph;

        MinNode minNode = new MinNode( globalQ, current, isFinished, visited);
        CyclicBarrier cyclicBarrier = new CyclicBarrier(numCores, minNode);

        int start;
        int end = 0;
        //Distribution of the nodes to each cores
        int group = graph.getNumberOfNodes() / numCores ;
        int leftOver = graph.getNumberOfNodes() % numCores;
        //Each cores will get an equal chunk of data
        for (int i = 0; i < numCores; i++){
            start = end;
            end += group;
            if (leftOver >0){
                end ++;
                leftOver --;
            }
            //spawn thread
            Thread eachThread = new Thread(new ManagerThread(graph,start,
            end, cyclicBarrier,globalQ, portList[i], current, isFinished, visited));
            eachThread.start();

            threadList.add(eachThread);


        }

        for (int j = 0; j < threadList.size(); j++) {
            try {
                threadList.get(j).join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        for (int i = 0; i < visited.size(); i++){
            distance.set(i,visited.get(i));
        }
        return distance;
    }

    public static class MinNode implements Runnable{

        private PriorityBlockingQueue<GlobalMinNode> globalMinNodes;
        private AtomicBoolean isFinished;
        private List<Integer> visited;
        private Node current;
        MinNode(PriorityBlockingQueue<GlobalMinNode> globalMinNodes, Node current,
                AtomicBoolean isFinished, List<Integer> visited){
            this.globalMinNodes = globalMinNodes;
            this.current = current;
            this.isFinished = isFinished;
            this.visited = visited;
        }
        @Override
        public void run(){
            if (globalMinNodes.isEmpty()){
                isFinished.set(true);

            }else {
                GlobalMinNode newMin = globalMinNodes.poll();
                System.out.println("New Min number: "+newMin.getNode()+" New Min distance"+newMin.getDistance());
                while(newMin.getDistance() >= visited.get(newMin.getNode())){
                    if(globalMinNodes.isEmpty()) break;
                    newMin = globalMinNodes.poll();
                }
                if(newMin.getDistance() < visited.get(newMin.getNode())) {
                    visited.set(newMin.getNode(), newMin.getDistance());
                    current.setNode(newMin.getNode());
                    current.setDistance(newMin.getDistance());
                }
            }
        }
    }
}
