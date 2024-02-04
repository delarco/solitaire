import { IAnimation } from "../interfaces/IAnimation"

export class Animator {

    public static animations: Array<IAnimation> = []

    public static add(animation: IAnimation): void {

        if (this.animations.find(f => f.gameObject === animation.gameObject)) {

            // remove
            this.animations = this.animations.filter(f => f.gameObject !== animation.gameObject)

            // recalc
            animation.init()
        }

        this.animations.push(animation)
    }

    public static update(time: number, deltaTime: number): void {

        Animator.animations.forEach(animation => animation.update(time))
        this.animations = this.animations.filter(f => !f.done)
    }
}
