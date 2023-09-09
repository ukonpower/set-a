import { GLPowerFrameBuffer } from "~/ts/libs/glpower_local/GLPowerFrameBuffer";
import { Quaternion } from "~/ts/libs/glpower_local/Math/Quaternion";
import { CameraParam, Camera } from "..";
import { ComponentUpdateEvent } from "../..";

export interface ShadowMapCameraParam extends CameraParam {
	renderTarget: GLPowerFrameBuffer | null,
}

export class ShadowMapCamera extends Camera {

	public renderTarget: GLPowerFrameBuffer | null;
	private viewMatrixOffset: Quaternion;

	constructor( param: ShadowMapCameraParam ) {

		super( param );

		this.renderTarget = param.renderTarget;
		this.viewMatrixOffset = new Quaternion().setFromEuler( { x: - Math.PI / 2, y: 0, z: 0 } );

	}

	protected updateImpl( event: ComponentUpdateEvent ): void {

		this.viewMatrix.copy( event.entity.matrixWorld ).applyQuaternion( this.viewMatrixOffset ).inverse();

	}

}
