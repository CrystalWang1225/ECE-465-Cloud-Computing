package djikstras;
class ThreadExample implements Runnable {
    ShareValue svobject;
    public ThreadExample(ShareValue svobject){
        this.svobject = svobject;
    }
    public void run() { 
            // Displaying the thread that is running
            int currentval;
            do{
                currentval = svobject.get();
            } while(!svobject.cas(currentval, currentval+1));
            System.out.println ("Thread " + 
                                Thread.currentThread().getId() + 
                                " sets value to " + (currentval+1)); 
    } 
}