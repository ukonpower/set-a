import * as GLP from 'glpower';

import skyboxFrag from './shaders/skybox.fs';
import { globalUniforms } from '~/ts/Globals';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

export class Skybox extends GLP.Entity {

	constructor() {

		super();

		this.addComponent( "geometry", new GLP.SphereGeometry( 500.0 ) );

		const mat = this.addComponent( "material", new GLP.Material( {
			name: "skybox",
			type: [ "deferred" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			frag: hotGet( 'skyboxFrag', skyboxFrag ),
			cullFace: false,
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/skybox.fs", ( module ) => {

				if ( module ) {

					mat.frag = hotUpdate( 'skyboxFrag', module.default );
					mat.requestUpdate();

				}

			} );

		}

	}

}
