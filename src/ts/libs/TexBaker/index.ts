import * as GLP from 'glpower';
import { gl } from '~/ts/Globals';
import { Renderer } from '~/ts/Scene/Renderer';

export class TexProcedural extends GLP.GLPowerTexture {

	private frameBuffer: GLP.GLPowerFrameBuffer;

	constructor( param: GLP.PostProcessPassParam, resolution: GLP.Vector = new GLP.Vector( 1024, 1024 ) ) {

		super( gl );

		this.setting( {
			wrapS: gl.REPEAT,
			wrapT: gl.REPEAT,
		} );

		const renderer = new Renderer();

		renderer.resize( {
			resolution
		} );

		this.frameBuffer = new GLP.GLPowerFrameBuffer( gl ).setTexture( [ this ] ).setSize( 1024, 1024 );
		renderer.renderPostProcess( new GLP.PostProcess( { passes: [ new GLP.PostProcessPass( { ...param, renderTarget: this.frameBuffer } ) ] } ) );

	}

}
