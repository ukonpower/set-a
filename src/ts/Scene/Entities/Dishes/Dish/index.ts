import * as GLP from 'glpower';

import safaFrag from './shaders/dish.fs';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

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

		} else if ( type == 'GYOZA' ) {

			geo = new GLP.CylinderGeometry( 1.5, 1.5, 0.45, 8.0 );


		} else {

			geo = new GLP.CylinderGeometry( 1.0, 1.0, 0.45, 8.0 );

		}

		this.addComponent( "geometry", geo );

		const mat = this.addComponent( "material", new GLP.Material( {
			frag: hotGet( "dishFrag", safaFrag ),
			defines,
		} ) );
		this.position.set( 0.0, - 0.08, 0.0 );
		this.add( this );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/dish.fs", ( module ) => {

				if ( module ) {

					mat.frag = hotUpdate( 'dishFrag', module.default );
					mat.requestUpdate();

				}

			} );

		}

	}

}
