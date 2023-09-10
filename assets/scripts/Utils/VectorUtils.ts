import { Vec2, Vec3, misc } from "cc";

export class VectorUtils {
    public static GetVectorFromAngle(vec: Vec3 | Vec2, angle: number): Vec3 | Vec2 {
        //angle = 0 -> 360
        let angleRad = misc.degreesToRadians(angle);

        let xPrime = vec.x * Math.cos(angleRad) - vec.y * Math.sin(angleRad);
        let yPrime = vec.y * Math.sin(angleRad) + vec.y * Math.cos(angleRad);

        if (vec instanceof Vec2) {
            return new Vec2(xPrime, yPrime);
        }

        if (vec instanceof Vec3) {
            return new Vec3(xPrime, yPrime);
        }
    }

    public static ChangeToVec2(vec3: Vec3): Vec2 {
        return new Vec2(vec3.x || 0, vec3.y || 0);
    }

    public static ChangeToVec3(vec2: Vec2): Vec3 {
        return new Vec3(vec2.x || 0, vec2.y || 0, 0);
    }

    public static rotatePoint(point: Vec2 | Vec3, center: Vec2 | Vec3, angleInDegrees) {
        const angleInRadians = misc.degreesToRadians(angleInDegrees);
        const cosTheta = Math.cos(angleInRadians);
        const sinTheta = Math.sin(angleInRadians);

        const xPrime = center.x + (point.x - center.x) * cosTheta - (point.y - center.y) * sinTheta;
        const yPrime = center.y + (point.x - center.y) * sinTheta + (point.y - center.y) * cosTheta;


        if (point instanceof Vec2) {
            return new Vec2(xPrime, yPrime);
        }

        if (point instanceof Vec3) {
            return new Vec3(xPrime, yPrime);
        }
    }
}