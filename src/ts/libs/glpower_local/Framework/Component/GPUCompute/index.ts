
import { GLPowerTexture } from '../../../GLPowerTexture';
import { GPUComputePass } from '../GPUComputePass';
import { PostProcess } from '../PostProcess';

export interface GPUComputeParam {
	input?: GLPowerTexture[];
	passes: GPUComputePass[];
}

export class GPUCompute extends PostProcess {

	constructor( param: GPUComputeParam ) {

		super( param );

	}

}
