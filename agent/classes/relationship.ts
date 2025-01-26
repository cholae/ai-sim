import { Memory } from "./memory";
import { RelationshipType } from "../enums/relationshipType";

export class Relationship {
    relation: RelationshipType;
    relationRating: number;
    interactionMemory: Memory[] = [];
  
    constructor(relation: RelationshipType, relationRating: number) {
      this.relation = relation;
      this.relationRating = relationRating;
    }

    addNewMemory(description: string, strength: number): void {
        const newMemory = new Memory(description, strength);
        if(newMemory.strength == undefined){
            console.warn("undefined strength for memory: " + newMemory.description);
            newMemory.strength = 3;
        }
        const index = this.findInsertIndex(strength);
        this.interactionMemory.splice(index, 0, newMemory);
        if (this.interactionMemory.length > 10) {
            this.interactionMemory.pop();
        }
    }

    describeMemories(): string {
        return this.interactionMemory
            .map(memory => memory.description)
            .join("\n");
    }
    
    private findInsertIndex(strength: number): number {
        let low = 0;
        let high = this.interactionMemory.length;

        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (this.interactionMemory[mid].strength < strength) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }
}