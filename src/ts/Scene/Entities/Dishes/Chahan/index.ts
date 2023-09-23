import * as GLP from 'glpower';

import chahanVert from './shaders/chahan.vs';
import chahanFrag from './shaders/chahan.fs';
import { TurnTable } from '~/ts/Scene/Components/TurnTable';

export class Chahan extends GLP.Entity {

	constructor() {

		super();

		this.addComponent( 'rotateview', new TurnTable( 3 ) );

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

		const geos = [ new GLP.SphereGeometry( 0.05, 10, 5 ), new GLP.CubeGeometry( 0.05, 0.08, 0.01 ), new GLP.CubeGeometry( 0.06, 0.06, 0.06 ), new GLP.CubeGeometry( 0.05, 0.05, 0.05 ) ];

		for ( let i = 0; i < 4; i ++ ) {

			const para = new GLP.Entity();
			const parageo = geos[ i ];
			parageo.setAttribute( 'rnd', new Float32Array( ( ()=>{

				const num = [ 1000, 150, 50, 100, 0 ][ i ];

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
				defines: {
					'PARA': '',
					...[ { "KOME": '' }, { "NEGI": '' }, { "NIKU": '' }, { "TAMAGO": '' } ][ i ]
				}
			} ) );
			para.position.set( 0.0, 0.0, 0.0 );
			this.add( para );

		}


		// /*-------------------------------

		// -------------------------------*/

	}

}
