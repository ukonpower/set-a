import * as GLP from 'glpower';

export class LookAt extends GLP.Component {

	private target: GLP.Entity | null;

	private up: GLP.Vector;
	private entityWorldPos: GLP.Vector;
	private targetWorldPos: GLP.Vector;

	public enable: boolean;

	constructor() {

		super();

		this.target = null;
		this.entityWorldPos = new GLP.Vector();
		this.targetWorldPos = new GLP.Vector();
		this.up = new GLP.Vector( 0.0, 1.0, 0.0 );

		this.enable = true;

	}

 	public setTarget( target: GLP.Entity | null ) {

		this.target = target;

	}

	protected updateImpl( event: GLP.ComponentUpdateEvent ): void {

		if ( this.entity && this.target && this.enable ) {

			this.entity.matrixWorld.decompose( this.entityWorldPos );
			this.target.matrix.decompose( this.targetWorldPos );

			this.entity.matrixWorld.lookAt( this.entityWorldPos, this.targetWorldPos, this.up );

			const camera = this.entity.getComponent<GLP.Camera>( 'camera' );

			if ( camera ) {

				camera.viewMatrix.copy( this.entity.matrixWorld ).inverse();

			}

		}

	}

}
