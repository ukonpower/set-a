import * as GLP from 'glpower';

import skyFrag from './shaders/sky.fs';
import { globalUniforms } from '~/ts/Globals';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

export class Sky extends GLP.Entity {

	constructor() {

		super();

		const mat = this.addComponent( "material", new GLP.Material( {
			name: "cave",
			type: [ "deferred", "shadowMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			frag: hotGet( 'skyFrag', skyFrag )
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/sky.fs", ( module ) => {

				if ( module ) {

					mat.frag = hotUpdate( 'skyFrag', module.default );
					mat.requestUpdate();

				}

			} );

		}

	}

}
