import * as GLP from 'glpower';
import { gl } from '~/ts/Globals';

import titleVert from './shaders/title.vs';
import titleFrag from './shaders/title.fs';

export class Title extends GLP.Entity {

	constructor( elm: string ) {

		super();

		const texture = new GLP.GLPowerTexture( gl );

		const img = document.createElement( "img" );
		img.src = "data:image/svg+xml," + elm;

		img.onload = () => {

			texture.attach( img );

		};

		this.addComponent( "geometry", new GLP.CubeGeometry( 0.6, 2.25, 0.85 ) );
		this.addComponent( "material", new GLP.Material( {
			frag: titleFrag,
			vert: titleVert,
			uniforms: GLP.UniformsUtils.merge( {
				uTex: {
					value: texture,
					type: "1i"
				}
			} ),
			cullFace: false,
		} ) );

	}

}
