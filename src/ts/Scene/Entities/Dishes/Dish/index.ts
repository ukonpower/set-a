import * as GLP from 'glpower';

import safaFrag from './shaders/dish.fs';

export class Dish extends GLP.Entity {

	constructor( type: string = "CHAHAN" ) {

		super();

		const defines: any = {};
		defines[ type ] = '';

		let geo: GLP.Geometry | null = null;

		if ( type == "CHAHAN" ) {

			geo = new GLP.CylinderGeometry( 1.0, 1.0, 0.45, 8.0 );

		} else if ( type == 'RAMEN' ) {

			geo = new GLP.CylinderGeometry( 1.15, 0.5, 1.0, 32.0 );

		} else {

			geo = new GLP.CylinderGeometry( 1.0, 1.0, 0.45, 8.0 );

		}

		this.addComponent( "geometry", geo );

		this.addComponent( "material", new GLP.Material( {
			frag: safaFrag,
			defines,
		} ) );
		this.position.set( 0.0, - 0.08, 0.0 );
		this.add( this );

	}

}
