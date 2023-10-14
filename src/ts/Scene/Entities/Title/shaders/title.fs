#include <common>

#include <packing>
#include <frag_h>

uniform sampler2D uTex;

void main( void ) {

	#include <frag_in>

	vec4 c = texture( uTex, vUv );

	if( c.w < 0.5 ) {

		discard;
		
	}
	
	#include <frag_out>

} 