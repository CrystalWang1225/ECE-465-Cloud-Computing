package messages;

import java.io.Serializable;

public class GlobalMinNode implements Serializable, Comparable<GlobalMinNode> {
    private final int node, distance;
    public GlobalMinNode(int node, int distance){
        this.node = node;
        this.distance = distance;
    }
    public int getNode(){
        return node;
    }
    public int getDistance(){
        return distance;
    }

    @Override
    public int compareTo(GlobalMinNode other) {
        return Integer.compare(this.distance, other.getDistance());
    }
}
