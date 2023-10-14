import * as GLP from 'glpower';
import { gl } from '~/ts/Globals';

import titleVert from './shaders/title.vs';
import titleFrag from './shaders/title.fs';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

export class Title extends GLP.Entity {

	constructor( elm: string ) {

		super();

		const texture = new GLP.GLPowerTexture( gl );

		const img = document.createElement( "img" );
		img.src = "data:image/svg+xml," + encodeURIComponent( elm );

		img.onload = () => {

			texture.attach( img );

		};

		this.addComponent( "geometry", new GLP.PlaneGeometry( 2.0, 2.0 ) );
		const mat = this.addComponent( "material", new GLP.Material( {
			frag: hotGet( 'ttlFrag', titleFrag ),
			vert: hotGet( 'ttlVert', titleVert ),
			uniforms: GLP.UniformsUtils.merge( {
				uTex: {
					value: texture,
					type: "1i"
				}
			} ),
			type: [ "forward" ],
			depthTest: false
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/title.vs", ( module ) => {

				if ( module ) {

					mat.vert = hotUpdate( 'ttlVert', module.default );
					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( "./shaders/title.fs", ( module ) => {

				if ( module ) {

					mat.frag = hotUpdate( 'ttlFrag', module.default );
					mat.requestUpdate();

				}

			} );

		}

	}

}
