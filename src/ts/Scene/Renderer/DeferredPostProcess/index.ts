import * as GLP from 'glpower';

import { RenderCameraTarget } from '~/ts/libs/glpower_local/Framework/Component/Camera/RenderCamera';
import deferredShadingFrag from './shaders/deferredShading.fs';

export class DeferredPostProcess extends GLP.PostProcess {

	private shading: GLP.PostProcessPass;

	constructor() {

		const shading = new GLP.PostProcessPass( {
			name: "deferredShading",
			frag: deferredShadingFrag,
		} );

		super( { passes: [
			shading,
		] } );

		this.shading = shading;

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
