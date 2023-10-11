#include <common>
#include <packing>
#include <frag_h>

uniform sampler2D uTex;
 
void main( void ) {

	#include <frag_in>

	vec4 col = texture( uTex, vUv );

	outColor.xyz = col.xyz;
	
	
	#include <frag_out>

} 