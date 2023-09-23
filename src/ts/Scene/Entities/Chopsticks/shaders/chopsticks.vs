#include <common>
#include <vert_h>

layout ( location = 3 ) in float posY;

void main( void ) {

	#include <vert_in>

	// outPos.xz *= 1.0 - posY * 0.8;
	
	#include <vert_out>
	
}