import { Component, ComponentUpdateEvent } from "..";
import { Matrix } from "../../../Math/Matrix";

export type CameraType = 'perspective' | 'orthographic'
export interface CameraParam {
	cameraType?: CameraType;
	fov?: number;
	near?: number;
	far?: number;
	orthWidth?: number;
	orthHeight?: number;
}

export class Camera extends Component {

	public cameraType: CameraType;

	public fov: number;
	public aspect: number;
	public near: number;
	public far: number;

	public orthWidth: number;
	public orthHeight: number;

	public projectionMatrix: Matrix;
	public viewMatrix: Matrix;

	public projectionMatrixPrev: Matrix;
	public viewMatrixPrev: Matrix;

	public needsUpdate: boolean;

	constructor( param: CameraParam ) {

		super();

		param = param || {};

		this.cameraType = param.cameraType || 'perspective';

		this.viewMatrix = new Matrix();
		this.projectionMatrix = new Matrix();

		this.viewMatrixPrev = new Matrix();
		this.projectionMatrixPrev = new Matrix();

		this.needsUpdate = false;

		this.fov = param.fov || 50;
		this.near = param.near || 0.01;
		this.far = param.far || 1000;
		this.aspect = 1.0;

		this.orthWidth = param.orthWidth || 1;
		this.orthHeight = param.orthHeight || 1;

		this.needsUpdate = true;

	}

	public updateProjectionMatrix() {

		this.projectionMatrixPrev.copy( this.projectionMatrix );

		if ( this.cameraType == 'perspective' ) {

			this.projectionMatrix.perspective( this.fov, this.aspect, this.near, this.far );

		} else {

			this.projectionMatrix.orthographic( this.orthWidth, this.orthHeight, this.near, this.far );

		}

		this.needsUpdate = false;

	}

	protected afterUpdateImpl( event: ComponentUpdateEvent ): void {

		this.viewMatrixPrev.copy( this.viewMatrix );

		this.viewMatrix.copy( event.entity.matrixWorld ).inverse();

		if ( this.needsUpdate ) {

			this.updateProjectionMatrix();

		}

	}

}
