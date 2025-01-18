import { Memory } from "./memory";

export class Relationship {
    relation: string;
    relationRating: number;
    interactionMemory: Memory[] = [];
  
    constructor(relation: string, relationRating: number) {
      this.relation = relation;
      this.relationRating = relationRating;
    }

    addMemory(description: string, strength: number): void {
        const newMemory = new Memory(description, strength);
    
        // Insert the memory into the correct position to maintain sorted order
        const index = this.findInsertIndex(strength);
        this.interactionMemory.splice(index, 0, newMemory);
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