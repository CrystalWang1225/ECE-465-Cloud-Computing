package multinodeModel;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.PriorityBlockingQueue;

import graphModel.*;
import multithread.ManagerThread;

public class Manager {
    private Graph graph;
    private PriorityBlockingQueue<Node> globalQ = new PriorityBlockingQueue<Node>();
    private List<Thread> threadList = new ArrayList<>();

    public List<Integer> multiDijk(Graph graph, int numCores, int[] portList){
        this.graph = graph;
        CyclicBarrier cyclicBarrier = new CyclicBarrier();
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
            Thread eachThread = new ManagerThread();
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
        return new ArrayList<>();
    }
}
