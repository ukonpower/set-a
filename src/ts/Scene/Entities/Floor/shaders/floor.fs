#include <common>
#include <packing>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	outColor.xyz *= vec3( 0.35 );

	
	#include <frag_out>

} 