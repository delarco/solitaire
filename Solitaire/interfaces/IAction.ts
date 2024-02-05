export interface IAction {

    points: number
    execute(): void
    undo(): void
}
