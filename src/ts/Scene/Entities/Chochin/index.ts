import * as GLP from 'glpower';

import chochinVert from './shaders/chochin.vs';
import chochinFrag from './shaders/chochin.fs';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

export class Chochin extends GLP.Entity {

	constructor() {

		super();

		const d = 3.0;

		const left = new GLP.Entity();
		left.addComponent( "geometry", new GLP.SphereGeometry( 1.0 ) );
		left.position.set( - d, 0, 0 );
		const matL = left.addComponent( "material", new GLP.Material( {
			vert: chochinVert,
			frag: hotGet( "chochinFrag", chochinFrag ),
		} ) );

		this.add( left );

		const right = new GLP.Entity();
		right.addComponent( "geometry", new GLP.SphereGeometry( 1.0 ) );
		right.position.set( d, 0, 0 );
		const matR = right.addComponent( "material", new GLP.Material( {
			vert: chochinVert,
			frag: hotGet( "chochinFrag", chochinFrag ),
		} ) );

		this.add( right );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/chochin.fs", ( module ) => {

				if ( module ) {

					matR.frag = matL.frag = hotUpdate( "chochinFrag", module.default );
					matL.requestUpdate();
					matR.requestUpdate();

				}

			} );

		}

	}

}
