package src;

import src.djikstras.*;
import java.util.ArrayList;
import java.util.List;
class Main{
    public static void main(String[] args){
        //List<List<Integer>> edges = new ArrayList<>();
        ShareValue sv = new ShareValue(0);
        int n = 100; // Number of threads 
        //ArrayList<Thread> threads = new ArrayList<Thread>();
        //for (int i=0; i<n; i++) 
        //{ 
            Thread thobject = new Thread(new ThreadExample(sv));
            thobject.start();
            //threads.add(thobject);
        //}
        /*
        for (int i = 0; i < n; i++) {
            try {
                threads.get(i).join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        System.out.println("Final value: " + sv.get());*/
    }
}


