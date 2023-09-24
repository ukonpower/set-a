import * as GLP from 'glpower';

import safaFrag from './shaders/dish.fs';

export class Dish extends GLP.Entity {

	constructor( type: string = "CHAHAN" ) {

		super();

		const defines: any = {};
		defines[ type ] = '';

		this.addComponent( "geometry", new GLP.CylinderGeometry( 1.0, 1.0, 0.45, 8.0 ) );
		this.addComponent( "material", new GLP.Material( {
			frag: safaFrag,
			defines,
		} ) );
		this.position.set( 0.0, - 0.08, 0.0 );
		this.add( this );

	}

}
