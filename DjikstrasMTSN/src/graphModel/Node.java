package src.graphModel;

import java.util.concurrent.atomic.AtomicInteger;

public class Node implements Comparable<Node> {
    private int node;
    private AtomicInteger distance = new AtomicInteger();

    public Node(int node, int distance) {
        this.node = node;
        this.distance.set(distance);
    }

    public int getNode() {
        return node;
    }

    public int getDistance() {
        return distance.intValue();
    }

    public void setNode(int node) {
        this.node = node;
    }

    public void setDistance(int distance){
        this.distance.set(distance);
    }

    public boolean casDistance(int expectedVal, int newVal) {
        return this.distance.compareAndSet(expectedVal, newVal);
    }

    @Override
    public int compareTo(Node node) {
        return Double.compare(this.distance.intValue(), node.distance.intValue());
    }

    @Override
    public String toString() {
        return "Node{" +
                "node=" + node +
                ", distance=" + distance +
                '}';
    }
}