import { GLPowerFrameBuffer } from "~/ts/libs/glpower_local/GLPowerFrameBuffer";
import { CameraParam, Camera } from "..";

export type RenderCameraTarget = {
	gBuffer: GLPowerFrameBuffer,
	deferredBuffer: GLPowerFrameBuffer,
	forwardBuffer: GLPowerFrameBuffer,
}

export interface RenderCameraParam extends CameraParam {
	renderTarget:RenderCameraTarget
}

export class RenderCamera extends Camera {

	public renderTarget: RenderCameraTarget;

	constructor( param: RenderCameraParam ) {

		super( param );

		this.renderTarget = param.renderTarget;

	}

}
