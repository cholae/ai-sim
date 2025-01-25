import { AI } from "../classes/ai";

export interface Action{
    execute(ai:AI): Promise<void>;
}