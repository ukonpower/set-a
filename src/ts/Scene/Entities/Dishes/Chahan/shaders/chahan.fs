#include <common>
#include <packing>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	// float dnv = vViewNormal
	
	#ifdef KOME

		outRoughness = 0.4;
		outColor.xyz *= vec3( 1.0, 0.90, 0.7 );

	#endif

	#ifdef NEGI

		outColor = vec4( 0.1, 0.5, 0.0, 1.0 );

	#endif

	#ifdef NIKU

		outColor = vec4( 0.4, 0.2, 0.1, 1.0 );

	#endif

	#ifdef TAMAGO

		outColor = vec4( 1.0, 0.9, 0.0, 1.0 );

	#endif

	#include <frag_out>

} 