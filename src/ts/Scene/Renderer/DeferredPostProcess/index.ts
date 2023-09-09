import * as GLP from 'glpower';

import { gl, power } from "~/ts/Globals";
import { RenderCameraTarget } from '~/ts/libs/glpower_local/Framework/Component/Camera/RenderCamera';
import deferredShadingFrag from './shaders/deferredShading.fs';

export class DeferredPostProcess extends GLP.PostProcess {

	private shading: GLP.PostProcessPass;
	public rtDeferredShading: GLP.GLPowerFrameBuffer;

	constructor() {

		// shading

		const rtShading = new GLP.GLPowerFrameBuffer( gl, { disableDepthBuffer: true } );
		rtShading.setTexture( [
			power.createTexture().setting( { magFilter: gl.LINEAR, minFilter: gl.LINEAR, generateMipmap: false } ),
			power.createTexture().setting( { magFilter: gl.LINEAR, minFilter: gl.LINEAR, generateMipmap: false } )
		] );

		const shading = new GLP.PostProcessPass( {
			name: "deferredShading",
			frag: deferredShadingFrag,
			renderTarget: rtShading,
		} );

		super( { passes: [
			shading,
		] } );

		this.shading = shading;

		this.rtDeferredShading = rtShading;

	}

	protected resizeImpl( e: GLP.ComponentResizeEvent ): void {

		this.rtDeferredShading.setSize( e.resolution );

	}

	public setRenderTarget( renderTarget: RenderCameraTarget ) {

		renderTarget.gBuffer.textures.forEach( ( tex, index ) => {

			this.shading.uniforms[ "sampler" + index ] = {
				type: '1i',
				value: tex
			};

		} );

		this.shading.renderTarget = renderTarget.deferredBuffer;

	}

}
