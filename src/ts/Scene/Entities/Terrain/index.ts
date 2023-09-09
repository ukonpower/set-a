import * as GLP from 'glpower';

import terrainFrag from './shaders/terrain.fs';
import { globalUniforms } from '~/ts/Globals';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

export class Terrain extends GLP.Entity {

	constructor() {

		super();

		const mat = this.addComponent( "material", new GLP.Material( {
			name: "terrain",
			type: [ "deferred", "shadowMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			frag: hotGet( 'terrainFrag', terrainFrag )
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/terrain.fs", ( module ) => {

				if ( module ) {

					mat.frag = hotUpdate( 'terrainFrag', module.default );
					mat.requestUpdate();

				}

			} );

		}

	}

}
