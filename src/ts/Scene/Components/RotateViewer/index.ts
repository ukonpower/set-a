import * as GLP from 'glpower';

export class RotateViewer extends GLP.Component {

	private speed: number;

	public target: GLP.Vector;
	public rotBasePos: GLP.Vector;
	public rotSpeed: number;

	private quaternion: GLP.Quaternion;
	private matrix: GLP.Matrix;

	constructor( speed: number = 1.0 ) {

		super();

		this.speed = speed;

		this.target = new GLP.Vector( 0, 0, 0, 0 );
		this.rotBasePos = new GLP.Vector( 0, 0, 0 );
		this.rotSpeed = 0.3;

		this.quaternion = new GLP.Quaternion();
		this.matrix = new GLP.Matrix();

	}

	protected setEntityImpl( entity: GLP.Entity | null, prevEntity: GLP.Entity | null ): void {

		if ( entity ) {

			entity.on( "notice/sceneCreated", () => {

				this.rotBasePos.copy( entity.position );

			} );

		}

	}


	protected updateImpl( event: GLP.ComponentUpdateEvent ): void {

		const entity = event.entity;

		this.quaternion.setFromEuler( { x: 0, y: event.deltaTime / Math.PI * this.rotSpeed * this.speed, z: 0 } );
		this.matrix.identity().applyQuaternion( this.quaternion );

		this.rotBasePos.applyMatrix3( this.matrix );

		entity.position.copy( this.target );
		entity.position.add( this.rotBasePos );

	}


}
