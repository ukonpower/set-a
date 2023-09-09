import { Component, ComponentUpdateEvent } from "..";
import { Matrix } from "../../../Math/Matrix";
import { Vector } from "../../../Math/Vector";
import { Entity } from "../../Entity";

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

	public frustum: Vector[];

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

		this.frustum = [
			new Vector(),
			new Vector(),
			new Vector(),
			new Vector(),
			new Vector(),
			new Vector(),
			new Vector(),
		];

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

	protected updateImpl( event: ComponentUpdateEvent ): void {

		this.viewMatrixPrev.copy( this.viewMatrix );

		this.viewMatrix.copy( event.entity.matrixWorld ).inverse();

		this.projectionMatrixPrev.copy( this.projectionMatrix );



		[
			0, 1, 2, 3,
			4, 5, 6, 7,
			8, 9, 10, 11,
			12, 13, 14, 15,
		];

		// // Left clipping plane
		// this.frustum[ 0 ].x = elm[ 3 ] + elm[ 0 ];
		// this.frustum[ 0 ].y = elm[ 7 ] + elm[ 4 ];
		// this.frustum[ 0 ].z = elm[ 11 ] + elm[ 8 ];
		// this.frustum[ 0 ].w = elm[ 15 ] + elm[ 12 ];
		// // Right clipping plane
		// this.frustum[ 1 ].x = elm[ 3 ] - elm[ 0 ];
		// this.frustum[ 1 ].y = elm[ 7 ] - elm[ 4 ];
		// this.frustum[ 1 ].z = elm[ 11 ] - elm[ 8 ];
		// this.frustum[ 1 ].w = elm[ 15 ] - elm[ 12 ];
		// // Top clipping plane
		// this.frustum[ 2 ].x = elm[ 3 ] - elm[ 1 ];
		// this.frustum[ 2 ].y = elm[ 7 ] - elm[ 5 ];
		// this.frustum[ 2 ].z = elm[ 11 ] - elm[ 9 ];
		// this.frustum[ 2 ].w = elm[ 15 ] - elm[ 13 ];
		// // Bottom clipping plane
		// this.frustum[ 3 ].x = elm[ 3 ] + elm[ 1 ];
		// this.frustum[ 3 ].y = elm[ 7 ] + elm[ 5 ];
		// this.frustum[ 3 ].z = elm[ 11 ] + elm[ 9 ];
		// this.frustum[ 3 ].w = elm[ 15 ] + elm[ 13 ];

		// console.log( this.frustum[ 0 ], this.frustum[ 0 ].length() );


		if ( this.needsUpdate ) {

			this.updateProjectionMatrix();

		}

	}

	public checkFrustum( entity: Entity ) {

		const comboMatrix = this.projectionMatrix.clone().multiply( entity.matrixWorld.clone().multiply( this.viewMatrix ) );
		const elm = comboMatrix.elm;

		[
			0, 4, 8, 12,
			1, 5, 9, 13,
			2, 6, 10, 14,
			3, 7, 11, 15,
		];

		// https://stackoverflow.com/questions/12836967/extracting-view-frustum-planes-gribb-hartmann-method

		this.frustum[ 0 ].x = elm[ 12 ] + elm[ 0 ];
		this.frustum[ 0 ].y = elm[ 13 ] + elm[ 1 ];
		this.frustum[ 0 ].z = elm[ 14 ] + elm[ 2 ];
		this.frustum[ 0 ].w = elm[ 15 ] + elm[ 3 ];
		// Right clipping plane
		this.frustum[ 1 ].x = elm[ 12 ] - elm[ 0 ];
		this.frustum[ 1 ].y = elm[ 13 ] - elm[ 1 ];
		this.frustum[ 1 ].z = elm[ 14 ] - elm[ 2 ];
		this.frustum[ 1 ].w = elm[ 15 ] - elm[ 3 ];
		// Top clipping plane
		this.frustum[ 2 ].x = elm[ 12 ] - elm[ 4 ];
		this.frustum[ 2 ].y = elm[ 13 ] - elm[ 5 ];
		this.frustum[ 2 ].z = elm[ 14 ] - elm[ 6 ];
		this.frustum[ 2 ].w = elm[ 15 ] - elm[ 7 ];
		// Bottom clipping plane
		this.frustum[ 3 ].x = elm[ 12 ] + elm[ 4 ];
		this.frustum[ 3 ].y = elm[ 13 ] + elm[ 5 ];
		this.frustum[ 3 ].z = elm[ 14 ] + elm[ 6 ];
		this.frustum[ 3 ].w = elm[ 15 ] + elm[ 7 ];

		for ( let i = 0; i < 4; i ++ ) {

			// var dist = dot3( world_space_point.xyz, p_planes[ i ].xyz ) + p_planes[ i ].d + sphere_radius;

			const dist = this.frustum[ 1 ].dot( new Vector().applyMatrix4( entity.matrixWorld ) );

			console.log( dist );

			if ( dist < 0 ) return false; // sphere culled

		}

		return true;

	}

}
