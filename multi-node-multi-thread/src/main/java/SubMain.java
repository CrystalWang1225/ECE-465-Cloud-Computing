/*Main2*/
import java.util.ArrayList;
import java.util.List;
import graphModel.*;
import multinodeModel.LocalDijkstras;
import multithread.*;
import util.*;
import validation.*;
import java.util.concurrent.PriorityBlockingQueue;

import java.time.Duration;
import java.time.Instant;

class SubMain {

    private static String inputFile, outputFile;
    public static void main(String[] args){
        Graph graph;
        try {
            int numThreads = Integer.parseInt(args[0]); //This should be equal to how many cores this node has
            int portNum = Integer.parseInt(args[1]);
            LocalDijkstras localRunner = new LocalDijkstras(portNum, numThreads);
            localRunner.setup();
            Instant startTime = Instant.now(); //for execution time
            localRunner.runDijkstras();
            Instant finish = Instant.now();
            long timeElapsed = Duration.between(startTime, finish).toMillis();
            System.out.println(timeElapsed);
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }
    }
}


