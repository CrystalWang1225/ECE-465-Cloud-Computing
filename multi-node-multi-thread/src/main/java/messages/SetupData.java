package messages;

import graphModel.*;

import java.io.Serializable;

public class SetupData implements Serializable {
    private final Graph graph;
    private final int firstNode, lastNode;

    public SetupData(Graph graph, int firstNode, int lastNode){
        this.graph = graph;
        this.firstNode = firstNode;
        this.lastNode = lastNode;
    }

    public Graph getGraph(){
        return graph;
    }

    public int getFirstNode(){
        return firstNode;
    }

    public int getLastNode(){
        return lastNode;
    }
}
