package multithread;

import graphModel.*;
import messages.GlobalMinNode;
import messages.SetupData;
import java.io.*;
import java.net.Socket;
import java.net.ServerSocket;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

public class ManagerThread implements Runnable {
   private Graph graph;
   private CyclicBarrier cyclicBarrier;
   private PriorityBlockingQueue<GlobalMinNode> globalMinNodes;
   private int startNode;
   private int endNode;
   private int portNumber;
   private Node current;
   private AtomicBoolean isFinished;
   private AtomicInteger finishedThreads;
   private List<Integer> visited;

   public ManagerThread(Graph graph, int startNode,
                        int endNode, CyclicBarrier cyclicBarrier,
                        PriorityBlockingQueue<GlobalMinNode> globalMinNodes,
                        int portNumber, Node current, AtomicBoolean isFinished,
                        AtomicInteger finishedThreads, List<Integer> visited){
       this.graph = graph;
       this.startNode = startNode;
       this.endNode = endNode;
       this.globalMinNodes = globalMinNodes;
       this.cyclicBarrier = cyclicBarrier;
       this.portNumber = portNumber;
       this.current = current;
       this.isFinished = isFinished;
       this.finishedThreads = finishedThreads;
       this.visited = visited;
   }

   @Override
    public void run(){
       try(ServerSocket serverSocket = new ServerSocket(portNumber)){
           System.out.println("Connecting to " + portNumber);
           Socket socket = serverSocket.accept();

           //Setting up the w/r with a client
           ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
           ObjectInputStream objectInputStream = new ObjectInputStream(socket.getInputStream());

           objectOutputStream.writeObject(new SetupData(graph, startNode, endNode));
           objectOutputStream.reset();

           while (true) {
               GlobalMinNode response = (GlobalMinNode) objectInputStream.readObject();
               if(response.getNode() >= 0 && response.getDistance()<visited.get(response.getNode())) {
                   visited.set(response.getNode(), response.getDistance());
                   globalMinNodes.put(response);
               }
               else if(response.getNode() == -1){
                   break;
               }

               try {
                   cyclicBarrier.await();
               }
               catch(BrokenBarrierException e){
                   e.printStackTrace();
               }
               if(!isFinished.get()) {
                   GlobalMinNode toSend = new GlobalMinNode(current.getNode(), current.getDistance());
                   objectOutputStream.writeObject(toSend);
                   objectOutputStream.reset();
               }
           }
           objectOutputStream.writeObject(new GlobalMinNode(-1, -1));
           objectOutputStream.reset();
           ArrayList<Integer> fromWorker = (ArrayList<Integer>) objectInputStream.readObject();
           for (int i = startNode; i < endNode; i++){
               visited.set(i,fromWorker.get(i));
           }
           boolean casFinished = false;
           while(!casFinished){
               casFinished = finishedThreads.compareAndSet(finishedThreads.get(),finishedThreads.get()+1);
           }
           while(!isFinished.get()){
               try {
                   cyclicBarrier.await();
               }
               catch(BrokenBarrierException e){
                   e.printStackTrace();
               }
           }
           socket.close();

       } catch (IOException | InterruptedException | ClassNotFoundException e){
           e.printStackTrace();
       }
   }

}
