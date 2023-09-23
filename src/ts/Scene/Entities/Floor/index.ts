import * as GLP from 'glpower';

import floorFrag from './shaders/floor.fs';
import { globalUniforms } from '~/ts/Globals';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';
import { TexProcedural } from '~/ts/libs/TexBaker';

import noiseFrag from './shaders/noise.fs';

export class Floor extends GLP.Entity {

	constructor() {

		super();

		const noiseTex = new TexProcedural( {
			frag: noiseFrag
		} );

		const mat = this.addComponent( "material", new GLP.Material( {
			name: "floor",
			type: [ "deferred", "shadowMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, {
				uTex: {
					value: noiseTex,
					type: '1i'
				}
			} ),
			frag: hotGet( 'floorFrag', floorFrag )
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/floor.fs", ( module ) => {

				if ( module ) {

					mat.frag = hotUpdate( 'floor', module.default );
					mat.requestUpdate();

				}

			} );

		}

	}

}
