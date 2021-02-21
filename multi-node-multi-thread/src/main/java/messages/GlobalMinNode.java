package messages;

public class GlobalMinNode {
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
}
