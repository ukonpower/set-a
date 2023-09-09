import * as GLP from 'glpower';
import { Pointer, PointerEventArgs } from '~/ts/libs/Pointer';

export class OrbitControls extends GLP.Component {

	private pointer: Pointer;
	private offsetPos: GLP.Vector;
	private offsetPosTmp: GLP.Vector;
	private matrixTmp: GLP.Matrix;

	constructor( targetElm: HTMLCanvasElement ) {

		super();

		this.pointer = new Pointer();
		this.offsetPos = new GLP.Vector();
		this.offsetPosTmp = new GLP.Vector();
		this.matrixTmp = new GLP.Matrix();

		this.pointer.registerElement( targetElm );

		let touching = false;

		this.pointer.on( "start", ( e: PointerEventArgs ) => {

			if ( touching ) return;

			touching = true;

		} );

		this.pointer.on( "move", ( e: PointerEventArgs ) => {

			if ( ! touching ) return;

			this.offsetPos.add( { x: e.delta.x * 0.003, y: e.delta.y * 0.003 } );

		} );

		this.pointer.on( "end", ( e: PointerEventArgs ) => {

			if ( ! touching ) return;

			touching = false;

			this.offsetPos.set( 0, 0 );

		} );

	}

	protected updateImpl( event: GLP.ComponentUpdateEvent ): void {

		const entity = event.entity;

		const qua = new GLP.Quaternion().copy( event.entity.quaternion );

		this.offsetPosTmp.set( this.offsetPos.x, - this.offsetPos.y, 0.0, 1.0 );
		this.offsetPos.applyMatrix4( this.matrixTmp.identity().applyQuaternion( qua ) );
		entity.matrixWorld.multiply( this.matrixTmp.identity().applyPosition( this.offsetPosTmp ) );

		// calc viewmatrix

		const cameraComponent = entity.getComponent<GLP.Camera>( "camera" );

		if ( cameraComponent ) {

			cameraComponent.viewMatrix.copy( entity.matrixWorld ).inverse();

		}

	}


}
