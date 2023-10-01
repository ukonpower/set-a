import * as GLP from 'glpower';

import { TurnTable } from '../../Components/TurnTable';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';
import rengeFrag from './shaders/renge.fs';

export class Renge extends GLP.Entity {

	constructor( ) {

		super();

		// this.addComponent( "turntable", new TurnTable( 1.5 ) );

		this.addComponent( "geometry", new GLP.CubeGeometry( 0.6, 2.25, 0.85 ) );
		const mat = this.addComponent( "material", new GLP.Material( {
			frag: hotGet( "rengeFrag", rengeFrag ),
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( [ "./shaders/renge.fs" ], ( module ) => {

				if ( module[ 0 ] ) {

					mat.frag = hotUpdate( 'rengeFrag', module[ 0 ].default );

				}

				mat.requestUpdate();

			} );

		}

	}

}
