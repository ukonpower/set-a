import * as GLP from 'glpower';

import norenVert from './shaders/noren.vs';
import norenFrag from './shaders/noren.fs';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';
import { globalUniforms } from '~/ts/Globals';

export class Noren extends GLP.Entity {

	constructor() {

		super();

		const height = 1.25;

		/*-------------------------------
			bou
		-------------------------------*/

		const bou = new GLP.Entity();

		bou.addComponent( 'geometry', new GLP.CylinderGeometry( 0.025, 0.025, 10.0 ) );
		const matBou = bou.addComponent( 'material', new GLP.Material( {
			vert: hotGet( 'norenVert', norenVert ),
			frag: hotGet( 'norenFrag', norenFrag ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			defines: { 'BOU': '' },
		} ) );

		bou.quaternion.multiply( new GLP.Quaternion().setFromEuler( new GLP.Euler( 0, 0, Math.PI / 2 ) ) );
		bou.position.set( 0, height / 2, 0 );

		this.add( bou );

		/*-------------------------------
			Hata
		-------------------------------*/

		const hata = new GLP.Entity();
		const hataGeo = new GLP.PlaneGeometry( 1.0, 1.25, 1.0, 20.0 );
		hataGeo.setAttribute( 'id', new Float32Array( ( ()=>{

			const num = 5;

			const r: number[] = [];
			for ( let i = 0; i < num; i ++ ) {

				r.push( i / ( num - 1.0 ), Math.random(), Math.random() );

			}

			return r;

		} )() ), 3, { instanceDivisor: 1 } );

		hata.addComponent( 'geometry', hataGeo );
		const mat = hata.addComponent( 'material', new GLP.Material( {
			vert: hotGet( 'norenVert', norenVert ),
			frag: hotGet( 'norenFrag', norenFrag ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			defines: { 'HATA': '' },
			cullFace: false,
		} ) );

		this.add( hata );

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/noren.vs', ( module ) => {

				if ( module ) {

					matBou.vert = hotUpdate( 'norenVert', module.default );
					matBou.requestUpdate();

					mat.vert = hotUpdate( 'norenVert', module.default );
					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/noren.fs', ( module ) => {

				if ( module ) {

					matBou.frag = hotUpdate( 'norenFrag', module.default );
					matBou.requestUpdate();

					mat.frag = hotUpdate( 'norenFrag', module.default );
					mat.requestUpdate();

				}

			} );

		}



	}

}
