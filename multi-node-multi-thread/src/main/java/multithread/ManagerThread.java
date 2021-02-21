package multithread;

import graphModel.*;
import messages.GlobalMinNode;
import messages.SetupData;
import java.io.*;
import java.net.Socket;
import java.net.ServerSocket;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;

public class ManagerThread implements Runnable {
   private Graph graph;
   private CyclicBarrier cyclicBarrier;
   private PriorityBlockingQueue<GlobalMinNode> globalMinNodes;
   private int startNode;
   private int endNode;
   private int portNumber;
   private Node current;
   private AtomicBoolean isFinished;
   private List<Integer> visited;

   public ManagerThread(Graph graph, int startNode,
                        int endNode, CyclicBarrier cyclicBarrier,
                        PriorityBlockingQueue<GlobalMinNode> globalMinNodes,
                        int portNumber, Node current, AtomicBoolean isFinished,
                        List<Integer> visited){
       this.graph = graph;
       this.startNode = startNode;
       this.endNode = endNode;
       this.globalMinNodes = globalMinNodes;
       this.cyclicBarrier = cyclicBarrier;
       this.portNumber = portNumber;
       this.current = current;
       this.isFinished = isFinished;
       this.visited = visited;
   }

   @Override
    public void run(){
       List<Integer> fromWorker = new ArrayList<>();
       try(ServerSocket serverSocket = new ServerSocket(portNumber)){
           System.out.println("Connecting to " + portNumber);
           Socket socket = serverSocket.accept();

           //Setting up the w/r with a client
           ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
           ObjectInputStream objectInputStream = new ObjectInputStream(socket.getInputStream());

           objectOutputStream.writeObject(new SetupData(graph, startNode, endNode));
           objectOutputStream.reset();

           while (!isFinished.get()) {
               GlobalMinNode response = (GlobalMinNode) objectInputStream.readObject();

               objectOutputStream.writeObject(current);
               objectOutputStream.reset();

               globalMinNodes.add(response);

               cyclicBarrier.wait();

           }

           objectOutputStream.writeObject(current);
           objectOutputStream.reset();

           visited = (List<Integer>) objectInputStream.readObject();
           for (int i = startNode; i < endNode; i++){
               visited.set(i,fromWorker.get(i));
           }

           socket.close();

       } catch (IOException | InterruptedException | ClassNotFoundException e){
           e.printStackTrace();
       }
   }

}
