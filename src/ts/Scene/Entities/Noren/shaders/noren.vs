#include <common>
#include <vert_h>

uniform float uTime;

#ifdef HATA
layout (location = 3) in vec3 id;
#endif

out vec3 vId;

void main( void ) {

	#include <vert_in>

	#ifdef HATA
		outPos.x += ( id.x - 0.5 ) * 4.2;
		outPos.z += sin( uTime * 2.0 + outPos.y * 3.0 + id.x * 3.0 ) * 0.1 * (outPos.y - 0.625);
		vId = id;
	#endif


	#include <vert_out>
	
}