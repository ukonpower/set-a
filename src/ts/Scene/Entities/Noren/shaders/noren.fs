#include <common>

#include <packing>
#include <frag_h>

#ifdef HATA
	uniform sampler2D uTex;
#endif

in vec3 vId;

void main( void ) {

	#include <frag_in>

	#ifdef HATA
		outColor.xyz = vec3( 1.0, 0.25, 0.2 );
		outRoughness = 0.8;
		
		// vec2 uv = vUv;
		// uv.x /= 5.0;
		// uv.x += vId.y;
		// outColor.xyz = texture( uTex, uv ).xyz;
	#endif

	#ifdef BOU
		outColor.xyz = vec3( 0.2, 0.1, 0.05 );
		outRoughness = 0.8;
	#endif
	
	#include <frag_out>

} 