package djikstras;
import java.util.concurrent.*;
class Main{
    public static void main(String[] args){
        int n = 20; // Number of threads 
        ShareValue sv = new ShareValue(0);
        ExecutorService es = Executors.newCachedThreadPool();
        for (int i=0; i<n; i++) 
        { 
            es.execute(new ThreadExample(sv)); 
        }
    }
}


