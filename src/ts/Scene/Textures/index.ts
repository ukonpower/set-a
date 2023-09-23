import { globalUniforms } from "~/ts/Globals";
import { TexProcedural } from "~/ts/libs/TexProcedural";

import noiseFrag from './shaders/noise.fs';

export const createTextures = () => {

	globalUniforms.tex.uNoiseTex = {
		value: new TexProcedural( {
			frag: noiseFrag
		} ),
		type: '1i'
	};

};
