import { AI } from "../scripts/ai";

export interface Action{
    execute(ai:AI): void;
}