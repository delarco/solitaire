import { IAnimation } from "../interfaces/IAnimation"

export class Animator {

    public static animations: Array<IAnimation> = []

    public static add(animation: IAnimation): void {

        const previousAnimation = this.animations.find(f => f.gameObject === animation.gameObject)

        if (previousAnimation) {

            previousAnimation.kill()

            // remove
            this.animations = this.animations.filter(animation => animation !== previousAnimation)

            // recalc
            animation.init()
        }

        this.animations.push(animation)
    }

    public static update(time: number, deltaTime: number): void {

        Animator.animations.forEach(animation => animation.update(time, deltaTime))
        this.animations = this.animations.filter(f => !f.done)
    }
}
