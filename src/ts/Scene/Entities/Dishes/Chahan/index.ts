import * as GLP from 'glpower';

import chahanVert from './shaders/chahan.vs';
import chahanFrag from './shaders/chahan.fs';
import { TurnTable } from '~/ts/Scene/Components/TurnTable';
import { globalUniforms } from '~/ts/Globals';

export class Chahan extends GLP.Entity {

	constructor() {

		super();

		this.addComponent( 'rotateview', new TurnTable( 1 ) );

		/*-------------------------------
			Sara
		-------------------------------*/

		const sara = new GLP.Entity();
		sara.addComponent( "geometry", new GLP.CylinderGeometry( 1.0, 1.0, 0.05 ) );
		sara.addComponent( "material", new GLP.Material( {
			vert: chahanVert,
			defines: { 'SARA': '' }
		} ) );
		this.add( sara );

		/*-------------------------------
			PARAPARA
		-------------------------------*/

		const geos = [
			new GLP.SphereGeometry( 0.05, 10, 5 ),
			new GLP.CylinderGeometry( 0.03, 0.03, 0.02, 10, 10, false ),
			new GLP.CubeGeometry( 0.035, 0.1, 0.035, 1.0, 10.0, 1.0 ),
			new GLP.CubeGeometry( 0.05, 0.07, 0.02 )
		];

		for ( let i = 0; i < 4; i ++ ) {

			const para = new GLP.Entity();
			const parageo = geos[ i ];
			parageo.setAttribute( 'rnd', new Float32Array( ( ()=>{

				const num = [ 1000, 50, 20, 50, 0 ][ i ] * 1.0;

				const r: number[] = [];
				for ( let j = 0; j < num; j ++ ) {

					r.push( Math.random(), Math.random(), Math.random(), Math.random() );

				}

				return r;

			} )() ), 4, { instanceDivisor: 1 } );

			para.addComponent( "geometry", parageo );
			para.addComponent( "material", new GLP.Material( {
				name: "para" + i,
				vert: chahanVert,
				frag: chahanFrag,
				uniforms: GLP.UniformsUtils.merge( { uNoiseTex: globalUniforms.tex.uNoiseTex } ),
				defines: {
					'PARA': '',
					...[ { "KOME": '' }, { "NEGI": '' }, { "NIKU": '' }, { "TAMAGO": '' } ][ i ]
				},
				cullFace: false,
			} ) );
			para.position.set( 0.0, 0.0, 0.0 );
			this.add( para );

		}


		// /*-------------------------------

		// -------------------------------*/

	}

}
