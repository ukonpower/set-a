#include <common>
#include <packing>
#include <frag_h>

#include <re>

uniform vec3 cameraPosition;
uniform vec2 uResolution;
uniform float uAspectRatio;


void main( void ) {

	#include <frag_in>

	outColor *= 0.5;
	
	#include <frag_out>

} 