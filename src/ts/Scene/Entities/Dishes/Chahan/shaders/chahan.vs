#include <common>
#include <vert_h>
#include <rotate>

#ifdef PARA
	layout (location = 3) in vec4 rnd;
#endif

void main( void ) {

	#include <vert_in>

	#ifdef PARA

		#ifdef KOME

			outPos.y *= 2.5;
			outPos *= 0.5;

		#endif

		// https://qiita.com/aa_debdeb/items/e416ae8a018692fc07eb

		float cosTheta = -2.0 * rnd.x + 1.0;
		float sinTheta = sqrt(1.0 - cosTheta * cosTheta);
		float phi = 1.0 * PI * rnd.y;
		vec3 o = vec3( sinTheta * cos(phi), sinTheta * sin(phi), cosTheta );
		o *= ( 0.6 + rnd.z * 0.04 );

		mat2 r = rotate( rnd.w * TPI );
		outPos.xy *= r;
		outNormal.xy *= r;

		mat3 rot = makeRotationDir( normalize( o ), vec3( 0.0, 1.0, 0.0 ) );
		outPos *= rot;
		outNormal *= rot;
		
		outPos += o;

	#endif
	
	#include <vert_out>
	
}