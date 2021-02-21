import java.util.ArrayList;
import java.util.List;
import graphModel.*;
import multinodeModel.Manager;
import multithread.*;
import util.*;
import validation.*;
import java.util.concurrent.PriorityBlockingQueue;

import java.time.Duration;
import java.time.Instant;

class ManagerMain {

    private static String inputFile, outputFile;
    public static void main(String[] args){ //number of cores, number of nodes, edge density, port numbers
        Graph graph;
        try {
            int numCores = Integer.parseInt(args[0]);
            int portList[] = new int[numCores];
            if (args.length > 2 + numCores) { //with graph generation
                inputFile = "input" + args[1] + ".txt";
                graph = GraphUtils.generateGraphMatrix(Integer.parseInt(args[1]), Integer.parseInt(args[2]));
                IOUtils.writeGraph(inputFile, graph);
                for (int i = 0; i < numCores; i++){
                    portList[i] = Integer.parseInt(args[3 + i]);
                }
            } else {
                inputFile = args[1];
                graph = IOUtils.readGraph(inputFile);
                for (int i = 0; i < numCores; i++){
                    portList[i] = Integer.parseInt(args[2 + i]);
                }
            }


            outputFile = "output" + inputFile.substring(5);
            Instant startTime = Instant.now(); //for execution time
            List<Integer> results = runDijkstra(graph, numCores, portList);
            Instant finish = Instant.now();
            long timeElapsed = Duration.between(startTime, finish).toMillis();
            IOUtils.writeResults(outputFile, results, timeElapsed);
        } catch (InvalidDataException e) {
            System.out.println(e.getMessage());
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }



    }

    private static List<Integer> runDijkstra(Graph graph, int numCores, int[] portList){

        Manager manager = new Manager();
        List<Integer> result = manager.multiDijk(graph, numCores, portList);
        return result;

}



    }
