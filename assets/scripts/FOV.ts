import { _decorator, CCFloat, Component, ERaycast2DType, Graphics, misc, Node, PhysicsSystem2D, UITransform, Vec2, Vec3 } from 'cc';
import { VectorUtils } from './Utils/VectorUtils';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('FOV')
@executeInEditMode(true)
export class FOV extends Component {

    @property(CCFloat)
    private viewDistance: number = 100;

    @property(CCFloat)
    private fov: number = 90;

    private origin: Vec3;

    @property(CCFloat)
    private angle: number = 90;

    @property(CCFloat)
    private rayCount: number;

    @property(Graphics)
    private graphics: Graphics = null;

    private angleIncrease: number;

    private graphicsTransform: UITransform;

    vertices: Vec3[];
    physicsIntance: PhysicsSystem2D = PhysicsSystem2D.instance;

    protected onLoad(): void {
        this.graphicsTransform = this.graphics.node.getComponent(UITransform);
    }

    lateUpdate(deltaTime: number) {
        this.angleIncrease = this.fov / this.rayCount;
        this.vertices = new Array(this.rayCount + 1 + 1);

        this.origin = this.node.worldPosition;
        this.vertices[0] = this.origin;

        let angleDeg = this.angle / 2;

        for (let i = 1; i < this.vertices.length; i++) {
            const vecDir = VectorUtils.rotatePoint(this.node.up, Vec3.ZERO, angleDeg);

            let vecInWorld = new Vec3();

            vecInWorld.x = this.origin.x + (vecDir.x * this.viewDistance);
            vecInWorld.y = this.origin.y + (vecDir.y * this.viewDistance);

            this.vertices[i] = vecInWorld.clone();

            angleDeg -= this.angleIncrease;
        }

        //draw
        this.graphics.clear();
        let vecInLocal = this.graphicsTransform.convertToNodeSpaceAR(this.vertices[0]);
        this.graphics.moveTo(vecInLocal.x, vecInLocal.y);

        for (let i = 1; i < this.vertices.length; i++) {
            let results = this.physicsIntance?.raycast(new Vec2(this.vertices[0].x, this.vertices[0].y), new Vec2(this.vertices[i].x, this.vertices[i].y), ERaycast2DType.Closest);

            //ray hit object
            if (results.length > 0) {
                let point = results[0].point;
                let vecGraphics = this.graphicsTransform.convertToNodeSpaceAR(new Vec3(point.x, point.y));
                this.graphics.lineTo(vecGraphics.x, vecGraphics.y);
            }

            //ray not hit object
            if (results.length == 0) {
                let vecGraphics = this.graphicsTransform.convertToNodeSpaceAR(this.vertices[i]);

                this.graphics.lineTo(vecGraphics.x, vecGraphics.y);
            }
        }

        this.graphics.close();
        this.graphics.fill();
    }

    // update(deltaTime: number) {

    // }
}


