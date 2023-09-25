#include <common>
#include <packing>
#include <frag_h>
#include <sdf>
#include <rotate>

#ifdef RAMEN

	#define MARCH 64

#else

	#define MARCH 64

#endif

uniform vec3 cameraPosition;
uniform mat4 modelMatrixInverse;
uniform float uTime;
uniform float uTimeSeq;

float smoothAbs(float x)
{
    return sqrt(x*x+1e-3);
}


vec2 D( vec3 p ) {

	vec3 pp = p;
	vec2 d = vec2( 99999.0, 0.0 );

	#ifdef CHAHAN

		pp.xz *= rotate( PI / 8.0 );

		float n = 8.0;
		float h=floor(log2(n));
		float a =TPI*exp2(h)/n;

		for( int i = 0; i < int( h ) + 2; i++ ) {

			vec2 v = vec2( -cos( a ), sin( a ) );  
			float g = dot( pp.xz, v );
			pp.xz -= ( g - smoothAbs( g ) ) * v;
			a *= 0.5;
			
		}

		pp.y -= -0.15 + ( 1.0 - pow( 1.0 - linearstep( 0.5, 1.0, length( pp.xz ) ), 2.0 ) ) * 0.3;
		
		d = add( d, vec2( opRound( sdBox( pp, vec3( 0.85, 0.015, 0.85 ) ), 0.01 ), 0.0 ) );

	#endif

	#ifdef RAMEN

		// pp.y += (smoothstep( 1.0, 0.3, length( pp.xz ) ) - 0.5) * 0.5;
		
		float h = 0.4;
		float r = 0.45 + linearstep( -h * 0.85, h, pp.y ) * 0.5;
		
		d = add( d, vec2( sdCappedCylinder( pp, h, r ), 0.0 ) );
		d = sub( d, vec2( sdCappedCylinder( pp + vec3( 0.0, -0.1, 0.0 ), h, r * 0.95 ), 0.0 ) );
		d = max( d, pp.y - h * 0.8 );

	#endif

	return d;

}

vec3 N( vec3 pos, float delta ){

    return normalize( vec3(
		D( pos ).x - D( vec3( pos.x - delta, pos.y, pos.z ) ).x,
		D( pos ).x - D( vec3( pos.x, pos.y - delta, pos.z ) ).x,
		D( pos ).x - D( vec3( pos.x, pos.y, pos.z - delta ) ).x
	) );
	
}

void main( void ) {

	#include <frag_in>

	vec3 rayPos = ( modelMatrixInverse * vec4( vPos, 1.0 ) ).xyz;
	vec3 rayDir = normalize( ( modelMatrixInverse * vec4( normalize( vPos - cameraPosition ), 0.0 ) ).xyz );
	vec2 dist = vec2( 0.0 );
	bool hit = false;

	vec3 normal;
	
	for( int i = 0; i < MARCH; i++ ) { 

		dist = D( rayPos );		
		rayPos += dist.x * rayDir;

		if( dist.x < 0.001 ) {

			normal = N( rayPos, 0.0001 );
			hit = true;
			break;

		}
		
	}

	if( dist.y == 0.0 ) {
		
		outRoughness = 0.1;
		outMetalic = 0.0;
		outColor.xyz = vec3( 1.0, 1.0, 1.0 );
		
	}
		
	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;

	if( !hit ) discard;

	outPos = ( modelMatrix * vec4( rayPos, 1.0 ) ).xyz;

	#include <frag_out>

}