package src.djikstras;
import java.util.concurrent.atomic.*;
public class ShareValue {
    private AtomicInteger val;
    public ShareValue(int initval){
        this.val = new AtomicInteger(initval);
    }
    public int get(){
        return this.val.intValue();
    }
    public boolean cas(int orival, int setval){
        return this.val.compareAndSet(orival, setval);
    }
}
